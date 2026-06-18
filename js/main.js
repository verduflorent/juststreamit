const API_BASE_URL = "http://localhost:8000/api/v1";

async function fetchData(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }

  return await response.json();
}

function renderBestMovie(movie) {
  const section = document.querySelector("#best-movie");

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

  const detailsButton = document.querySelector("#best-movie-details");

  detailsButton.addEventListener("click", () => {
  openMovieModal(movie);
});
}

async function fetchUrl(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }

  return await response.json();
}

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

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchData("/titles/?sort_by=-imdb_score");
  const bestMoviePreview = data.results[0];

  const bestMovieDetails = await fetchUrl(bestMoviePreview.url);

  console.log(bestMovieDetails);

  renderBestMovie(bestMovieDetails);
});
