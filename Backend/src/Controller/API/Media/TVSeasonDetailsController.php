<?php

declare(strict_types=1);

namespace App\Controller\API\Media;

use App\API\TheMovieDB\TVSeries\SeasonDetails\TMDBTVSeasonDetailsService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;

class TVSeasonDetailsController extends AbstractController
{
    public function __construct
    (
        private readonly TMDBTVSeasonDetailsService $service
    )
    {
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/api/tv/season')]
    public function getTVSeasonDetails(Request $request): JsonResponse
    {
        $tmdbID = (int)$request->query->get('tmdbID');
        $seasonNumber = (int)$request->query->get('seasonNumber');

        $result = $this->service->getTVSeasonDetails($tmdbID, $seasonNumber);

        return $this->json($result);
    }
}
