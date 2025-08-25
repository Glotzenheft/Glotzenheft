<?php

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