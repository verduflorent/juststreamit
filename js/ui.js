// Fonction Rendu du film le mieux noté
function renderBestMovie(movie) {
    // On défini la variable section qui acceuille le film avec l'id best-movie
    // Le Query selector effectue une requête en fonction d'un critère précis
  const section = document.querySelector("#best-movie");

  // On definis tout l'html de notre section
  section.innerHTML = `
    <h2>Meilleur film</h2>
    <article>
      <img
        src="${movie.image_url}"
        alt="Affiche du film ${movie.title}"
        onerror="this.src='https://picsum.photos/300/450'; this.onerror=null;"
      >
      <div>
        <h3>${movie.title}</h3>
        <p>${movie.long_description || movie.description || "Résumé indisponible."}</p>
        <button type="button" id="best-movie-details">Détails</button>
      </div>
    </article>
  `;

  // On définis le bouton par rapport a son id
  const detailsButton = document.querySelector("#best-movie-details");

  // On définis un EventListener qui executeras la fonction openMovieModal sur l'event click de notre bouton
  detailsButton.addEventListener("click", () => {
  openMovieModal(movie);
});
}

// Fonction d'ouverture modal des détails des films
function openMovieModal(movie) {
  const modal = document.querySelector("#movie-modal");

  modal.innerHTML = `
    <article>
      <h2>${movie.title}</h2>

      <img
        src="${movie.image_url}"
        alt="Affiche du film ${movie.title}"
        onerror="this.src='https://picsum.photos/300/450'; this.onerror=null;"
      >

      <p><strong>Genres :</strong> ${movie.genres.join(", ")}</p>
      <p><strong>Date de sortie :</strong> ${movie.date_published}</p>
      <p><strong>Classification :</strong> ${movie.rated || "Non renseignée"}</p>
      <p><strong>Score IMDB :</strong> ${movie.imdb_score}</p>
      <p><strong>Réalisateur :</strong> ${movie.directors.join(", ")}</p>
      <p><strong>Acteurs :</strong> ${movie.actors.join(", ")}</p>
      <p><strong>Durée :</strong> ${movie.duration} minutes</p>
      <p><strong>Pays :</strong> ${movie.countries.join(", ")}</p>
      <p><strong>Box-office :</strong> ${movie.worldwide_gross_income || "Non renseigné"}</p>
      <p>${movie.long_description || movie.description || "Résumé indisponible."}</p>

      <button type="button" id="close-modal">Fermer</button>
    </article>
  `;

  modal.showModal();

  document.querySelector("#close-modal").addEventListener("click", () => {
    modal.close();
  });
}

function createMovieCard(movie) {
  const article = document.createElement("article");
  article.classList.add("movie-card");

  article.innerHTML = `
    <img
      src="${movie.image_url}"
      alt="Affiche du film ${movie.title}"
      onerror="this.src='https://picsum.photos/300/450'; this.onerror=null;"
    >
    <h3>${movie.title}</h3>
  `;

  article.addEventListener("click", async () => {
    const movieDetails = await fetchUrl(movie.url);
    openMovieModal(movieDetails);
  });

  return article;
}

function renderMovieList(movies, containerSelector) {
  const container = document.querySelector(containerSelector);

  container.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    container.appendChild(movieCard);
  });
}

function populateGenreSelect(genres) {
  const select = document.querySelector("#genre-select");

  select.innerHTML = "";

  genres.forEach((genre) => {
    const option = document.createElement("option");

    option.value = genre.name;
    option.textContent = genre.name;

    select.appendChild(option);
  });
}

async function handleGenreChange(event) {
  const selectedGenre = event.target.value;

  const movies = await getMoviesByGenre(selectedGenre);

  renderMovieList(movies, "#category-choice .movies-container");
}
