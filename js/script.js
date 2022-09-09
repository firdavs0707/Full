var normalizedMovies = movies.map((movie, i) => {
  return {
    title: movie.Title.toString(),
    year: movie.movie_year,
    categories: movie.Categories.split('|'),
    summary: movie.summary,
    imdbId: movie.imdb_id,
    imdbRating: movie.imdb_rating,
    runtime: movie.runtime,
    language: movie.language,
    trailer: `https://youtube.com/watch?v=${movie.ytid}`,
    bigPoster: `https://i3.ytimg.com/vi/${movie.ytid}/maxresdefault.jpg`,
    smallPoster: `https://i3.ytimg.com/vi/${movie.ytid}/hqresdefault.jpg`, 
  };
}).slice(0, 50);

let elSearchForm = $(".js-search-form");
let elSearchTitleInput = $(".js-search-form__title-input", elSearchForm);
let elSearchRatingInput = $(".js-search-form__rating-input", elSearchForm);
let elSearchGanreSelect = $(".js-search-form__genre-select", elSearchForm);
let elSearchSortSelect = $(".js-search-form__sort-select", elSearchForm);

let elBookmarkedMovies = $(".js-bookmarked-movies");
let elSearchResults = $(".search-results");

let elModalMovie = $(".js-modal-movie");

let elSearchResultTemplate = $("#search-result-template").content;
let elBookmarkedMovieTemplate = $("#bookmarked-movie-template").content;

let bookmarkedMovies = [];

let createGenreSelectOptions = () => {
  let moviesCategories = [];

  normalizedMovies.slice(0, 700).forEach(movie => {
    movie.categories.forEach(category => {
      if (!moviesCategories.includes(category)) {
        moviesCategories.push(category);
      }
    })
  })

  moviesCategories.sort();

  let elOptionsFragment = document.createDocumentFragment();

  moviesCategories.forEach(category => {
    let elCategoryOption = createElement("option", "", category);
    elCategoryOption.value = category;

    elOptionsFragment.appendChild(elCategoryOption);
  })

  elSearchGanreSelect.appendChild(elOptionsFragment);
}

createGenreSelectOptions();

let renderResults = (searchResults) => {
  elSearchResults.innerHTML = "";

  let elResultsFragment = document.createDocumentFragment();

  searchResults.forEach(movie => {
    let elMovie = elSearchResultTemplate.cloneNode(true);

    $(".js-search-result__item", elMovie).dataset.imdbId = movie.imdbId;
    $(".movie__poster", elMovie).src = movie.bigPoster;
    $(".movie__poster", elMovie).alt = movie.title;
    $(".movie__title", elMovie).textContent = movie.title;
    $(".movie__year", elMovie).textContent = movie.year;
    $(".movie__rating", elMovie).textContent = movie.imdbRating;
    $(".movie__trailer-link", elMovie).href = movie.trailer;

    elResultsFragment.appendChild(elMovie);
  })

  elSearchResults.appendChild(elResultsFragment);
}

renderResults(normalizedMovies.slice(0, 50));

let res = (res) => {
  res.sort((a, b) => a.title.localeCompare(b.title));
}

let res2 = (res2) => {
  res2.sort((a, b) => b.year - a.year);
}

let sortSearchResults = (results, sortType) => {
  if (sortType === "az") {
    res(results)
  } else if (sortType === "za") {
    return results.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortType === "year_desc") {
    res2(results);
  } else if (sortType === "year_asc") {
    return results.sort((a, b) => a.year - b.year);
  };
}

let findMovies = (title, minRating, genre) => {
  return normalizedMovies.filter(movie => {
    let doesMatchCategory = genre === "All" || movie.categories.includes(genre);
    
    return movie.title.match(title) && movie.imdbRating > minRating && doesMatchCategory;
  })
}

elSearchForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let searchTitle = elSearchTitleInput.value.trim();
  let movieTitleRegex = new RegExp(searchTitle, "gi");

  let minimumRating = Number(elSearchRatingInput.value);
  let genre = elSearchGanreSelect.value;
  let sorting = elSearchSortSelect.value;

  let searchResults = findMovies(movieTitleRegex, minimumRating, genre);
  sortSearchResults(searchResults, sorting);

  renderResults(searchResults);
})

elSearchResults.addEventListener("click", (evt) => {
  if (evt.target.matches(".js-movie-info-button")) {
    let movieId = evt.target.closest(".js-search-result__item").dataset.imdbId;

    let foundMovie = normalizedMovies.find(movie => {
      return movie.imdbId === movieId;
    })

    $(".js-modal-movie-title", elModalMovie).textContent = foundMovie.title;
    $(".js-modal-movie-summary", elModalMovie).textContent = foundMovie.summary;
  }
})

let bookmarkResults = (bookmarkedResults) => {
  elBookmarkedMovies.innerHTML = "";

  let elBookmarksFragment = document.createDocumentFragment();

  bookmarkedResults.forEach(movie => {
    let elBookmarkMovie = elBookmarkedMovieTemplate.cloneNode(true);

    $(".js-bookmarked-movie", elBookmarkMovie).dataset.imdbId = movie.imdbId;
    $(".js-bookmarked-movie-title", elBookmarkMovie).textContent = movie.title;

    elBookmarksFragment.appendChild(elBookmarkMovie);
  })

  elBookmarkedMovies.appendChild(elBookmarksFragment);
}

elSearchResults.addEventListener("click", (evt) => {
  if (evt.target.matches(".js-movie-bookmark")) {
    let movieId = evt.target.closest(".js-search-result__item").dataset.imdbId;

  let foundMovie = normalizedMovies.find(movie => {
      return movie.imdbId === movieId;
    })

    if (!bookmarkedMovies.includes(foundMovie)) {
      bookmarkedMovies.push(foundMovie);
    }
    bookmarkResults(bookmarkedMovies);
  }
})

elBookmarkedMovies.addEventListener("click", (evt) => {

  
  if (evt.target.matches(".js-bookmarked-remove")) {
    let bookmarkedId = evt.target.closest(".js-bookmarked-movie").dataset.imdbId;
    
    let foundBookmark = bookmarkedMovies.find(movie => {
      return movie.imdbId === bookmarkedId;
    })
    
    if (foundBookmark.imdbId === bookmarkedId) {
      bookmarkedMovies.splice(foundBookmark, 1);
      // elBookmarkedMovies.removeChild(".js-bookmarked-movie");
      console.log(bookmarkedMovies);
    }
  }

})