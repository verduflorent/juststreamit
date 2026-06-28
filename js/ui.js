/**
 * @file Contient les fonctions d'affichage et d'interaction de l'interface JustStreamIt.
 */

/**
 * Affiche le film le mieux noté dans la section dédiée.
 *
 * @param {Object} movie - Informations détaillées du film à mettre en avant.
 * @param {string} movie.title - Titre du film.
 * @param {string} movie.image_url - URL de l'affiche du film.
 * @param {string} [movie.long_description] - Description longue du film.
 * @param {string} [movie.description] - Description courte du film.
 * @returns {void}
 */
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
          onerror="this.src='img/placeholder.jpg'; this.onerror=null;"
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

/**
 * Formate un montant de box-office pour un affichage compact.
 *
 * @param {number|null|undefined} amount - Montant brut des recettes mondiales.
 * @returns {string} Montant formaté ou texte de remplacement si la donnée est absente.
 */
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

/**
 * Ouvre une modale contenant les informations détaillées d'un film.
 *
 * @param {Object} movie - Informations détaillées du film à afficher.
 * @param {string} movie.title - Titre du film.
 * @param {number} movie.year - Année de sortie du film.
 * @param {string[]} movie.genres - Genres associés au film.
 * @param {string} [movie.rated] - Classification du film.
 * @param {number} movie.duration - Durée du film en minutes.
 * @param {string[]} movie.countries - Pays de production du film.
 * @param {number} movie.imdb_score - Note IMDB du film.
 * @param {number} [movie.worldwide_gross_income] - Recettes mondiales du film.
 * @param {string} movie.image_url - URL de l'affiche du film.
 * @param {string[]} movie.directors - Réalisateurs du film.
 * @param {string} [movie.long_description] - Description longue du film.
 * @param {string} [movie.description] - Description courte du film.
 * @param {string[]} movie.actors - Acteurs principaux du film.
 * @returns {void}
 */
function openMovieModal(movie) {
  const modal = document.querySelector("#movie-modal");

  modal.innerHTML = `
    <article class="modal-content">

      <button
        type="button"
        class="modal-close"
        aria-label="Fermer la modale"
      >
        ×
      </button>

      <div class="modal-info">

        <h2>${movie.title}</h2>

        <div class="modal-meta">
          <p><strong>${movie.year}</strong> - ${movie.genres.join(", ")}</p>
          <p><strong>${movie.rated || "Non renseigné"} - ${movie.duration} minutes</strong> (${movie.countries.join(" / ")})</p>
          <p><strong>IMDB score:</strong> ${movie.imdb_score}/10</p>
          <p><strong>Recettes au box-office:</strong> ${formatBoxOffice(movie.worldwide_gross_income)}</p>
        </div>

      </div>

      <img
        class="modal-image"
        src="${movie.image_url}"
        alt="Affiche du film ${movie.title}"
        onerror="this.src='img/placeholder.jpg'; this.onerror=null;"
      >

      <div class="modal-directors">
        <p><strong>Réalisé par :</strong></p>
        <p>${movie.directors.join(", ")}</p>
      </div>

      <p class="modal-description">
        ${movie.long_description || movie.description || "Résumé indisponible."}
      </p>

      <div class="modal-actors">
        <p><strong>Avec :</strong></p>
        <p>${movie.actors.join(", ")}</p>
      </div>

      <button type="button" id="close-modal">
        Fermer
      </button>

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

/**
 * Crée une carte de film cliquable pour une liste de films.
 *
 * @param {Object} movie - Film à transformer en carte.
 * @param {string} movie.title - Titre du film.
 * @param {string} movie.image_url - URL de l'affiche du film.
 * @param {string} movie.url - URL de détail du film dans l'API.
 * @returns {HTMLElement} Élément article représentant la carte du film.
 */
function createMovieCard(movie) {
  const article = document.createElement("article");
  article.classList.add("movie-card");

  article.innerHTML = `
    <img
      src="${movie.image_url}"
      alt="Affiche du film ${movie.title}"
      onerror="this.src='img/placeholder.jpg'; this.onerror=null;"
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

/**
 * État d'ouverture des sections de films.
 *
 * Chaque clé correspond à l'id d'une section, et la valeur indique si tous les
 * films de cette section doivent être affichés.
 *
 * @type {Object.<string, boolean>}
 */
const expandedSections = {};

/**
 * Détermine le nombre de films visibles selon la largeur de l'écran.
 *
 * @returns {number} Nombre de cartes à afficher avant le bouton "Voir plus".
 */
function getVisibleMovieCount() {
  if (window.innerWidth >= 1024) {
    return 6;
  }

  if (window.innerWidth >= 768) {
    return 4;
  }

  return 2;
}

/**
 * Affiche une liste de films dans une section donnée.
 *
 * La fonction gère aussi le bouton "Voir plus / Voir moins" lorsque le nombre
 * de films dépasse la limite visible pour la taille d'écran courante.
 *
 * @param {Object[]} movies - Liste des films à afficher.
 * @param {string} containerSelector - Sélecteur CSS du conteneur qui reçoit les cartes.
 * @returns {void}
 */
function renderMovieList(movies, containerSelector) {
  const container = document.querySelector(containerSelector);
  const section = container.closest(".movie-section");
  const sectionId = section.id;

  const isExpanded = expandedSections[sectionId] || false;

  container.innerHTML = "";

  const visibleMovieCount = getVisibleMovieCount();
  const visibleMovies = isExpanded ? movies : movies.slice(0, visibleMovieCount);

  visibleMovies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    container.appendChild(movieCard);
  });

  const existingButton = section.querySelector(".toggle-movies-button");

  if (existingButton) {
    existingButton.remove();
  }

  if (movies.length > visibleMovieCount) {
    const button = document.createElement("button");
    button.classList.add("toggle-movies-button");
    button.textContent = isExpanded ? "Voir moins" : "Voir plus";

    button.addEventListener("click", () => {
      expandedSections[sectionId] = !isExpanded;
      renderMovieList(movies, containerSelector);
    });

    container.after(button);
  }
}

/**
 * Remplit le menu déroulant des genres avec les valeurs renvoyées par l'API.
 *
 * @param {Object[]} genres - Liste des genres disponibles.
 * @param {string} genres[].name - Nom affiché et valeur du genre.
 * @returns {void}
 */
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

/**
 * Met à jour la catégorie dynamique lorsque l'utilisateur sélectionne un genre.
 *
 * @param {Event} event - Événement de changement déclenché par le menu des genres.
 * @returns {Promise<void>} Promesse résolue lorsque la nouvelle liste est affichée.
 */
async function handleGenreChange(event) {
  const selectedGenre = event.target.value;

  const movies = await getMoviesByGenre(selectedGenre);

  renderMovieList(movies, "#category-choice .movies-container");
}
