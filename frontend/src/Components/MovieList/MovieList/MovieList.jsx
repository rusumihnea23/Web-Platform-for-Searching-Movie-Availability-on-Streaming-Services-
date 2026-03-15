import Movie from "../Movie/Movie"


export default function MovieList({ Movies, max }) {
    //max nr de filme pe care le vreau

    return (
        <div className="flex flex-row flex-wrap gap-2 justify-center w-ful">
            {
                Movies.slice(0, max).map((movie) => {
                    return <Movie key={movie.id} poster_path={movie.poster_path} title={movie.title} />
                })
            }
        </div>

    )
}