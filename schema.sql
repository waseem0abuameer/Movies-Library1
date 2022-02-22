DROP TABLE IF EXISTS addMovies;

CREATE TABLE IF NOT EXISTS addMovies(
id SERIAL PRIMARY KEY,
title VARCHAR(255),
release_date DATE,
poster_path VARCHAR(1000),
overview VARCHAR(10000),
comment VARCHAR(1000)
);