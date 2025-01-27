<?php

namespace App\API\TheMovieDB\MultiSearch;

interface TMDBMultiSearchInterface
{
    public function multiSearch(string $q, int $page = 1): array;
}