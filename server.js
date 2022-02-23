'user strict';
//configration server express
const express = require("express");
//Call Data From json File
const movies = require("./Movie Data/data.json");
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
    console.log("Listen on 3000");
})