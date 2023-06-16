import { apiConst } from "./api.js";
const maxChars = 150;
let ui = {
  createMovieCard(movie) {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";

    movieCard.onclick = function () {
      cardClicked(movie.id);
    };

    const image = document.createElement("img");
    image.src = `${apiConst.IMAGE_BASE_URL}${movie.poster_path}`;
    movieCard.appendChild(image);

    const infoBox = document.createElement("div");
    infoBox.className = "info-box";
    infoBox.innerHTML = `<h3>${movie.title}</h3><p>${limitText(
      movie.overview,
      maxChars
    )}
        <p>User rating: ${this.roundVoteAverage(movie)}</p>`;
    movieCard.appendChild(infoBox);

    return movieCard;
  },

  roundVoteAverage(movie) {
    let voteAverage = movie.vote_average.toFixed(1);

    return voteAverage;
  },
};

function limitText(text, maxChars) {
  if (text.length > maxChars) {
    return text.substring(0, maxChars) + "...";
  }
  return text;
}

function cardClicked(id) {
  window.location.href = "movieDetails.html?id=" + id;
}

export { ui };
