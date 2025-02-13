<?php

declare(strict_types=1);

namespace App\Controller\API\Media;

use App\API\TheMovieDB\Traits\MediaDetailTrait;
use App\Enum\MediaType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class TVSeriesDetailsController extends AbstractController
{
    use MediaDetailTrait;

    /**
     * @example https://127.0.0.1:8000/api/tv?tmdbID=205366
     * @param Request $request
     * @return JsonResponse
     */
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

        return $this->json($media['media'], context: ['groups' => ['media_details']]);
    }
}
