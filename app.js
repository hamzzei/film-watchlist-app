const searchbar = document.getElementById("searchbar")
const formEl = document.getElementById("formEl")
const resultsEl = document.getElementById("results")
const localArr = JSON.parse(localStorage.getItem("films")) || []


formEl.addEventListener("submit", e => {

    e.preventDefault()

    fetch(`http://www.omdbapi.com/?s="${searchbar.value}"&apikey={apikey}`)
        .then(res => res.json())
        .then(films => {
            resultsEl.innerHTML = ""
            films.Search.forEach(film => {
                fetch(`http://www.omdbapi.com/?i=${film.imdbID}&apikey={apikey}`)
                    .then(res => res.json())
                    .then(film => {

                        resultsEl.innerHTML += `
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
                                    <div class="watchlist-wrapper" id="${film.imdbID}-watchlist" onclick="addToLocal('${film.imdbID}')">
                                        <img src="./images/circle-plus-solid.svg" alt="#" class="plus-icon">
                                        <p class="add-remove-btn">Watchlist</p>
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


                        if (localArr.includes(film.imdbID)) {
                            const currentIdWatchlist = document.getElementById(`${film.imdbID}-watchlist`)

                            currentIdWatchlist.innerHTML = `
                                <img src="./images/circle-check-solid.svg" alt="#" class="check-icon">
                                <p>Added</p>
                            `

                            currentIdWatchlist.classList.remove("watchlist-wrapper")
                            currentIdWatchlist.classList.add("added-wrapper")
                        }


                    })
            })

            searchbar.value = ""

        })
        .catch(err => {
            document.getElementById("results").innerHTML = `
                <div class="default-wrapper">
                    <p class="default-text">Unable to find what you’re looking for. Please try another search.</p>
                </div>
            `
        })
})

function addToLocal(id) {

    if(!localArr.includes(id)) {

        localArr.push(id)
        localStorage.setItem("films", JSON.stringify(localArr))

        const currentIdWatchlist = document.getElementById(`${id}-watchlist`)

        currentIdWatchlist.innerHTML = `
            <img src="./images/circle-check-solid.svg" alt="#" class="check-icon">
            <p>Added</p>
        `

        currentIdWatchlist.classList.remove("watchlist-wrapper")
        currentIdWatchlist.classList.add("added-wrapper")

    }
}

function readMore(id) {
    fetch(`http://www.omdbapi.com/?i=${id}&plot=full&apikey={apikey}`)
        .then(res => res.json())
        .then(film => {
            document.getElementById(`${film.imdbID}-plot`).innerHTML = `
                ${film.Plot} 
                <span class="read-more" onclick="readLess('${film.imdbID}')">
                    Read less
                </span>
                `
        })
}

function readLess(id) {
    fetch(`http://www.omdbapi.com/?i=${id}&apikey={apikey}`)
        .then(res => res.json())
        .then(film => {
            document.getElementById(`${film.imdbID}-plot`).innerHTML = `
                ${film.Plot} 
                <span class="read-more" onclick="readMore('${film.imdbID}')">
                    Read more
                </span>
                `
        })
}
