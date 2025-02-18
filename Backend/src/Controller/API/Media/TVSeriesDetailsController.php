<?php

declare(strict_types=1);

namespace App\Controller\API\Media;

use App\API\TheMovieDB\Traits\MediaDetailTrait;
use App\Enum\MediaType;
use App\Security\IsAuthenticated;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class TVSeriesDetailsController extends AbstractController
{
    use MediaDetailTrait;

    /**
     * API endpoint to retrieve tv series details (includes seasons and episodes) from the TMDB API.
     * Requires either a `tmdb_id` or a `media_id` as query parameter.
     * @example https://127.0.0.1:8000/api/tv?media_id=1&tmdb_id=205366
     * @param Request $request
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route('/api/tv', name: 'get_tv_series_details', methods: ['GET'])]
    public function getTVSeriesDetails(Request $request): JsonResponse
    {
        $requestData = $this->handleRequest($request);

        if (isset($response['error']))
        {
            return $this->json($response['error'], $response['code']);
        }

        $media = $this->handleTMDBMediaDetail($requestData, MediaType::TV);

        if (isset($media['error']))
        {
            return $this->json($media['error'], $media['code']);
        }

        return $this->json($media, context: ['groups' => ['media_details', 'tracklist_details']]);
    }
}
