const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3"



export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=kr`)
    .then(res => res.json())
}

export function getPopularMovies() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=en-US&page=1&region=kr`)
    .then(res => res.json())
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1&region=kr`)
    .then(res => res.json())
}


