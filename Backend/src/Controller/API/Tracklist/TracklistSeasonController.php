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
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace App\Controller\API\Tracklist;

use App\Controller\API\Traits\ConditionalResponseTrait;
use App\Entity\User;
use App\Model\Request\TracklistSeason\PatchTracklistSeasonEpisodesDto;
use App\Security\IsAuthenticated;
use App\Service\Tracklist\TracklistSeasonService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

class TracklistSeasonController extends AbstractController
{
    use ConditionalResponseTrait;

    public function __construct(private readonly TracklistSeasonService $service) {}

    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklist-seasons',
        name: 'get_tracklist_seasons',
        methods: ['GET'],
        stateless: true,
    )]
    public function getTracklistSeasons(User $user): JsonResponse
    {
        return $this->json($this->service->getTracklistSeasons($user));
    }

    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklist-seasons/{tracklistSeasonId}',
        name: 'get_tracklist_season',
        requirements: ['tracklistSeasonId' => '\d+'],
        methods: ['GET'],
        stateless: true,
    )]
    public function getTracklistSeason(int $tracklistSeasonId, User $user): JsonResponse
    {
        return $this->json($this->service->getTracklistSeason($tracklistSeasonId, $user));
    }

    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklist-seasons/{tracklistSeasonId}/episodes',
        name: 'patch_tracklist_season_episodes',
        requirements: ['tracklistSeasonId' => '\d+'],
        methods: ['PATCH'],
        stateless: true,
    )]
    public function patchEpisodes(
        int $tracklistSeasonId,
        #[MapRequestPayload] PatchTracklistSeasonEpisodesDto $dto,
        User $user,
        Request $request,
    ): Response
    {
        $season = $this->service->patchEpisodes($tracklistSeasonId, $user, $dto);
        return $this->createConditionalResponse($request, $season, Response::HTTP_OK);
    }
}
