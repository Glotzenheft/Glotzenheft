<?php
/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

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