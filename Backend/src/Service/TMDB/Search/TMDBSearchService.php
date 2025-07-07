<?php declare(strict_types=1);

namespace App\Service\TMDB\Search;

use App\Model\Request\Search\MovieSearchRequestDto;
use App\Model\Request\Search\MultiSearchRequestDto;
use App\Model\Request\Search\TvSearchRequestDto;
use App\TmdbApi\Api\SearchApi;
use App\TmdbApi\ApiException;
use App\TmdbApi\Model\SearchMovie200Response;
use App\TmdbApi\Model\SearchMulti200Response;
use App\TmdbApi\Model\SearchTv200Response;

readonly class TMDBSearchService
{
    public function __construct(
        private SearchApi $searchApi,
    ){}

    /**
     * @param MultiSearchRequestDto $params
     * @return SearchMulti200Response
     * @throws ApiException
     */
    public function searchMulti(MultiSearchRequestDto $params): SearchMulti200Response
    {
        return $this->searchApi->searchMulti(
            query: $params->q,
            include_adult: $params->includeAdult,
            language: $params->language,
            page: $params->page,
        );
    }

    /**
     * @param MovieSearchRequestDto $params
     * @return SearchMovie200Response
     * @throws ApiException
     */
    public function searchMovie(MovieSearchRequestDto $params): SearchMovie200Response
    {
        return $this->searchApi->searchMovie(
            query: $params->q,
            include_adult: $params->includeAdult,
            language: $params->language,
            primary_release_year: $params->primaryReleaseYear,
            page: $params->page,
            region: $params->region,
            year: $params->year
        );
    }

    /**
     * @param TvSearchRequestDto $params
     * @return SearchTv200Response
     * @throws ApiException
     */
    public function searchTV(TvSearchRequestDto $params): SearchTV200Response
    {
        return $this->searchApi->searchTV(
            query: $params->q,
            first_air_date_year: $params->firstAirDateYear,
            include_adult: $params->includeAdult,
            language: $params->language,
            page: $params->page,
            year: $params->year,
        );
    }
}