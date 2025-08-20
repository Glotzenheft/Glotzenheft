<?php
/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

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
    public function __construct(
        private readonly TracklistEpisodeService $tracklistEpisodeService
    ){}

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
    #[IsAuthenticated]
    #[Route('/api/tracklist-episode', name: 'create_tracklist_episode', methods: ['POST'])]
    public function createTracklistEpisode(Request $request): JsonResponse
    {
        $tracklistEpisode = $this->tracklistEpisodeService->createTracklistEpisode($request);

        if (isset($tracklistEpisode['error']))
        {
            return $this->json($tracklistEpisode['error'], (int) $tracklistEpisode['code']);
        }

        return $this->json([$tracklistEpisode], context: ['groups' => ['tracklist_episode']]);
    }

    /**
     * Update the watch date of a tracklist episode entry.
     *
     *  Required request parameters:
     *  `tracklist_id` (int)
     *  `tracklist_season_id` (int)
     *  `tracklist_episode_id` (int)
     *  `watch_date` (string, ISO 8601)
     * @example https://127.0.0.1:8000/api/tracklist-episode?tracklist_id=26&tracklist_season_id=18&tracklist_episode_id=31&watch_date=2024-01-28T13:48:00.000Z`
     *
     * @param Request $request
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route('/api/tracklist-episode', name: 'update_tracklist_episode', methods: ['PATCH'])]
    public function updateTracklistEpisode(Request $request): JsonResponse
    {
        $tracklistEpisode = $this->tracklistEpisodeService->updateTracklistEpisode($request);

        if (isset($tracklistEpisode['error']))
        {
            return $this->json($tracklistEpisode['error'], (int) $tracklistEpisode['code']);
        }

        return $this->json([$tracklistEpisode], context: ['groups' => ['tracklist_episode']]);
    }

    /**
     * Delete a tracklist episode entry.
     *
     * Required request parameters:
     * `tracklist_id` (int)
     * `tracklist_season_id` (int)
     * `tracklist_episode_id` (int)
     *
     * @example https://127.0.0.1:8000/api/tracklist-episode?tracklist_id=26&tracklist_season_id=18&tracklist_episode_id=32
     *
     * @param Request $request
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route('/api/tracklist-episode', name: 'delete_tracklist_episode', methods: ['DELETE'])]
    public function deleteTracklistEpisode(Request $request): JsonResponse
    {
        $tracklistEpisode = $this->tracklistEpisodeService->deleteTracklistEpisode($request);

        if (isset($tracklistEpisode['error']))
        {
            return $this->json($tracklistEpisode['error'], (int) $tracklistEpisode['code']);
        }

        return $this->json($tracklistEpisode['message']);
    }
}
