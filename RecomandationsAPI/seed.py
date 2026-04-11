import os
import requests
import psycopg2
from dotenv import load_dotenv


load_dotenv()


TMDB_TOKEN = os.getenv("TMDB_API_KEY")
DB_PARAMS = {
    "host": os.getenv("DB_HOST"),
    "database": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASS"),
    "port": "5432"
}


def seed_movies(pages=50):
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()
        print("✅ Conexiune la baza de date reușită!")
    except Exception as e:
        print(f" Eroare la conectarea DB: {e}")
        return


    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {TMDB_TOKEN}"
    }

    print(f"🚀 Încep importul pentru {pages * 20} filme...")

    for page in range(1, pages + 1):
        url = f"https://api.themoviedb.org/3/movie/popular?language=en-US&page={page}"

        try:
            response = requests.get(url, headers=headers)

            if response.status_code != 200:
                print(f" Eroare API la pagina {page}: {response.status_code} - {response.text}")
                break

            data = response.json()
            results = data.get('results', [])
        except Exception as e:
            print(f" Eroare la request (pagina {page}): {e}")
            continue

        for m in results:
            try:

                cur.execute("""
                            INSERT INTO movies (title, api_id, overview, release_date, poster_path)
                            VALUES (%s, %s, %s, %s, %s)
                            ON CONFLICT (api_id) DO UPDATE 
                            SET title = EXCLUDED.title,
                                overview = EXCLUDED.overview,
                                release_date = EXCLUDED.release_date,
                                poster_path = EXCLUDED.poster_path
                            RETURNING id;
                        """, (m['title'], m['id'], m['overview'], m['release_date'], m['poster_path']))

                result = cur.fetchone()
                if result:
                    movie_internal_id = result[0]


                    genre_ids = m.get('genre_ids', [])
                    for g_id in genre_ids:

                        cur.execute("""
                                    INSERT INTO movie_genres (movie_id, genre_id)
                                    VALUES (%s, %s)
                                    ON CONFLICT DO NOTHING;
                                """, (movie_internal_id, g_id))
            except Exception as e:
                print(f"️ Eroare la filmul '{m.get('title')}': {e}")
                conn.rollback()
                continue

        conn.commit()
        print(f"✅ Pagina {page}/{pages} salvată cu succes.")

    cur.close()
    conn.close()
    print("\n Seeding complet! Tabela 'movies' a fost populată.")


if __name__ == "__main__":
    seed_movies(50)