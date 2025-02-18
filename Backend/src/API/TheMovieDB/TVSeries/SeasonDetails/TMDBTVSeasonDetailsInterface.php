<?php declare(strict_types=1);

namespace App\API\TheMovieDB\TVSeries\SeasonDetails;

interface TMDBTVSeasonDetailsInterface
{
    public function getTVSeasonDetails(int $seriesID, int $seasonNumber): array;
}