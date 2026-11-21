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

use App\Entity\User;
use App\Enum\MediaType;
use App\Model\Request\Movie\MovieDetailDto;
use App\Model\Request\Recommendation\MovieRecommendationDto;
use App\Model\Request\User\ActivityPageRequestDto;
use App\Model\Response\Media\RecommendationsResponseDto;
use App\Security\IsAuthenticated;
use App\Service\TMDB\Movies\MovieDetailService;
use App\Service\TMDB\Movies\TMDBMovieRecommendationService;
use App\Service\User\UserActivityService;
use App\TmdbApi\ApiException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;

class MovieController extends AbstractController
{
    public function __construct(
        private readonly MovieDetailService $movieDetailService,
        private readonly TMDBMovieRecommendationService $recommendationService,
        private readonly UserActivityService $activityService,
    ) {}

    /**
     * API endpoint to retrieve movie details from the TMDB API.
     * Requires either a `tmdb_id` or a `media_id` as query parameter.
     * @example https://127.0.0.1:8000/api/movie?tmdb_id=372058&media_id=6
     * @param User $user
     * @param MovieDetailDto $dto
     * @return JsonResponse
     * @throws ApiException
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/movie',
        name: 'get_movie_details',
        methods: ['GET'],
        stateless: true,
    )]
    public function getMovieDetails(
        User $user,
        #[MapQueryString] MovieDetailDto $dto,
    ): JsonResponse
    {
        $result = $this->movieDetailService->getMovieDetails(
            dto: $dto,
            user: $user
        );

        return $this->json(
            data: $result,
            status: Response::HTTP_OK,
        );
    }

    /**
     * @param MovieRecommendationDto $dto
     * @return JsonResponse
     * @throws ApiException
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/movie/recommendations',
        name: 'get_movie_recommendations',
        methods: ['GET'],
        stateless: true,
    )]
    public function movieRecommendationsEndpoint(
        #[MapQueryString] MovieRecommendationDto $dto
    ): JsonResponse
    {
        $response = $this->recommendationService->getMovieRecommendations($dto);

        return $this->json(new RecommendationsResponseDto($response));
    }

    #[IsAuthenticated]
    #[Route('/api/movie/{mediaId}/activities', name: 'get_movie_activities', requirements: ['mediaId' => '[1-9]\d*'], methods: ['GET'], stateless: true)]
    public function getActivities(
        User $user,
        int $mediaId,
        #[MapQueryString(validationFailedStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY)]
        ActivityPageRequestDto $request = new ActivityPageRequestDto(),
    ): JsonResponse {
        return $this->json($this->activityService->getMediaActivities($user, $request, MediaType::Movie, $mediaId));
    }
}
