<?php

declare(strict_types=1);

namespace App\Controller\API\Media;

use App\Model\Request\Recommendation\MovieRecommendationDto;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;

class MovieRecommendationController extends AbstractController
{
    #[Route('/api/movie-recommendation')]
    public function movieRecommendationEndpoint(
        #[MapQueryString] MovieRecommendationDto $params
    ): JsonResponse
    {
        return $this->json();
    }
}
