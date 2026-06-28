/**
 * @file Contient les fonctions de communication avec l'API OCMovies.
 */

/**
 * Adresse de base de l'API locale OCMovies.
 *
 * @constant {string}
 */
const API_BASE_URL = "http://localhost:8000/api/v1";

/**
 * Récupère des données depuis un endpoint relatif de l'API OCMovies.
 *
 * @param {string} endpoint - Portion d'URL à ajouter à l'adresse de base de l'API.
 * @returns {Promise<Object>} Données JSON renvoyées par l'API.
 * @throws {Error} Erreur contenant le statut HTTP lorsque la requête échoue.
 */
async function fetchData(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }

  return await response.json();
}

/**
 * Récupère des données depuis une URL complète.
 *
 * Cette fonction est utilisée lorsque l'API fournit directement l'URL de détail
 * d'une ressource, par exemple pour charger les informations complètes d'un film.
 *
 * @param {string} url - URL complète à interroger.
 * @returns {Promise<Object>} Données JSON renvoyées par l'API.
 * @throws {Error} Erreur contenant le statut HTTP lorsque la requête échoue.
 */
async function fetchUrl(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }

  return await response.json();
}

/**
 * Récupère les films les mieux notés pour un genre donné.
 *
 * @param {string} genre - Nom du genre à rechercher.
 * @returns {Promise<Object[]>} Liste des films correspondant au genre demandé.
 */
async function getMoviesByGenre(genre) {
  const data = await fetchData(`/titles/?genre=${genre}&sort_by=-imdb_score&page_size=12`);
  return data.results;
}

/**
 * Récupère la liste des genres disponibles dans l'API.
 *
 * @returns {Promise<Object[]>} Liste des genres disponibles.
 */
async function getGenres() {
  const data = await fetchData("/genres/?page_size=50");
  return data.results;
}
