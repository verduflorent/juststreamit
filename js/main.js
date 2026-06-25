// EL se déclanche lors du chargement du DOM
document.addEventListener("DOMContentLoaded", async () => {
    // On trie le résultat de la fonction triée par le score IMDB
  const data = await fetchData("/titles/?sort_by=-imdb_score&page_size=13");
  // On définis le premier résultat du tri
  const bestMoviePreview = data.results[0];
    // On récuperes l'url du résultat trié
  const bestMovieDetails = await fetchUrl(bestMoviePreview.url);
    // On appel la fonction sur le résultat du tri
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
});
