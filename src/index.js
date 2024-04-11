const getMoviesbtn = document.getElementById("getMoviesBtn");
const getMoviesList = document.getElementById("moviesList");
const titleInput = document.getElementById("title");
const genreInput = document.getElementById("genre");
const directorInput = document.getElementById("director");
const yearInput = document.getElementById("year");
const addMoviebtn = document.getElementById("addMovieBtn");
const openModalBtn = document.querySelector(".open");
const updatedMoviebtn = document.getElementById("updateMovie");
const modal = document.querySelector(".modal");
const closeModalButton = document.querySelector(".close");
let currentMovieId;

const url = "http://localhost:3000/movies";

openModalBtn.addEventListener("click", openModal);
getMoviesbtn.addEventListener("click", showMovies);
addMoviebtn.addEventListener("click", addMovie);
getMoviesList.addEventListener("click", (e) => {
  if (e.target.className.includes("deleteMovieBtn")) {
    const id = e.target.getAttribute("data-id");
    deleteMovie(id);
  }
});
closeModalButton.addEventListener("click", closeModal);
getMoviesList.addEventListener("click", (e) => {
  if (e.target.className.includes("updateMovieBtn")) {
    currentMovieId = e.target.getAttribute("data-id");
    const id = currentMovieId;
    fetch(`${url}/${id}`)
      .then((response) => response.json())
      .then((movie) => {
        titleInput.value = movie.title;
        genreInput.value = movie.genre;
        directorInput.value = movie.director;
        yearInput.value = movie.year;
        openModal();
      })
      .catch((error) => {
        console.error("Error fetching movie data", error);
      });
  }
});

updatedMoviebtn.addEventListener("click", () => {
  updateMovie(currentMovieId);
});

function showMovies() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      getMoviesList.innerHTML = "";
      data.forEach((movie) => {
        const li = document.createElement("li");
        li.classList = "movie-card";
        li.innerHTML = `
                    <h2>${movie.title}</h2>
                    <p>${movie.genre}</p>
                    <p>${movie.director}</p>
                    <p>${movie.year}</p>
                    <button class="updateMovieBtn" data-id="${movie.id}">Update</button>
                    <button class="deleteMovieBtn" data-id="${movie.id}">Delete</button>
                `;
        getMoviesList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error", error);
    });
}

function addMovie() {
  const newMovie = {
    title: titleInput.value,
    genre: genreInput.value,
    director: directorInput.value,
    year: yearInput.value,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newMovie),
  })
    .then((response) => response.json())
    .then((data) => {
      const li = document.createElement("li");
      li.innerHTML = `
                <h2>${newMovie.title}</h2>
                <p>${newMovie.genre}</p>
                <p>${newMovie.director}</p>
                <p>${newMovie.year}</p>
                <button class="updateMovieBtn" data-id="${newMovie.id}">Update</button>
                <button class="deleteMovieBtn" data-id="${newMovie.id}">Delete</button>
            `;
      getMoviesList.appendChild(li);

      titleInput.value = "";
      genreInput.value = "";
      directorInput.value = "";
      yearInput.value = "";
    })
    .catch((error) => console.error("Error movie", error));
}

function deleteMovie(id) {
  fetch(`${url}/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      alert("Movie deleted");
      showMovies();
    })
    .catch((error) => {
      console.error("Error deleting movie", error);
    });
}

function updateMovie(id) {
  const updatedMovie = {
    title: titleInput.value,
    genre: genreInput.value,
    director: directorInput.value,
    year: yearInput.value,
  };

  fetch(`${url}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedMovie),
  })
    .then((response) => {
      showMovies();
    })
    .catch((error) => {
      console.error("Error updating movie", error);
    });
}

function openModal(id) {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}
