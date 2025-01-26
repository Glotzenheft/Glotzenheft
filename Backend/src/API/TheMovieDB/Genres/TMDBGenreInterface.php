<?php

namespace App\API\TheMovieDB\Genres;

interface TMDBGenreInterface
{
    public function getTVGenres(): array;

    public function getMovieGenres(): array;
}