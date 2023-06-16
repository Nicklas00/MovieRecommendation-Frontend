import { apiConst } from "./api.js";
import { ui } from "./ui.js";

const MOVIE_GENRE = apiConst.BASE_URL + "discover/movie?with_genres=";
const GENRE_LIST = "https://api.themoviedb.org/3/genre/movie/list";

let apiStrings = [];
let apiEndpoints = [
  `${apiConst.BASE_URL}trending/movie/week?${apiConst.API_KEY}`,
  `${apiConst.BASE_URL}movie/top_rated?${apiConst.API_KEY}`,
];

function fetchGenreList() {
  fetch(`${GENRE_LIST}?${apiConst.API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      const genres = data.genres;
      apiStrings = genres.map((genres) => {
        const genreId = genres.id;
        const genreName = genres.name;
        const genreApiUrl = `${MOVIE_GENRE}${genreId}&${apiConst.API_KEY}`;
        return genreApiUrl;
      });
      setMovieRowHeader(genres);
      let combinedList = apiEndpoints.concat(apiStrings);
      combinedList.forEach((element, index) => {
        getMovies(element, index);
      });
    })
    .catch((error) => console.error(error));
}

function setMovieRowHeader(list) {
  let index = 1;
  list.forEach((genres) => {
    index += 1;
    const rowId = index + 1;
    const rowHeader = document.getElementById(`header-row-${rowId}`);
    const genreName = genres.name;
    rowHeader.innerHTML = genreName;
  });
}

function getMovies(apiString, row) {
  fetch(apiString)
    .then((response) => response.json())
    .then((data) => {
      const movies = data.results;
      movies.forEach((movie) => {
        const movieCard = ui.createMovieCard(movie);
        const rowId = row + 1;
        const rowMoviesContainer = document.getElementById(
          `movies-row-${rowId}`
        );

        rowMoviesContainer.appendChild(movieCard);
      });
    })
    .catch((error) => console.error(error));
}

fetchGenreList();
