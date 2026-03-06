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
use App\Model\Request\Tracklist\CreateTracklistDto;
use App\Model\Request\Tracklist\TracklistIdDto;
use App\Model\Request\Tracklist\UpdateTracklistDto;
use App\Security\IsAuthenticated;
use App\Service\Tracklist\TracklistService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

class TracklistController extends AbstractController
{
    use ConditionalResponseTrait;

    public function __construct(
        private readonly TracklistService $tracklistService
    ){}

    /**
     * @param User $user
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklists',
        name: 'get_tracklists',
        methods: ['GET'],
        stateless: true,
    )]
    public function getTracklistsEndpoint(User $user): JsonResponse
    {
        return $this->json(
            data: $this->tracklistService->getUserTracklists($user),
            status: Response::HTTP_OK
        );
    }

    /**
     * @param User $user
     * @param int $tracklistId
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklists/{tracklistId}',
        name: 'get_tracklist',
        requirements: ['tracklistId' => '\d+'],
        methods: ['GET'],
        stateless: true,
    )]
    public function getTracklistEndpoint(
        User $user,
        int $tracklistId,
    ): JsonResponse
    {
        $tracklist = $this->tracklistService->getTracklist(
            tracklistId: $tracklistId,
            user: $user
        );
        return $this->json(
            data: $tracklist,
            context: ['groups' => ['tracklist_details', 'tracklist_episodes']]);
    }

    /**
     *  Creates a tracklist.
     *
     * @param CreateTracklistDto $dto
     * @param User $user
     * @param Request $request
     * @return Response
     * @example POST /api/tracklist
     *          Header: Authorization: Bearer <JWT-TOKEN>
     *          Required parameter in JSON body:
     *          - `tracklist_status` (string) - Status of the tracklist.
     *          - `tracklist_name` (string) - Name of the tracklist.
     *          - `media_id` (int) - ID of the associated media.
     *          - `media_type` (string) - Type of the media.
     *          Optional parameter in JSON body:
     *          - `tracklist_rating` (int) - Rating of the tracklist.
     *          - `tracklist_start_date` (date)
     *          - `tracklist_finish_date` (date)
     *          Optimonal request parameter:
     *          - `return` - set to "minimal" for a 204 response
     *          Optional header paramter:
     *          - `Prefer` - set to "return=minimal" for a 204 response
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklists',
        name: 'create_tracklist',
        methods: ['POST'],
        stateless: true,
    )]
    public function createTracklistEndpoint(
        #[MapRequestPayload] CreateTracklistDto $dto,
        User $user,
        Request $request
    ): Response
    {
        $tracklist = $this->tracklistService->createTracklist(
            dto: $dto,
            user: $user
        );

        return $this->createConditionalResponse(
            request: $request,
            data: $tracklist,
            successStatus: Response::HTTP_CREATED,
            context: ['groups' => ['tracklist_details']]
        );
    }

    /**
     * Updates a tracklist.
     *
     * @param int $tracklistId
     * @param UpdateTracklistDto $dto
     * @param User $user
     * @param Request $request
     * @return Response
     * @example PATCH /api/tracklists/{tracklistId}
     *          Header: Authorization: Bearer <JWT-TOKEN>
     *          Optional parameter in JSON body:
     *          - `tracklist_status` (string) - Status of the tracklist.
     *          - `tracklist_name` (string) - Name of the tracklist.
     *          - `tracklist_rating` (int) - Rating of the tracklist.
     *          - `tracklist_start_date` (date)
     *          - `tracklist_finish_date` (date)
     *          Optimonal request parameter:
     *          - `return` - set to "minimal" for a 204 response
     *          Optional header paramter:
     *          - `Prefer` - set to "return=minimal" for a 204 response
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklists/{tracklistId}',
        name: 'update_tracklist',
        requirements: ['tracklistId' => '\d+'],
        methods: ['PATCH'],
        stateless: true,
    )]
    public function updateTracklistEndpoint(
        int $tracklistId,
        #[MapRequestPayload] UpdateTracklistDto $dto,
        User $user,
        Request $request
    ): Response
    {
        $tracklist = $this->tracklistService->updateTracklist(
            tracklistId: $tracklistId,
            dto: $dto,
            user: $user,
            requestData: $request->toArray()
        );

        return $this->createConditionalResponse(
            request: $request,
            data: $tracklist,
            successStatus: Response::HTTP_OK,
            context: ['groups' => ['tracklist_details']]
        );
    }

    /**
     * Delete a tracklist and its tracklist season and tracklist episodes if available.
     *
     * @param int $tracklistId
     * @param User $user
     * @return JsonResponse
     * @example DELETE /api/tracklist
     *          Header: Authorization: Bearer <JWT-TOKEN>
     *          Required request parameter:
     *          - `tracklist_id` (int) - The ID of the tracklist to delete.
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklists/{tracklistId}',
        name: 'delete_tracklist',
        requirements: ['tracklistId' => '\d+'],
        methods: ['DELETE'],
        stateless: true,
    )]
    public function deleteTracklist(
        int $tracklistId,
        User $user
    ): JsonResponse
    {
        $this->tracklistService->deleteTracklist(
            tracklistId: $tracklistId,
            user: $user
        );

        return $this->json(
            data: null,
            status: Response::HTTP_NO_CONTENT
        );
    }
}
