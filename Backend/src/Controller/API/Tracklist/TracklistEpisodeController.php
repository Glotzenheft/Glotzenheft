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
use App\Model\Request\TracklistEpisode\CreateTracklistEpisodeRequestDto;
use App\Model\Request\TracklistEpisode\UpdateTracklistEpisodeRequestDto;
use App\Security\IsAuthenticated;
use App\Service\Tracklist\TracklistEpisodeService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

class TracklistEpisodeController extends AbstractController
{
    use ConditionalResponseTrait;

    public function __construct(
        private readonly TracklistEpisodeService $tracklistEpisodeService
    ){}

    /**
     * @param CreateTracklistEpisodeRequestDto $dto
     * @param User $user
     * @param Request $request
     * @return Response
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklist-episodes',
        name: 'create_tracklist_episode',
        methods: ['POST'],
        stateless: true,
    )]
    public function createTracklistEpisode(
        #[MapRequestPayload] CreateTracklistEpisodeRequestDto $dto,
        User $user,
        Request $request
    ): Response
    {
        $tracklistEpisodeResponse = $this->tracklistEpisodeService->createTracklistEpisode(
            dto: $dto,
            user: $user
        );

        return $this->createConditionalResponse(
            request: $request,
            data: $tracklistEpisodeResponse,
            successStatus: Response::HTTP_CREATED,
        );
    }

    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklist-episodes/{tracklistEpisodeId}',
        name: 'update_tracklist_episode',
        requirements: ['tracklistEpisodeId' => '\d+'],
        methods: ['PATCH'],
        stateless: true,
    )]
    public function updateTracklistEpisode(
        int $tracklistEpisodeId,
        #[MapRequestPayload] UpdateTracklistEpisodeRequestDto $dto,
        User $user,
        Request $request
    ): Response|JsonResponse
    {
        $tracklistEpisodeResponse = $this->tracklistEpisodeService->updateTracklistEpisode(
            tracklistEpisodeId: $tracklistEpisodeId,
            dto: $dto,
            user: $user,
            request: $request
        );

        return $this->createConditionalResponse(
            request: $request,
            data: $tracklistEpisodeResponse,
            successStatus: Response::HTTP_OK,
        );
    }

    /**
     * @param int $tracklistEpisodeId
     * @param User $user
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklist-episodes/{tracklistEpisodeId}',
        name: 'delete_tracklist_episode',
        requirements: ['tracklistEpisodeId' => '\d+'],
        methods: ['DELETE'],
        stateless: true,
    )]
    public function deleteTracklistEpisode(
        int $tracklistEpisodeId,
        User $user,
    ): JsonResponse
    {
        $this->tracklistEpisodeService->deleteTracklistEpisode(
            tracklistEpisodeId: $tracklistEpisodeId,
            user: $user
        );

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
