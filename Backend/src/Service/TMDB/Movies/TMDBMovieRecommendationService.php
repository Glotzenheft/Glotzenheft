<?php declare(strict_types=1);

namespace App\Service\TMDB\Movies;

use App\Model\Request\Recommendation\MovieRecommendationDto;
use App\TmdbApi\Api\RecommendationApi;
use App\TmdbApi\ApiException;
use App\TmdbApi\Model\MovieRecommendations200Response;

readonly class TMDBMovieRecommendationService
{
    public function __construct(
        private RecommendationApi $recommendationApi,
    ){}

    /**
     * @param MovieRecommendationDto $params
     * @return MovieRecommendations200Response
     * @throws ApiException
     */
    public function getMovieRecommendations(MovieRecommendationDto $params): MovieRecommendations200Response
    {
        return $this->recommendationApi->movieRecommendations(
            movie_id: $params->tmdbMovieId,
            language: $params->language,
            page: $params->page,
        );
    }
}