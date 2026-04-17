import pandas as pd
import numpy as np
import uvicorn
from sqlalchemy import create_engine, text
from fastapi import FastAPI
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from contextlib import asynccontextmanager

# --- CONFIGURATION ---
DATABASE_URL = "postgresql://postgres:stud@localhost:5432/MyApiDB"
engine = create_engine(DATABASE_URL)
ml_model = {}


def load_data_and_train():

    print("Loading movies and global metadata...")

    query = text("""
        SELECT 
            m.id, 
            m.title, 
            m.overview, 
            string_agg(DISTINCT g.name, ' ') as genres,
            COALESCE(AVG(log.personal_grade), 0) as avg_rating
        FROM movies m
        LEFT JOIN movie_genres mg ON m.id = mg.movie_id
        LEFT JOIN genre g ON mg.genre_id = g.id
        LEFT JOIN user_movie_log log ON m.id = log.movie_id
        GROUP BY m.id
    """)

    with engine.connect() as conn:
        df = pd.read_sql(query, conn)

    # Weight genres by repeating them in the text block
    df['combined_features'] = (df['genres'].fillna('') + " ") * 2 + df['overview'].fillna('')

    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['combined_features'])

    ml_model['df'] = df
    ml_model['tfidf_matrix'] = tfidf_matrix
    ml_model['id_to_idx'] = {movie_id: i for i, movie_id in enumerate(df['id'])}
    print("Hybrid Model Ready.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_data_and_train()
    yield
    ml_model.clear()


app = FastAPI(lifespan=lifespan)


# --- HYBRID HELPERS ---

def get_collaborative_candidates(user_id: int):
    """Finds movies liked by users with similar taste."""
    with engine.connect() as conn:

        user_likes_query = text("SELECT movie_id FROM user_movie_log WHERE user_id = :uid AND personal_grade >= 7")
        user_movies_df = pd.read_sql(user_likes_query, conn, params={"uid": user_id})

        # FIX: Convert to standard Python integers
        user_movies = [int(x) for x in user_movies_df['movie_id'].tolist()]

        if not user_movies:
            return {}

        others_query = text("""
            SELECT user_id, movie_id, personal_grade 
            FROM user_movie_log 
            WHERE movie_id IN :m_ids AND user_id != :uid AND personal_grade >= 7
        """)

        others = pd.read_sql(others_query, conn, params={"m_ids": tuple(user_movies), "uid": user_id})

        if others.empty:
            return {}

         # 'taste-mates'
        similar_users = [int(x) for x in others['user_id'].unique()]

        if not similar_users:
            return {}

        recs_query = text("""
            SELECT movie_id, AVG(personal_grade) as collab_score
            FROM user_movie_log
            WHERE user_id IN :u_ids AND movie_id NOT IN :m_ids
            GROUP BY movie_id
            HAVING AVG(personal_grade) >= 7
        """)

        collab_recs = pd.read_sql(recs_query, conn, params={
            "u_ids": tuple(similar_users),
            "m_ids": tuple(user_movies)
        })

        return dict(zip(collab_recs['movie_id'], collab_recs['collab_score'] / 10.0))

@app.get("/recommend/{user_id}")
async def recommend_movies(user_id: int):
    df = ml_model.get('df')
    tfidf_matrix = ml_model.get('tfidf_matrix')
    id_to_idx = ml_model.get('id_to_idx')

    if df is None:
        return {"error": "Model not initialized"}

    with engine.connect() as conn:
        user_logs = pd.read_sql(text("SELECT movie_id, personal_grade FROM user_movie_log WHERE user_id = :uid"),
                                conn, params={"uid": user_id})

    collab_scores = get_collaborative_candidates(user_id)


    user_prof = np.zeros(tfidf_matrix.shape[1])
    for _, row in user_logs.iterrows():
        idx = id_to_idx.get(row['movie_id'])
        if idx is not None:

            user_prof += tfidf_matrix[idx].toarray().flatten() * (row['personal_grade'] / 10.0)

    content_sim = cosine_similarity(np.asarray(user_prof).reshape(1, -1), tfidf_matrix).flatten()


    final_scores = []
    seen_ids = set(user_logs['movie_id'].tolist())

    for i, row in df.iterrows():
        m_id = row['id']
        if m_id in seen_ids:
            continue

        c_sim = content_sim[i]
        c_coll = collab_scores.get(m_id, 0)
        c_glob = row['avg_rating'] / 10.0

        total_score = (c_sim * 0.5) + (c_coll * 0.3) + (c_glob * 0.2)

        final_scores.append({
            "id": int(m_id),
            "title": row['title'],
            "final_score": round(total_score, 4),
            "breakdown": {
                "content_similarity": round(c_sim, 2),
                "collaborative_boost": round(c_coll, 2),
                "global_popularity": round(c_glob, 2)
            }
        })


    final_scores = sorted(final_scores, key=lambda x: x['final_score'], reverse=True)
    return final_scores[:10]


@app.get("/stats/logs")
async def get_log_trends(days: int = 30):
    with engine.connect() as conn:
        # Get the individual watch dates from the element collection table
        query = text("""
            SELECT watch_date 
            FROM user_movie_watch_dates 
            WHERE watch_date >= CURRENT_DATE - :days
        """)
        df = pd.read_sql(query, conn, params={"days": days})

        # Get distinct movies for the average calculation
        movie_query = text("SELECT COUNT(DISTINCT movie_id) FROM user_movie_log")
        total_movies = conn.execute(movie_query).scalar() or 1

    if df.empty:
        return {"chartData": [], "average": 0.0}

    # Pandas Magic: Group by day and fill missing days
    df['watch_date'] = pd.to_datetime(df['watch_date'])
    daily_counts = df.set_index('watch_date').resample('1D').size().reset_index(name='count')

    chart_data = [
        {"date": row['watch_date'].strftime('%Y-%m-%d'), "count": int(row['count'])}
        for _, row in daily_counts.iterrows()
    ]

    average = round(len(df) / days / total_movies, 1)

    return {"chartData": chart_data, "average": average}


@app.get("/stats/reviews")
async def get_review_trends(days: int = 30):
    with engine.connect() as conn:
        # Get the creation dates from the reviews table
        # We cast/date_trunc it to ensure we are just looking at the date part
        query = text("""
            SELECT created_at 
            FROM reviews 
            WHERE created_at >= CURRENT_DATE - :days
        """)
        df = pd.read_sql(query, conn, params={"days": days})

        # Get distinct movies that have been reviewed for the average calculation
        movie_query = text("SELECT COUNT(DISTINCT movie_id) FROM reviews")
        total_movies = conn.execute(movie_query).scalar() or 1

    if df.empty:
        return {"chartData": [], "average": 0.0}

    # Pandas Magic: Group by day and fill missing days
    df['created_at'] = pd.to_datetime(df['created_at'])

    # Normalize removes the hours/minutes/seconds so resampling by day is perfectly accurate
    df['created_at'] = df['created_at'].dt.normalize()

    daily_counts = df.set_index('created_at').resample('1D').size().reset_index(name='count')

    chart_data = [
        {"date": row['created_at'].strftime('%Y-%m-%d'), "count": int(row['count'])}
        for _, row in daily_counts.iterrows()
    ]

    # Average: Reviews / Days / Unique Movies Reviewed
    average = round(len(df) / days / total_movies, 1)

    return {"chartData": chart_data, "average": average}

@app.get("/stats/top-movies")
async def get_top_movies(limit: int = 5):
    with engine.connect() as conn:
        query = text("""
            SELECT m.title, m.api_id, COUNT(l.id) as total_logs, AVG(l.personal_grade) as avg_grade
            FROM user_movie_log l
            JOIN movies m ON l.movie_id = m.id
            GROUP BY m.id, m.title, m.api_id
            ORDER BY total_logs DESC, avg_grade DESC  -- Primary sort: Logs, Secondary sort: Grade
            LIMIT :limit
        """)
        df = pd.read_sql(query, conn, params={"limit": limit})
        return df.to_dict(orient="records")

    return df.to_dict(orient="records")
@app.get("/stats/general")
async def get_general_stats():
    with engine.connect() as conn:
        # NOTE: If your Spring Boot user table is named something else
        # (like 'users' or 'app_user' because 'user' is a reserved keyword in Postgres),
        # update the table name below!
        total_users_query = text("SELECT COUNT(id) FROM users")
        total_reviews_query = text("SELECT COUNT(id) FROM reviews")
        total_logs_query = text("SELECT COUNT(id) FROM user_movie_log")

        # .scalar() grabs the first column of the first row directly
        total_users = conn.execute(total_users_query).scalar() or 0
        total_reviews = conn.execute(total_reviews_query).scalar() or 0
        total_logs = conn.execute(total_logs_query).scalar() or 0

    return {
        "totalUsers": total_users,
        "totalReviews": total_reviews,
        "totalLogs": total_logs
    }
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)