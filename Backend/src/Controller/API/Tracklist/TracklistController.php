<?php

declare(strict_types=1);

namespace App\Controller\API\Tracklist;

use App\Security\IsAuthenticated;
use App\Tracklist\TracklistService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class TracklistController extends AbstractController
{
    public function __construct
    (
        private readonly TracklistService $tracklistService
    )
    {
    }

    #[IsAuthenticated]
    #[Route('/api/tracklist', name: 'get_tracklist', methods: ['GET'])]
    public function getTracklist(Request $request): JsonResponse
    {
        $data = $this->handleRequest($request);

        if (!$data['tracklistID'])
        {
            return $this->json([
                'error' => 'TracklistID not provided.',
            ], 400);
        }

        $response = $this->tracklistService->getTracklist($data);

        if (isset($response['error']))
        {
            return $this->json($response['error'], $response['code']);
        }

        return $this->json($response['tracklist'], context: ['groups' => ['tracklist_details']]);
    }

    #[IsAuthenticated]
    #[Route('/api/tracklist', name: 'create_tracklist', methods: ['POST'])]
    public function createTracklist(Request $request): JsonResponse
    {
        $data = $this->handleRequest($request);

        if (!isset($data['tracklistName'], $data['userID'], $data['tracklistStatus'], $data['mediaID']))
        {
            return $this->json(['error' => 'Invalid request data'], 400);
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
        $tracklistName = $request->query->get('tracklist_name') ?? null;
        $tracklistID = (int) $request->query->get('tracklist_id') ?? null;
        $userID = $request->attributes->get('user_id') ?? null;
        $mediaID = (int) $request->query->get('media_id') ?? null;
        $tracklistStatus = $request->query->get('tracklist_status') ?? null;
        $tracklistRating = $request->query->get('tracklist_rating') ?? null;
        $tracklistStartDate = $request->query->get('tracklist_start_date') ?? null;
        $tracklistFinishDate = $request->query->get('tracklist_finish_date') ?? null;

        return [
            'tracklistName' => $tracklistName,
            'tracklistID' => $tracklistID,
            'userID' => $userID,
            'mediaID' => $mediaID,
            'tracklistStatus' => $tracklistStatus,
            'tracklistRating' => $tracklistRating,
            'tracklistStartDate' => $tracklistStartDate,
            'tracklistFinishDate' => $tracklistFinishDate,
        ];
    }
}
