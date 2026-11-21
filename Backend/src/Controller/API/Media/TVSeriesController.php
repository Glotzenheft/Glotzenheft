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
use App\Model\Request\Recommendation\TVSeriesRecommendationDto;
use App\Model\Request\TV\TVSeasonDetailDto;
use App\Model\Request\TV\TVSeriesDetailDto;
use App\Model\Request\User\ActivityPageRequestDto;
use App\Model\Response\Media\RecommendationsResponseDto;
use App\Security\IsAuthenticated;
use App\Service\TMDB\TVSeries\TMDBTVSeriesRecommendationService;
use App\Service\TMDB\TVSeries\TVSeriesDetailService;
use App\Service\TMDB\TVSeries\TVSeriesSeasonService;
use App\Service\User\UserActivityService;
use App\TmdbApi\ApiException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;

class TVSeriesController extends AbstractController
{
    public function __construct(
        private readonly TVSeriesDetailService $tvSeriesDetailService,
        private readonly TMDBTVSeriesRecommendationService $recommendationService,
        private readonly TVSeriesSeasonService $seasonService,
        private readonly UserActivityService $activityService,
    ) {}

    /**
     * API endpoint to retrieve TV series details (includes seasons and episodes) from the TMDB API.
     * Requires either a `tmdb_id` or a `media_id` as a query parameter.
     * @example https://127.0.0.1:8000/api/tv?media_id=1&tmdb_id=205366
     * @param User $user
     * @param TVSeriesDetailDto $dto
     * @return JsonResponse
     * @throws ApiException
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/tv',
        name: 'get_tv_series_details',
        methods: ['GET'],
        stateless: true,
    )]
    public function getTVSeriesDetails(
        User $user,
        #[MapQueryString] TVSeriesDetailDto $dto,
    ): JsonResponse
    {
        $result = $this->tvSeriesDetailService->getTVSeriesDetails(
            dto: $dto,
            user: $user
        );

        return $this->json(
            data: $result,
            status: Response::HTTP_OK,
        );
    }

    /**
     * @param TVSeriesRecommendationDto $dto
     * @return JsonResponse
     * @throws ApiException
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/tv/recommendations',
        name: 'get_tv_series_recommendations',
        methods: ['GET'],
        stateless: true,
    )]
    public function tvSeriesRecommendationsEndpoint(
        #[MapQueryString] TVSeriesRecommendationDto $dto
    ): JsonResponse
    {
        $response = $this->recommendationService->getTVSeriesRecommendations($dto);

        return $this->json(new RecommendationsResponseDto($response));
    }

    /**
     * @param TVSeasonDetailDto $dto
     * @return JsonResponse
     * @throws ApiException
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/tv/season',
        name: 'get_tv_season_details',
        methods: ['GET'],
        stateless: true,
    )]
    public function getTVSeasonDetails(
        #[MapQueryString]
        TVSeasonDetailDto $dto
    ): JsonResponse
    {
        return $this->json(
            $this->seasonService->getSeasonDetails($dto)
        );
    }

    #[IsAuthenticated]
    #[Route('/api/tv/{mediaId}/activities', name: 'get_tv_activities', requirements: ['mediaId' => '[1-9]\d*'], methods: ['GET'], stateless: true)]
    public function getActivities(
        User $user,
        int $mediaId,
        #[MapQueryString(validationFailedStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY)]
        ActivityPageRequestDto $request = new ActivityPageRequestDto(),
    ): JsonResponse {
        return $this->json($this->activityService->getMediaActivities($user, $request, MediaType::TV, $mediaId));
    }
}
