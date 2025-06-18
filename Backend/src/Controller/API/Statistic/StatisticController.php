<?php

declare(strict_types=1);

namespace App\Controller\API\Statistic;

use App\Security\IsAuthenticated;
use App\Service\Statistic\StatisticService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class StatisticController extends AbstractController
{
    public function __construct(
        private readonly StatisticService $statisticService
    ){}

    /**
     * Get all watch hours for each day from a user.
     * @param Request $request
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route('/api/statistic/watchtime-per-day', name: 'watch_time_per_day', methods: ['GET'])]
    public function getWatchTimePerDay(Request $request): JsonResponse
    {
        $response = $this->statisticService->getWatchTimePerDay($request);

        if (isset($response['error']))
        {
            return $this->json(['error' => $response['error']], $response['code']);
        }

        return $this->json($response);
    }

    /**
     * Get all tracklist ratings from a user.
     * @param Request $request
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route('/api/statistic/user-ratings', name: 'user_ratings', methods: ['GET'])]
    public function getUserRatings(Request $request): JsonResponse
    {
        $response = $this->statisticService->getUserRatings($request);

        if (isset($response['error']))
        {
            return $this->json(['error' => $response['error']], $response['code']);
        }

        return $this->json($response);
    }
}
