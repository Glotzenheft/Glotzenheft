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

class MovieDetailsController extends AbstractController
{
    use MediaDetailTrait;

    /**
     * API endpoint to retrieve movie details from the TMDB API.
     * Requires either a `tmdb_id` or a `media_id` as query parameter.
     * @example https://127.0.0.1:8000/api/movie?tmdb_id=372058&media_id=6
     * @param Request $request
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route('/api/movie', name: 'get_movie_details', methods: ['GET'])]
    public function getMovieDetails(Request $request): JsonResponse
    {
        $requestData = $this->handleRequest($request);

        if (isset($response['error']))
        {
            return $this->json($response['error'], $response['code']);
        }

        $media = $this->handleTMDBMediaDetail($requestData, MediaType::Movie);

        if (isset($media['error']))
        {
            return $this->json($media['error'], $media['code']);
        }

        return $this->json($media, context: ['groups' => ['media_details', 'tracklist_details']]);
    }
}
