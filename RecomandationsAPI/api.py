import pandas as pd
from sqlalchemy import create_engine
from fastapi import FastAPI
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = FastAPI()

DATABASE_URL = "postgresql://postgres:stud@localhost:5432/MyApiDB"
engine = create_engine(DATABASE_URL)


def get_movie_data():
    query = """
    SELECT m.id, m.title, m.overview, 
           string_agg(g.name, ' ') as genres
    FROM movies m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genre g ON mg.genre_id = g.id
    GROUP BY m.id
    """
    df = pd.read_sql(query, engine)
    df['combined_features'] = df['genres'].fillna('') + " " + df['overview'].fillna('')
    return df


def get_user_preferences(user_id):

    query_logs = f"SELECT movie_id, personal_grade FROM user_movie_log WHERE user_id = {user_id}"
    logs = pd.read_sql(query_logs, engine)


    query_likes = f"""
    SELECT r.movie_id 
    FROM review_likes rl
    JOIN reviews r ON rl.review_id = r.id
    WHERE rl.user_id = {user_id}
    """
    likes = pd.read_sql(query_likes, engine)
    return logs, likes


@app.get("/recommend/{user_id}")
def recommend_movies(user_id: int):
    movies_df = get_movie_data()
    user_logs, user_likes = get_user_preferences(user_id)

    movies_df = get_movie_data()
    user_logs, user_likes = get_user_preferences(user_id)

    if user_logs.empty and user_likes.empty:

        top_random = movies_df.head(10)
        return [{"id": int(row['id']), "title": row['title'], "score": 0.0} for _, row in top_random.iterrows()]


    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(movies_df['combined_features'])

    user_profile_vector = np.zeros((1, tfidf_matrix.shape[1]))

    for _, row in user_logs.iterrows():
        idx = movies_df.index[movies_df['id'] == row['movie_id']]
        if not idx.empty:
            weight = row['personal_grade'] / 10.0
            user_profile_vector += tfidf_matrix[idx[0]] * weight


    for _, row in user_likes.iterrows():
        idx = movies_df.index[movies_df['id'] == row['movie_id']]
        if not idx.empty:
            user_profile_vector += tfidf_matrix[idx[0]] * 0.5

    cosine_sim = cosine_similarity(np.asarray(user_profile_vector), tfidf_matrix)


    seen_movie_ids = user_logs['movie_id'].tolist()
    similar_indices = cosine_sim[0].argsort()[::-1]

    recommendations = []
    for i in similar_indices:
        m_id = int(movies_df.iloc[i]['id'])
        if m_id not in seen_movie_ids:
            recommendations.append({
                "id": m_id,
                "title": movies_df.iloc[i]['title'],
                "score": float(cosine_sim[0][i])
            })
        if len(recommendations) >= 10: break

    return recommendations


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)