<?php declare(strict_types=1);

namespace App\API\TheMovieDB\TVSeries\Details;

interface TMDBTVSeriesDetailsInterface
{
    public function getTVSeriesDetails(int $seriesID): array;
}