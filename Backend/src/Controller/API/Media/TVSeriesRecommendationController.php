<?php

declare(strict_types=1);

namespace App\Controller\API\Media;

use App\Model\Request\Recommendation\TVSeriesRecommendationDto;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;

class TVSeriesRecommendationController extends AbstractController
{
    #[Route('/api/movie-recommendation')]
    public function movieRecommendationEndpoint(
        #[MapQueryString] TVSeriesRecommendationDto $params
    ): JsonResponse
    {
        return $this->json();
    }
}