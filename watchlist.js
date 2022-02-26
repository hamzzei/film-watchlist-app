const watchlistEl = document.getElementById("watchlist-el")

let localArr = JSON.parse(localStorage.getItem("films")) || []

function renderList() {

    if (localArr.length === 0) {
        watchlistEl.innerHTML = `
            <div class="default-wrapper">
                <a class="default-icon-wrapper" href="index.html">
                    <img src="./images/circle-plus-solid.svg" alt="#" class="plus-icon">
                    <p class="default-watchlist-text">Let’s add some movies!</p>
                </a>
                <p class="default-text">Your watchlist is looking a little empty...</p>
            </div>
        `
    }

    localArr.forEach(item => {
        watchlistEl.innerHTML = ""
        fetch(`http://www.omdbapi.com/?i=${item}&apikey=f480dc7`)
            .then(res => res.json())
            .then(film => { 
                watchlistEl.innerHTML += 
            //     `
            // <div class="result">
            //     <p>${film.Title}</p>
            //     <a class="add-remove-btn" onclick="removeFromLocal('${item}')">
            //         Remove
            //     </a>
            // </div>
            // `
            `
            <div class="result">
                <div class="result-text-wrapper">
                    <div class="result-top">
                        <h2 class="film-title">${film.Title} <span class="film-year">(${film.Year})</span></h2>
                        <div class="rating-wrapper">
                            <img src="./images/star-solid.svg" alt="#" class="star-icon">
                            <p class="film-rating">${film.imdbRating}</p>
                        </div>
                    </div>
                    <div class="result-mid">
                        <p class="runtime">${film.Runtime}</p>
                        <p>${film.Genre}</p>
                        <div class="watchlist-wrapper" onclick="removeFromLocal('${item}')">
                            <img src="./images/circle-minus-solid.svg" alt="#" class="minus-icon">
                            <p class="add-remove-btn">Remove</p>
                        </div>
                    </div>
                    <p class="film-plot" id="${film.imdbID}-plot">${film.Plot} 
                        <span class="read-more" onclick="readMore('${film.imdbID}')">
                            Read more
                        </span>
                    </p>
                </div>
                <img src=${film.Poster} alt="${film.Title} poster" class="poster">
            </div>
            <hr>
            `
            })

    })
}

renderList()

function removeFromLocal(id) {
    localArr = localArr.filter(filmId => filmId !== id)
    localStorage.setItem("films", JSON.stringify(localArr))
    renderList()
}

function readMore(id) {
    fetch(`http://www.omdbapi.com/?i=${id}&plot=full&apikey=f480dc7`)
        .then(res => res.json())
        .then(film => {
            console.log(film.Plot)
            document.getElementById(`${film.imdbID}-plot`).innerHTML = `
                ${film.Plot} 
                <span class="read-more" onclick="readLess('${film.imdbID}')">
                    Read less
                </span>
                `
        })
}

function readLess(id) {
    fetch(`http://www.omdbapi.com/?i=${id}&apikey=f480dc7`)
        .then(res => res.json())
        .then(film => {
            console.log(film.Plot)
            document.getElementById(`${film.imdbID}-plot`).innerHTML = `
                ${film.Plot} 
                <span class="read-more" onclick="readMore('${film.imdbID}')">
                    Read more
                </span>
                `
        })
}
