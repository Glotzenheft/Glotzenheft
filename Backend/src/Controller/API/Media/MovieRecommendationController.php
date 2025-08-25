<?php

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
