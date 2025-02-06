<?php

declare(strict_types=1);

namespace App\Controller\API\Media;

use App\API\TheMovieDB\Traits\MediaDetailTrait;
use App\Enum\MediaType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class MovieDetailsController extends AbstractController
{
    use MediaDetailTrait;

    /**
     * @example https://127.0.0.1:8000/api/movie?tmdbID=372058
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/api/movie')]
    public function getTVSeriesDetails(Request $request): JsonResponse
    {
        $tmdbID = (int)$request->query->get('tmdbID');

        if (empty($tmdbID))
        {
            return $this->json(['error' => 'Query parameter "tmdbID" is required.'], 400);
        }

        $media = $this->handleTMDBMediaDetail($tmdbID, MediaType::Movie);

        return $this->json($media, context: ['groups' => ['media_details']]);
    }
}
