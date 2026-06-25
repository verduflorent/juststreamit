// Def de l'adresse de l'API
const API_BASE_URL = "http://localhost:8000/api/v1";

// Fonction asynchrone de requête de données
// Asynchrone signifie que la fonction s'execute sans bloquer les autres fonctions
async function fetchData(endpoint) {
    // le param endpoint represente la portion d'URL fourni au moment de l'appel
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  // Si le point d'arrivée de l'URL ne répond pas
  if (!response.ok) {
    // Alors on generes un message d'erreur status serveur
    throw new Error(`Erreur API : ${response.status}`);
  }

  // await est spécifique a la fonction asynchrone : on attends la réponse de l'URL
  return await response.json();
}

// FONCTION DOUBLON !!!! SUPPRESSION POSSIBLE
async function fetchUrl(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }

  return await response.json();
}

async function getMoviesByGenre(genre) {
  const data = await fetchData(`/titles/?genre=${genre}&sort_by=-imdb_score&page_size=12`);
  return data.results;
}

async function getGenres() {
  const data = await fetchData("/genres/?page_size=50");
  return data.results;
}
