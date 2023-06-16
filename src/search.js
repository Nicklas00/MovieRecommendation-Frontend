import { apiConst } from "./api.js";
import { ui } from "./ui.js";
const searchURL = `${apiConst.BASE_URL}search/movie?${apiConst.API_KEY}&query=`;
const searchInput = document.getElementById("searchBar");
const searchResults = document.getElementById("movie");
const searchQueryLabed = document.getElementById("search-query-label");
const searchParam = new URLSearchParams(document.location.search);
const searchQuery = searchParam.get("q");

searchQueryLabed.innerText = "Results for: " + `"${searchQuery}"`;
searchQueryLabed.style.marginTop = "10px";
console.log(searchQuery);

function fetchSearchedMovies() {
  fetch(searchURL + searchQuery)
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data.results);
      console.log(data);
    });
}

function displayMovies(movies) {
  searchResults.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = ui.createMovieCard(movie);
    searchResults.appendChild(movieCard);
  });
}

fetchSearchedMovies();
