'user strict';

//configration server express
const express = require("express");
//get axios so we can send  HTTP requsts to an API`s
const axios = require("axios");
//Call Data From json File
const movies = require("./Movie Data/data.json");
//dotenv make ability to call
const dotenv = require("dotenv");
dotenv.config();
//Call APIKEY from env
const APIKEY = process.env.APIKEY;
//Call PORT from env
//const PORT = process.env.PORT;
//Call PG to conect whit database
const pg = require("pg");
//Call databaseURL
const DATABASER_URL = process.env.DATABASER_URL;
//initialize conaction
const client = new pg.Client(DATABASER_URL);
//initialize app
const app = express();
app.use(express.json());
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
//===============================(int point /getMovie)===============================================================
app.get("/getMovie", getHandler);

function getHandler(req, res) {
    const sql = `SELECT * FROM addMovies`;

    client
        .query(sql)
        .then((result) => {
            return res.status(200).json(result.rows);
        })
        .catch((error) => {
            serverError(error, req, res);
        });
}

//===============================(end int point /getMovie)=======================================================================
//=======================================================================================================================
//===============================(int point /addMovie)===============================================================
app.post("/addmovies", addHandler);

function addHandler(req, res) {
    const movie = req.body;
    const sql = `INSERT INTO addMovies(title, release_date, poster_path, overview, comment) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const values = [
        movie.title,
        movie.release_date,
        movie.poster_path,
        movie.overview,
        movie.comment,
    ];
    client
        .query(sql, values)
        .then((result) => {
            res.status(201).json(result.rows);
        })
        .catch((error) => {
            console.log(error);
            serverError(error, req, res);
        });
}
//===============================(end int point /addMovie)=======================================================================
//=======================================================================================================================

//===============================(int point /favorite)===============================================================
app.get('/favorite', favoritemoviesHandler);

function favoritemoviesHandler(requ, res) {
    return res.send("Welcome to Favorite Page")

}
//===============================(end int point /favorite)=======================================================================
//=======================================================================================================================
//===============================(int point /t14)===============================================================
app.get("/movieById/:id", getMovieById);
app.put("/updateMovie/:id", updateMovieHandler);
app.delete("/deleteMovie/:id", deleteMovieHandler);

function addHandler(req, res) {
    const movie = req.body;
    const sql = `INSERT INTO addMovies(title, release_date, poster_path, overview, comment) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const values = [
        movie.title,
        movie.release_date,
        movie.poster_path,
        movie.overview,
        movie.comment,
    ];
    client
        .query(sql, values)
        .then((result) => {
            res.status(201).json(result.rows);
        })
        .catch((error) => {
            console.log(error);
            serverError(error, req, res);
        });
}

function getHandler(req, res) {
    const sql = `SELECT * FROM addMovies`;

    client
        .query(sql)
        .then((result) => {
            return res.status(200).json(result.rows);
        })
        .catch((error) => {
            serverError(error, req, res);
        });
}

function getMovieById(req, res) {
    let id = req.params.id;
    const sql = `SELECT * FROM addMovies WHERE id = $1;`;
    const values = [id];

    client
        .query(sql, values)
        .then((result) => {
            return res.status(200).json(result.rows[0]);
        })
        .catch((error) => {
            serverError(error, req, res);
        });
}

function updateMovieHandler(req, res) {
    const id = req.params.id;
    const recipe = req.body;

    const sql = `UPDATE addMovies SET title = $1, release_date = $2,poster_path = $3, overview = $4, comment = $5 WHERE id = $6 RETURNING *;`;
    const values = [
        recipe.title,
        recipe.release_date,
        recipe.poster_path,
        recipe.overview,
        recipe.comment,
        id,
    ];

    client
        .query(sql, values)
        .then((result) => {
            return res.status(200).json(result.rows);
        })
        .catch((error) => {
            serverError(error, req, res);
        });
}

function deleteMovieHandler(req, res) {
    const id = req.params.id;

    const sql = `DELETE FROM addMovies WHERE id=$1;`;
    const values = [id];

    client
        .query(sql, values)
        .then(() => {
            return res.status(204).json({});
        })
        .catch((error) => {
            serverError(error, req, res);
        });
}


//===============================(end int point /t14)=======================================================================
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
client.connect()
    .then(() => {
        app.listen(3001, () => {
            console.log(`Listen on 3001`);
        });
    });