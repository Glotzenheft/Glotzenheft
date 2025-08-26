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

use App\Model\Request\Recommendation\MovieRecommendationDto;
use App\Security\IsAuthenticated;
use App\Service\TMDB\Movies\TMDBMovieRecommendationService;
use App\TmdbApi\ApiException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;

class MovieRecommendationController extends AbstractController
{
    public function __construct(
        private readonly TMDBMovieRecommendationService $recommendationService,
    ){}

    /**
     * @param MovieRecommendationDto $params
     * @return JsonResponse
     * @throws ApiException
     */
    #[IsAuthenticated]
    #[Route('/api/movie/recommendations', name: 'get_movie_recommendations', methods: ['GET'])]
    public function movieRecommendationsEndpoint(
        #[MapQueryString] MovieRecommendationDto $params
    ): JsonResponse
    {
        $response = $this->recommendationService->getMovieRecommendations($params);

        $data = [
            'page' => $response->getPage(),
            'recommendations' => $response->getResults(),
            'total_pages' => $response->getTotalPages(),
            'total_results' => $response->getTotalResults(),
        ];

        return $this->json(data: $data);
    }
}
