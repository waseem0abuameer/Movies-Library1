'user strict';
//configration server express
const express = require("express");
//get axios so we can send  HTTP requsts to an API`s
const axios = require("axios");
//Call Data From json File
const movies = require("./Movie Data/data.json");
//dotenv make ability to call
const dotenv = require("dotenv");
//Call APIKEY from env
const APIKEY = process.env.APIKEY;
//Call PORT from env
//const PORT = process.env.PORT;
//initialize app
const app = express();
//===============================(Build The Constructors /)============================================
function Movies(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}
//===============================(End Build The Constructors /)==============================================
//============================================================================================================
//===============================(int point /)=================================================================
app.get('/', moviesHandler);

function moviesHandler(requ, res) {
    let result = [];
    movies.data.forEach((value, index) => {
        let oneMovie = new Movies(value.title, value.poster_path, value.overview)
        result.push(oneMovie);
    })

    return res.status(200).json(result);
}
//===============================(end int point /)===================================================================
//===================================================================================================================

//===============================(int point /trending)===============================================================
app.get("/trending", trendingHandler);

function trendingHandler(req, res) {
    let result = [];
    axios
        .get(
            `https://api.themoviedb.org/3/trending/all/week?api_key=da4ae93ee89eef416970bef20e20ac2c&language=en-US`
        )
        .then((apiResponse) => {
            apiResponse.data.results.map((value) => {
                let oneMovie = new Movies(
                    value.id,
                    value.title,
                    value.release_date,
                    value.poster_path,
                    value.overview
                );
                result.push(oneMovie);
            });
            return res.status(200).json(result);
        })
        .catch((error) => {
            serverError(error, req, res);
        });
}

//===============================(end int point /trending)=======================================================================
//=======================================================================================================================
//===============================(int point /search)===============================================================

app.get("/search", searchHandler);

function searchHandler(req, res) {
    const search = req.query.search;
    let result = [];
    axios
        .get(
            `https://api.themoviedb.org/3/search/movie?api_key=da4ae93ee89eef416970bef20e20ac2c&language=en-US&query=${
                search || "spider-man"
              }&page=2`
        )
        .then((apiResponse) => {
            apiResponse.data.results.map((value) => {
                let oneMovie = new Movies(
                    value.id || "N/A",
                    value.title || "N/A",
                    value.release_date || "N/A",
                    value.poster_path || "N/A",
                    value.overview || "N/A"
                );
                result.push(oneMovie);
            });
            return res.status(200).json(result);
        })
        .catch((error) => {
            serverError(error, req, res);
        });
}
//===============================(end int point /search)=======================================================================
//=======================================================================================================================
//===============================(int point /topRated)===============================================================
app.get("/topRated", topHandler);

function topHandler(req, res) {
    let topRated = [];
    axios
        .get(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=da4ae93ee89eef416970bef20e20ac2c&language=en-US&page=1`
        )
        .then((value) => {
            value.data.results.forEach((value) => {
                let oneMovie = new Movies(
                    value.id,
                    value.title,
                    value.release_date,
                    value.poster_path,
                    value.overview
                );
                topRated.push(oneMovie);
            });
            return res.status(200).json(topRated);
        })
        .catch((error) => {
            serverError(error, req, res);
        });
}


//===============================(end int point /topRated)=======================================================================
//=======================================================================================================================
//===============================(int point /upcoming)===============================================================
app.get("/upcoming", upcomingHandler);

function upcomingHandler(req, res) {
    let upcoming = [];
    axios
        .get(
            `https://api.themoviedb.org/3/movie/upcoming?api_key=da4ae93ee89eef416970bef20e20ac2c&language=en-US&page=1`

        )
        .then((value) => {
            value.data.results.forEach((value) => {
                let oneMovie = new Movies(
                    value.id,
                    value.title,
                    value.release_date,
                    value.poster_path,
                    value.overview
                );
                upcoming.push(oneMovie);
            });
            return res.status(200).json(upcoming);
        })
        .catch((error) => {
            serverError(error, req, res);
        });
}
//===============================(end int point /upcoming)=======================================================================
//=======================================================================================================================
//===============================(int point /favorite)===============================================================
app.get('/favorite', favoritemoviesHandler);

function favoritemoviesHandler(requ, res) {
    return res.send("Welcome to Favorite Page")

}
//===============================(end int point /favorite)=======================================================================
//=======================================================================================================================
//===============================(int point /notfound)===============================================================
app.get('*', notFoundHandler);

function notFoundHandler(requ, res) {
    return res.status(404).send("Not Found")
}
//===============================(end int point /notFoundHandler)=======================================================================
//=======================================================================================================================
//===============================(int point /servererror)===============================================================


function serverError(req, res) {
    res.status(500).send({
        "status": 500,
        "responseText": "Sorry, something went wrong within the local server"
    });
}
//===============================(end int point /notFoundHandler)=======================================================================
//=======================================================================================================================






//TO Make My Server In Life 
app.listen(3000, () => {
    console.log(`Listen on 3000`);
});