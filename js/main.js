/**
 * @file Initialise la page d'accueil JustStreamIt après le chargement du DOM.
 */

/**
 * Charge les données initiales de l'application et remplit les sections de films.
 *
 * La fonction récupère le meilleur film, les films les mieux notés, deux catégories
 * fixes, puis configure la catégorie dynamique sélectionnable par l'utilisateur.
 *
 * @returns {Promise<void>} Promesse résolue lorsque les sections principales sont rendues.
 */
async function initHomePage() {
  const data = await fetchData("/titles/?sort_by=-imdb_score&page_size=13");
  const bestMoviePreview = data.results[0];
  const bestMovieDetails = await fetchUrl(bestMoviePreview.url);
  renderBestMovie(bestMovieDetails);

  const topRatedMovies = data.results.slice(1, 13);
  renderMovieList(topRatedMovies, "#top-rated .movies-container");

  const actionMovies = await getMoviesByGenre("Action");
  renderMovieList(actionMovies, "#category-1 .movies-container");

  const dramaMovies = await getMoviesByGenre("Drama");
  renderMovieList(dramaMovies, "#category-2 .movies-container");

  const genres = await getGenres();
  populateGenreSelect(genres);

  const genreSelect = document.querySelector("#genre-select");
  genreSelect.addEventListener("change", handleGenreChange);

  const firstGenre = genres[0].name;
  const firstGenreMovies = await getMoviesByGenre(firstGenre);
  renderMovieList(firstGenreMovies, "#category-choice .movies-container");
}

document.addEventListener("DOMContentLoaded", initHomePage);
