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

namespace App\Controller\API\TracklistTag;

use App\Entity\User;
use App\Model\Request\TracklistTag\TracklistIdsRequestDto;
use App\Model\Request\TracklistTag\TracklistTagIdsRequestDto;
use App\Security\IsAuthenticated;
use App\Service\TracklistTag\TracklistTagAssociationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

class TracklistTagAssociationController extends AbstractController
{
    public function __construct(
        private readonly TracklistTagAssociationService $tracklistTagAssociationService
    ){}

    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklists/{tracklistId}/tags/{tagId}',
        name: 'add_tag_to_tracklist',
        requirements: [
            'tracklistId' => '\d+',
            'tagId' => '\d+',
        ],
        methods: ['POST'],
        stateless: true
    )]
    public function addTagToTracklistEndpoint(
        int $tracklistId,
        int $tagId,
        User $user
    ): JsonResponse
    {
        $this->tracklistTagAssociationService->addTagToTracklist(
            tracklistId: $tracklistId,
            tagId: $tagId,
            user: $user
        );

        return $this->json(
            data: null,
            status: Response::HTTP_NO_CONTENT
        );
    }

    #[IsAuthenticated]
    #[Route(
        path: '/api/tags/{tagId}/tracklists/{tracklistId}',
        name: 'add_tracklist_to_tag',
        requirements: [
            'tagId' => '\d+',
            'tracklistId' => '\d+',
        ],
        methods: ['POST'],
        stateless: true
    )]
    public function addTracklistToTagEndpoint(
        int $tracklistId,
        int $tagId,
        User $user
    ): JsonResponse
    {
        $this->tracklistTagAssociationService->addTracklistToTag(
            tracklistId: $tracklistId,
            tagId: $tagId,
            user: $user
        );

        return $this->json(
            data: null,
            status: Response::HTTP_NO_CONTENT
        );
    }

    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklists/{tracklistId}/tags',
        name: 'add_tags_to_tracklist',
        requirements: ['tracklistId' => '\d+'],
        methods: ['POST'],
        stateless: true
    )]
    public function addTagsToTracklistEndpoint(
        int $tracklistId,
        User $user,
        #[MapRequestPayload] TracklistTagIdsRequestDto $dto,
    ): JsonResponse
    {
        $this->tracklistTagAssociationService->addTagsToTracklists(
            tracklistId: $tracklistId,
            user: $user,
            tagIds: $dto->tracklistTagIdsArray
        );

        return $this->json(
            data: null,
            status: Response::HTTP_NO_CONTENT
        );
    }

    #[IsAuthenticated]
    #[Route(
        path: '/api/tags/{tagId}/tracklists',
        name: 'add_tracklists_to_tag',
        requirements: ['tagId' => '\d+'],
        methods: ['POST'],
        stateless: true
    )]
    public function addTracklistsToTagEndpoint(
        int $tagId,
        User $user,
        #[MapRequestPayload] TracklistIdsRequestDto $dto,
    ): JsonResponse
    {
        $this->tracklistTagAssociationService->addTracklistsToTag(
            tagId: $tagId,
            user: $user,
            tracklistIds: $dto->tracklistIdsArray
        );

        return $this->json(
            data: null,
            status: Response::HTTP_NO_CONTENT
        );
    }

    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklists/{tracklistId}/tags/{tagId}',
        name: 'remove_tag_from_tracklist',
        requirements: [
            'tracklistId' => '\d+',
            'tagId' => '\d+',
        ],
        methods: ['DELETE'],
        stateless: true
    )]
    public function removeTagFromTracklistEndpoint(
        int $tracklistId,
        int $tagId,
        User $user
    ): JsonResponse
    {
        $this->tracklistTagAssociationService->removeTagFromTracklist(
            tracklistId: $tracklistId,
            tagId: $tagId,
            user: $user
        );

        return $this->json(
            data: null,
            status: Response::HTTP_NO_CONTENT
        );
    }

    #[IsAuthenticated]
    #[Route(
        path: '/api/tags/{tagId}/tracklists/{tracklistId}',
        name: 'remove_tracklist_from_tag',
        requirements: [
            'tagId' => '\d+',
            'tracklistId' => '\d+',
        ],
        methods: ['DELETE'],
        stateless: true
    )]
    public function removeTracklistFromTagEndpoint(
        int $tracklistId,
        int $tagId,
        User $user
    ): JsonResponse
    {
        $this->tracklistTagAssociationService->removeTracklistFromTag(
            tagId: $tagId,
            tracklistId: $tracklistId,
            user: $user
        );

        return $this->json(
            data: null,
            status: Response::HTTP_NO_CONTENT
        );
    }

    #[IsAuthenticated]
    #[Route(
        path: '/api/tags/{tagId}/tracklists',
        name: 'remove_tracklists_from_tag',
        requirements: ['tagId' => '\d+'],
        methods: ['DELETE'],
        stateless: true
    )]
    public function removeTracklistsFromTagEndpoint(
        int $tagId,
        User $user,
        #[MapRequestPayload] TracklistIdsRequestDto $dto,
    ): JsonResponse
    {
        $this->tracklistTagAssociationService->removeTracklistsFromTag(
            tagId: $tagId,
            user: $user,
            tracklistIds: $dto->tracklistIdsArray
        );

        return $this->json(
            data: null,
            status: Response::HTTP_NO_CONTENT
        );
    }

    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklists/{tracklistId}/tags',
        name: 'remove_tags_from_tracklist',
        requirements: ['tracklistId' => '\d+'],
        methods: ['DELETE'],
        stateless: true
    )]
    public function removeTagsFromTracklistEndpoint(
        int $tracklistId,
        User $user,
        #[MapRequestPayload] TracklistTagIdsRequestDto $dto,
    ): JsonResponse
    {
        $this->tracklistTagAssociationService->removeTagsFromTracklist(
            tracklistId: $tracklistId,
            user: $user,
            tagIds: $dto->tracklistTagIdsArray
        );

        return $this->json(
            data: null,
            status: Response::HTTP_NO_CONTENT
        );
    }
}