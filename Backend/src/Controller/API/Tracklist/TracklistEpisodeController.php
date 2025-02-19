<?php

declare(strict_types=1);

namespace App\Controller\API\Tracklist;

use App\Security\IsAuthenticated;
use App\Service\Tracklist\TracklistEpisodeService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class TracklistEpisodeController extends AbstractController
{
    public function __construct
    (
        private readonly TracklistEpisodeService $tracklistEpisodeService
    )
    {
    }

    /**
     * Creates an entry in tracklist_episode.
     *
     *  Required request parameters:
     *  - `tracklist_season_id` (int) - The ID of the TracklistSeason to which the episode belongs.
     *  - `episode_id` (int) - The ID of the Episode to be added.
     *  - `watch_date` (string, ISO 8601) - The date and time when the episode was watched (e.g., "2025-02-19T17:46:00.000Z").
     *  - `tracklist_id` (int) - The ID of the associated Tracklist.
     *
     * @example https://127.0.0.1:8000/api/tracklist-episode?tracklist_season_id=15&episode_id=811&watch_date=2025-02-19T17:46:00.000Z&tracklist_id=23
     *
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/api/tracklist-episode', name: 'tracklist-episode', methods: ['POST'])]
    #[IsAuthenticated]
    public function createTracklistEpisode(Request $request): JsonResponse
    {
        $tracklistEpisode = $this->tracklistEpisodeService->createTracklistEpisode($request);

        if (isset($tracklistEpisode['error']))
        {
            return $this->json($tracklistEpisode['error'], (int) $tracklistEpisode['code']);
        }

        return $this->json([$tracklistEpisode], context: ['groups' => ['tracklist_episode']]);
    }
}
