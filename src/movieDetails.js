const searchParam = new URLSearchParams(document.location.search);
const movieId = searchParam.get("id");
const movieTitle = document.getElementById("movie-title");
const detailsImage = document.getElementById("details-image");
const genreContainer = document.getElementById("details-genre-container");
const detailsText = document.getElementById("details-text");
const detailsOverview = document.getElementById("details-overview");
const providerList = document.getElementById("provider-list");
const logoURL = "https://image.tmdb.org/t/p/original";

import { apiConst } from "./api.js";
import { ui } from "./ui.js";

function fetchMovieDetails(movieId) {
  const url = `${apiConst.BASE_URL}movie/${movieId}?${apiConst.API_KEY}`;
  console.log(url);
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const movieDetails = data;
      setMovieDetails(movieDetails);
      createGenreTags(movieDetails);
      console.log(movieDetails);
      getProviders();
      return movieDetails;
    })
    .catch((error) => console.error(error));
}

function setMovieDetails(movie) {
  movieTitle.innerHTML = movie.title;
  detailsImage.appendChild(createDetailsImage(movie));
  detailsText.innerHTML = createDetailsText(movie);
}

function parseYear(movie) {
  let year = parseInt(movie.release_date);
  return year;
}

function createDetailsText(movie) {
  let text =
    `<p><b>Resume:</b> ${movie.overview}</p>` +
    `<p><b>Released in:</b> ${parseYear(movie)}</p>` +
    `<p><b>Runtime:</b> ${movie.runtime} min</p>` +
    `<p><b>Rating:</b> ${ui.roundVoteAverage(movie)}</p>`;
  return text;
}

function createDetailsImage(movie) {
  const img = document.createElement("img");
  img.className = "pull-left mr-2";
  img.src = apiConst.IMAGE_BASE_URL + movie.poster_path;
  img.style.height = "600px";
  img.style.width = "400px";
  img.style.borderRadius = "2%";
  img.style.marginTop = "10px";
  img.style.float = "left";
  return img;
}

function createGenreTags(movieDetails) {
  const genres = movieDetails.genres;
  genres.forEach((genres) => {
    const span = document.createElement("span");
    span.className = "badge badge-secondary";
    span.innerHTML = genres.name;
    genreContainer.appendChild(span);
  });
}

async function fetchProvider() {
  try {
    const url = `${apiConst.BASE_URL}movie/${movieId}/watch/providers?${apiConst.API_KEY}`;
    console.log(url);
    const response = await fetch(url);
    const responseJson = await response.json();
    let providerNames;
    if (responseJson.results && responseJson.results["DK"]) {
      let dkProviders = responseJson.results["DK"];
      if (dkProviders.hasOwnProperty("flatrate")) {
        let providerNames = dkProviders.flatrate;
        providerNames = providerNames.map((provider) => {
          return {
            providerName: provider.provider_name,
            providerLogo: provider.logo_path,
          };
        });
        return providerNames;
      }
    }
    return providerNames;
  } catch (error) {
    console.error("error: ", error);
    throw error;
  }
}

async function getProviders() {
  let providers = await fetchProvider();
  console.log(providers);

  if (providers === undefined) {
    let p = document.createElement("p");
    p.innerText = "Not available on any streaming services in your region";
    providerList.appendChild(p);
  } else {
    providers.forEach((element) => {
      let img = createProviderLogo(element);
      providerList.appendChild(img);
    });
  }
}

function createProviderLogo(element) {
  let img = document.createElement("img");
  img.src = logoURL + element.providerLogo;
  img.style.width = "40px";
  img.style.height = "40px";
  img.style.borderRadius = "10px";
  img.style.margin = "3px";
  img.className = "provider-logo-img";

  return img;
}

fetchMovieDetails(movieId);
