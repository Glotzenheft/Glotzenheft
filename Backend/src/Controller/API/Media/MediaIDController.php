<?php

declare(strict_types=1);

namespace App\Controller\API\Media;

use App\API\TheMovieDB\Traits\MediaDetailTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class MediaIDController extends AbstractController
{
    use MediaDetailTrait;

    /**
     * @example https://127.0.0.1:8000/api/media?tmdb_id=205366&media_type=tv
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/api/media', name: 'get_media_id', methods: ['GET'])]
    public function getMediaID(Request $request): JsonResponse
    {
        $tmdbID = $request->query->get('tmdb_id');
        $tmdbID = $tmdbID !== null ? (int) $tmdbID : null;

        $mediaType = $request->query->get('media_type') ?? null;
        if ($tmdbID === null || $mediaType === null)
        {
            return new JsonResponse([
                'error' => 'TMDB ID is required.',
                'code' => 400,
            ]);
        }

        $data = [
            'tmdb_id' =>$tmdbID,
            'media_type' =>$mediaType
        ];
        $mediaID = $this->searchMediaID($data);

        return $this->json($mediaID);
    }
}
