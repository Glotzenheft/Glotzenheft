<?php declare(strict_types=1);

namespace App\Service\TMDB\TVSeries;

use App\Model\Request\Recommendation\TVSeriesRecommendationDto;
use App\TmdbApi\Api\RecommendationApi;
use App\TmdbApi\ApiException;
use App\TmdbApi\Model\TvSeriesRecommendations200Response;

readonly class TMDBTVSeriesRecommendationService
{
    public function __construct(
        private RecommendationApi $recommendationApi,
    ){}

    /**
     * @param TVSeriesRecommendationDto $params
     * @return TvSeriesRecommendations200Response
     * @throws ApiException
     */
    public function getTVSeriesRecommendations(TVSeriesRecommendationDto $params): TvSeriesRecommendations200Response
    {
        return $this->recommendationApi->tvSeriesRecommendations(
            series_id: $params->tmdbSeriesId,
            language: $params->language,
            page: $params->page,
        );
    }
}