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
    public function __construct(
        private readonly TracklistService $tracklistService
    ){}

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

    /**
     *  Creates a tracklist.
     *
     * @param Request $request
     * @return JsonResponse
     * @example POST /api/tracklist
     *          Header: Authorization: Bearer <JWT-TOKEN>
     *          Required request parameters:
     *          - `tracklist_status` (string) - Status of the tracklist.
     *          - `tracklist_name` (string) - Name of the tracklist.
     *          - `media_id` (int) - ID of the associated media.
     *          - `media_type` (string) - Type of the media.
     *          Optional request parameters:
     *          - `tracklist_rating` (int) - Rating of the tracklist.
     *          - `tracklist_start_date` (date)
     *          - `tracklist_finish_date` (date)
     *
     */
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

    /**
     * Updates a tracklist.
     *
     * @example PATCH /api/tracklist
     *          Header: Authorization: Bearer <JWT-TOKEN>
     *          Required request parameter:
     *          - `tracklist_id` (int) - The ID of the tracklist to update.
     *          Optional request parameters:
     *          - `tracklist_status` (string) - Status of the tracklist.
     *          - `tracklist_name` (string) - Name of the tracklist.
     *          - `tracklist_rating` (int) - Rating of the tracklist.
     *          - `tracklist_start_date` (date)
     *          - `tracklist_finish_date` (date)
     *
     * @param Request $request
     * @return JsonResponse
     */
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

    /**
     * Delete a tracklist and its tracklist season and tracklist episodes if avaible.
     *
     * @example DELETE /api/tracklist
     *          Header: Authorization: Bearer <JWT-TOKEN>
     *          Required request parameter:
     *          - `tracklist_id` (int) - The ID of the tracklist to delete.
     * @param Request $request
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route('/api/tracklist', name: 'delete_tracklist', methods: ['DELETE'])]
    public function deleteTracklist(Request $request): JsonResponse
    {
        $respone = $this->tracklistService->deleteTracklist($request);

        if (isset($respone['error']))
        {
            return $this->json($respone['error'], (int) $respone['code']);
        }

        return $this->json($respone['message'], $respone['code']);
    }
}
