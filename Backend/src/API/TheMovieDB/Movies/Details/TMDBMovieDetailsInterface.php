<?php declare(strict_types=1);

namespace App\API\TheMovieDB\Movies\Details;

interface TMDBMovieDetailsInterface
{
    public function getMovieDetails(int $movieID): array;
}