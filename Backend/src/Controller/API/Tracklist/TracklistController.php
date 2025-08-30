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
    public function __construct(
        private readonly TracklistService $tracklistService
    ){}

    /**
     * Retrieve all tracklists from a user.
     * User identification by the bearer token.
     * @example https://127.0.0.1:8000/api/user-tracklists
     * @param User $user
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/user-tracklists',
        name: 'get_tracklists',
        methods: ['GET']
    )]
    public function getTracklistsEndpoint(User $user): JsonResponse
    {
        $tracklists = $this->tracklistService->getUserTracklists($user);

        return $this->json(
            data: $tracklists,
            context: ['groups' => ['tracklist_details', 'tracklist_episodes']]
        );
    }

    /**
     * @param TracklistIdDto $dto
     * @param User $user
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklist',
        name: 'get_tracklist',
        methods: ['GET']
    )]
    public function getTracklistEndpoint(
        #[MapQueryString] TracklistIdDto $dto,
        User $user
    ): JsonResponse
    {
        $tracklist = $this->tracklistService->getTracklist(
            tracklistId: $dto->tracklistId,
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
     * @return JsonResponse
     * @example POST /api/tracklist
     *          Header: Authorization: Bearer <JWT-TOKEN>
     *          Required parameter in json body:
     *          - `tracklist_status` (string) - Status of the tracklist.
     *          - `tracklist_name` (string) - Name of the tracklist.
     *          - `media_id` (int) - ID of the associated media.
     *          - `media_type` (string) - Type of the media.
     *          Optional parameter in json body:
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
        path: '/api/tracklist',
        name: 'create_tracklist',
        methods: ['POST'])]
    public function createTracklistEndpoint(
        #[MapRequestPayload] CreateTracklistDto $dto,
        User $user,
        Request $request
    ): JsonResponse
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
     * @param UpdateTracklistDto $dto
     * @param User $user
     * @param Request $request
     * @return JsonResponse
     * @example PATCH /api/tracklist
     *          Header: Authorization: Bearer <JWT-TOKEN>
     *          Required parameter in json body:
     *          - `tracklist_id` (int) - The ID of the tracklist to update.
     *          Optional parameter in json body:
     *          - `tracklist_status` (string) - Status of the tracklist.
     *          - `tracklist_name` (string) - Name of the tracklist.
     *          - `tracklist_rating` (int) - Rating of the tracklist.
     *          - `tracklist_start_date` (date)
     *          - `tracklist_finish_date` (date)
     *          Optimonal request parameter:
     *          - `return` - set to "minimal" for a 204 response
     *          Optional header paramter:
     *          - `Prefer` - set to "return=minimal" for a 204 response
     *
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklist',
        name: 'update_tracklist',
        methods: ['PATCH']
    )]
    public function updateTracklistEndpoint(
        #[MapRequestPayload] UpdateTracklistDto $dto,
        User $user,
        Request $request
    ): JsonResponse
    {
        $tracklist = $this->tracklistService->updateTracklist(
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
     * Delete a tracklist and its tracklist season and tracklist episodes if avaible.
     *
     * @param TracklistIdDto $dto
     * @param User $user
     * @return JsonResponse
     * @example DELETE /api/tracklist
     *          Header: Authorization: Bearer <JWT-TOKEN>
     *          Required request parameter:
     *          - `tracklist_id` (int) - The ID of the tracklist to delete.
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/tracklist',
        name: 'delete_tracklist',
        methods: ['DELETE']
    )]
    public function deleteTracklist(
        #[MapQueryString] TracklistIdDto $dto,
        User $user
    ): JsonResponse
    {
        $this->tracklistService->deleteTracklist(
            tracklistId: $dto->tracklistId,
            user: $user
        );

        return $this->json(
            data: null,
            status: Response::HTTP_NO_CONTENT
        );
    }

    /**
     * Erstellt eine HTTP-Antwort, die entweder das volle Datenobjekt (2xx)
     * oder eine leere Antwort (204) zurückgibt, basierend auf den
     * Client-Präferenzen im Query oder Header.
     *
     * @param Request $request
     * @param mixed $data
     * @param int $successStatus
     * @param array $context
     * @return JsonResponse
     */
    private function createConditionalResponse(
        Request $request,
        mixed $data,
        int $successStatus,
        array $context = []
    ): JsonResponse
    {
        $wantsMinimalByQuery = $request->query->get('return') === 'minimal';
        $preferHeader = $request->headers->get(
            key: 'Prefer',
            default: ''
        );
        $wantsMinimalByHeader = str_contains($preferHeader, 'return=minimal');
        if ($wantsMinimalByQuery || $wantsMinimalByHeader)
        {
            return $this->json(
                data: null,
                status: Response::HTTP_NO_CONTENT
            );
        }

        return $this->json(
            data: $data,
            status: $successStatus,
            context: $context
        );
    }
}
