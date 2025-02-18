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
        $data = $this->handleRequest($request);

        if (!isset($data['userID']))
        {
            return $this->json(['error' => 'User not found'], 404);
        }

        $response = $this->tracklistService->getUserTracklist($data);

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
        $data = $this->handleRequest($request);

        if (!$data['tracklistID'])
        {
            return $this->json(['error' => 'TracklistID not provided.'], 400);
        }

        $response = $this->tracklistService->getTracklist($data);

        if (isset($response['error']))
        {
            return $this->json($response['error'], $response['code']);
        }

        return $this->json($response['tracklist'], context: ['groups' => ['tracklist_details', 'tracklist_episodes']]);
    }

    #[IsAuthenticated]
    #[Route('/api/tracklist', name: 'create_tracklist', methods: ['POST'])]
    public function createTracklist(Request $request): JsonResponse
    {
        $data = $this->handleRequest($request);

        if (!isset($data['tracklistName'], $data['userID'], $data['tracklistStatus'], $data['mediaID'], $data['mediaType']))
        {
            return $this->json(['error' => 'Invalid request data'], 400);
        }

        if (isset($data['tracklistID']))
        {
            return $this->json(['error' => 'Tracklist ID provided, even though create tracklist endpoint used!'], 400);
        }

        if ($data['mediaType'] === 'tv' && !isset($data['seasonID']))
        {
            return $this->json(['error' => 'Season ID not provided.'], 400);
        }

        $response = $this->tracklistService->createTracklist($data);

        if (isset($response['error']))
        {
            return $this->json($response['error'], $response['code']);
        }
        return $this->json($response['tracklist'], context: ['groups' => ['tracklist_details']]);
    }

    #[IsAuthenticated]
    #[Route('/api/tracklist', name: 'update_tracklist', methods: ['PATCH'])]
    public function updateTracklist(): JsonResponse
    {
        return $this->json([]);
    }

    #[IsAuthenticated]
    #[Route('/api/tracklist', name: 'delete_tracklist', methods: ['DELETE'])]
    public function deleteTracklist(): JsonResponse
    {
        return $this->json([]);
    }

    private function handleRequest(Request $request): array
    {
        $tracklistName = $request->query->get('tracklist_name') ?: null;

        $tracklistID = $request->query->get('tracklist_id') ?: null;
        $tracklistID = $tracklistID !== null ? (int) $tracklistID : null;

        $userID = $request->attributes->get('user_id') ?: null;

        $mediaID = $request->query->get('media_id') ?: null;
        $mediaID = $mediaID !== null ? (int) $mediaID : null;

        $mediaType = $request->query->get('media_type') ?: null;

        $seasonID = $request->query->get('season_id') ?: null;
        $seasonID = $seasonID !== null ? (int) $seasonID : null;

        $tracklistStatus = $request->query->get('tracklist_status') ?: null;

        $tracklistRating = $request->query->get('tracklist_rating') ?: null;
        $tracklistRating = $tracklistRating !== null ? (int) $tracklistRating : null;

        $tracklistStartDate = $request->query->get('tracklist_start_date') ?: null;

        $tracklistFinishDate = $request->query->get('tracklist_finish_date') ?: null;

        return [
            'tracklistName' => $tracklistName,
            'tracklistID' => $tracklistID,
            'userID' => $userID,
            'mediaID' => $mediaID,
            'mediaType' => $mediaType,
            'seasonID' => $seasonID,
            'tracklistStatus' => $tracklistStatus,
            'tracklistRating' => $tracklistRating,
            'tracklistStartDate' => $tracklistStartDate,
            'tracklistFinishDate' => $tracklistFinishDate,
        ];
    }
}
