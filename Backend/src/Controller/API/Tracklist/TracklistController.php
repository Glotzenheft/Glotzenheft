<?php

declare(strict_types=1);

namespace App\Controller\API\Tracklist;

use App\Security\IsAuthenticated;
use App\Service\Tracklist\TracklistService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class TracklistController extends AbstractController
{
    public function __construct
    (
        private readonly TracklistService $tracklistService
    )
    {
    }

    /**
     * Retrieve all tracklists from a user.
     * User identification by the bearer token.
     * @example https://127.0.0.1:8000/api/user-tracklists
     * @param Request $request
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route('/api/user-tracklists', name: 'get_tracklists', methods: ['GET'])]
    public function getTracklists(Request $request): JsonResponse
    {
        $response = $this->tracklistService->getUserTracklists($request);

        if (isset($response['error']))
        {
            return $this->json(['error' => $response['error']], $response['code']);
        }

        return $this->json($response['tracklists'], context: ['groups' => ['tracklist_details', 'tracklist_episodes']]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route('/api/tracklist', name: 'get_tracklist', methods: ['GET'])]
    public function getTracklist(Request $request): JsonResponse
    {
        $response = $this->tracklistService->getTracklist($request);

        if (isset($response['error']))
        {
            return $this->json($response['error'], (int) $response['code']);
        }

        return $this->json($response['tracklist'], context: ['groups' => ['tracklist_details', 'tracklist_episodes']]);
    }

    #[IsAuthenticated]
    #[Route('/api/tracklist', name: 'create_tracklist', methods: ['POST'])]
    public function createTracklist(Request $request): JsonResponse
    {
        $response = $this->tracklistService->createTracklist($request);

        if (isset($response['error']))
        {
            return $this->json($response['error'], (int) $response['code']);
        }

        return $this->json($response['tracklist'], context: ['groups' => ['tracklist_details']]);
    }

    #[IsAuthenticated]
    #[Route('/api/tracklist', name: 'update_tracklist', methods: ['PATCH'])]
    public function updateTracklist(Request $request): JsonResponse
    {
        $response = $this->tracklistService->updateTracklist($request);

        if (isset($response['error']))
        {
            return $this->json($response['error'], (int) $response['code']);
        }

        return $this->json($response['tracklist'], context: ['groups' => ['tracklist_details']]);
    }

    #[IsAuthenticated]
    #[Route('/api/tracklist', name: 'delete_tracklist', methods: ['DELETE'])]
    public function deleteTracklist(Request $request): JsonResponse
    {
        return $this->json([]);
    }
}
