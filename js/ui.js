// Fonction Rendu du film le mieux noté
function renderBestMovie(movie) {
    // On défini la variable section qui acceuille le film avec l'id best-movie
    // Le Query selector effectue une requête en fonction d'un critère précis
  const section = document.querySelector("#best-movie");

  // On definis tout l'html de notre section
  section.innerHTML = `
    <h2>Meilleur film</h2>
      <article class="best-movie-card">
        <img
          class="best-movie-image"
          src="${movie.image_url}"
          alt="Affiche du film ${movie.title}"
          onerror="this.src='https://picsum.photos/300/450'; this.onerror=null;"
        >

        <div class="best-movie-content">

            <h3>${movie.title}</h3>

            <p>${movie.long_description || movie.description}</p>

            <div class="best-movie-footer">
                <button type="button" id="best-movie-details">Détails</button>
            </div>

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

function formatBoxOffice(amount) {
  if (!amount) {
    return "Non renseigné";
  }

  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} Md $`;
  }

  if (amount >= 1_000_000) {
    return `${Math.round(amount / 1_000_000)} M $`;
  }

  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000)} k $`;
  }

  return `${amount} $`;
}

// Fonction d'ouverture modal des détails des films
function openMovieModal(movie) {
  const modal = document.querySelector("#movie-modal");

  modal.innerHTML = `
    <article class="modal-content">
      <button type="button" class="modal-close" aria-label="Fermer la modale">×</button>

      <div class="modal-header">
        <div class="modal-info">
          <h2>${movie.title}</h2>

          <p><strong>${movie.year}</strong> - ${movie.genres.join(", ")}</p>
          <p><strong>Classification :</strong> ${movie.rated || "Non renseignée"}</p>
          <p><strong>Durée :</strong> ${movie.duration} minutes</p>
          <p><strong>Pays :</strong> ${movie.countries.join(" / ")}</p>
          <p><strong>IMDB score:</strong> ${movie.imdb_score}/10</p>
          <p><strong>Recettes au box-office:</strong> ${formatBoxOffice(movie.worldwide_gross_income)}</p>
        </div>

        <img
          class="modal-image"
          src="${movie.image_url}"
          alt="Affiche du film ${movie.title}"
          onerror="this.src='https://picsum.photos/300/450'; this.onerror=null;"
        >
      </div>

      <div class="modal-directors">
        <p><strong>Réalisé par:</strong></p>
        <p>${movie.directors.join(", ")}</p>
      </div>

      <p class="modal-description">
        ${movie.long_description || movie.description || "Résumé indisponible."}
      </p>

      <div class="modal-actors">
        <p><strong>Avec:</strong></p>
        <p>${movie.actors.join(", ")}</p>
      </div>

      <button type="button" id="close-modal">Fermer</button>
    </article>
  `;

  modal.showModal();

  document.querySelector("#close-modal").addEventListener("click", () => {
    modal.close();
  });

  document.querySelector(".modal-close").addEventListener("click", () => {
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

    <div class="movie-overlay">
      <h3>${movie.title}</h3>
      <button type="button">Détails</button>
    </div>
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
