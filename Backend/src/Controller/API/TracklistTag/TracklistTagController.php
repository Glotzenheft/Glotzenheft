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

use App\Controller\API\Traits\ConditionalResponseTrait;
use App\Entity\User;
use App\Model\Request\TracklistTag\CreateTracklistTagRequestDto;
use App\Model\Request\TracklistTag\UpdateTracklistTagRequestDto;
use App\Security\IsAuthenticated;
use App\Service\TracklistTag\TracklistTagService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

class TracklistTagController extends AbstractController
{
    use ConditionalResponseTrait;

    public function __construct(
        private readonly TracklistTagService $tracklistTagService
    ){}

    #[IsAuthenticated]
    #[Route(
        path: '/api/tags/{tagId}',
        name: 'get_tracklist_tag',
        requirements: ['tagId' => '\d+'],
        methods: ['GET'],
        stateless: true,
    )]
    public function getTracklistTagEndpoint(
        User $user,
        int $tagId
    ): JsonResponse
    {
        return $this->json($this->tracklistTagService->getTracklistTag(
            user: $user,
            id: $tagId
        ));
    }

    #[IsAuthenticated]
    #[Route(
        path: '/api/tags',
        name: 'get_all_tracklist_tags',
        methods: ['GET'],
        stateless: true,
    )]
    public function getAllTracklistTagsEndpoint(User $user): JsonResponse
    {
        return $this->json($this->tracklistTagService->getAllTracklistTags($user));
    }

    #[IsAuthenticated]
    #[Route(
        path: '/api/tags/{tagId}/tracklists',
        name: 'get_tracklist_tag_with_tracklists',
        requirements: ['tagId' => '\d+'],
        methods: ['GET'],
        stateless: true,
    )]
    public function getTracklistTagWithTracklistsEndpoint(
        User $user,
        int $tagId
    ): JsonResponse
    {
        $response = $this->tracklistTagService->getTracklistTagWithTracklists(
            user: $user,
            id: $tagId
        );

        return $this->json(
            data: $response,
            status: Response::HTTP_OK
        );
    }

    #[IsAuthenticated]
    #[Route(
        path: '/api/tags/tracklists',
        name: 'get_all_tracklist_tags_with_tracklists',
        methods: ['GET'],
        stateless: true,
    )]
    public function getAllTracklistTagsWithTracklistsEndpoint(User $user): JsonResponse
    {
        $response = $this->tracklistTagService->getAllTracklistTagsWithTracklists($user);

        return $this->json(
            data: $response,
            status: Response::HTTP_OK
        );
    }

    #[IsAuthenticated]
    #[Route(
        path:'/api/tags',
        name: 'create_tracklist_tag',
        methods: ['POST'],
        stateless: true,
    )]
    public function createTracklistTagEndpoint(
        #[MapRequestPayload] CreateTracklistTagRequestDto $dto,
        User $user,
        Request $request,
    ): JsonResponse
    {
        $tagResponse = $this->tracklistTagService->createTracklistTag(
            user:$user,
            dto:$dto
        );

        return $this->createConditionalResponse(
            request: $request,
            data: $tagResponse,
            successStatus: Response::HTTP_CREATED
        );
    }

    #[IsAuthenticated]
    #[Route(
        path: '/api/tags/{tagId}',
        name: 'update_tracklist_tag',
        requirements: ['tagId' => '\d+'],
        methods: ['PATCH'],
        stateless: true,
    )]
    public function updateTracklistTagEndpoint(
        int $tagId,
        #[MapRequestPayload] UpdateTracklistTagRequestDto $dto,
        User $user,
        Request $request,
    ): JsonResponse
    {
        $tagResponse = $this->tracklistTagService->updateTracklistTag(
            id: $tagId,
            user: $user,
            dto: $dto,
            requestData: $request->toArray()
        );

        return $this->createConditionalResponse(
            request: $request,
            data: $tagResponse,
            successStatus: Response::HTTP_OK
        );
    }
}
