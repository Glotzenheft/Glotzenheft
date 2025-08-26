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

namespace App\Controller\API\Media;

use App\Model\Request\Recommendation\TVSeriesRecommendationDto;
use App\Security\IsAuthenticated;
use App\Service\TMDB\TVSeries\TMDBTVSeriesRecommendationService;
use App\TmdbApi\ApiException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;

class TVSeriesRecommendationController extends AbstractController
{

    public function __construct(
        private readonly TMDBTVSeriesRecommendationService $recommendationService,
    ){}

    /**
     * @param TVSeriesRecommendationDto $params
     * @return JsonResponse
     * @throws ApiException
     */
    #[IsAuthenticated]
    #[Route('/api/tv/recommendations', name: 'get_tv_series_recommendations', methods: ['GET'])]
    public function tvSeriesRecommendationsEndpoint(
        #[MapQueryString] TVSeriesRecommendationDto $params
    ): JsonResponse
    {
        $response = $this->recommendationService->getTVSeriesRecommendations($params);

        $data = [
            'page' => $response->getPage(),
            'recommendations' => $response->getResults(),
            'total_pages' => $response->getTotalPages(),
            'total_results' => $response->getTotalResults(),
        ];

        return $this->json(data: $data);
    }
}