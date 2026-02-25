<?php
declare(strict_types=1);

namespace App\Controller\API\TracklistTag;

use App\Entity\User;
use App\Model\Request\TracklistTag\CreateTracklistTagRequestDto;
use App\Security\IsAuthenticated;
use App\Service\TracklistTag\TracklistTagService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

class TracklistTagController extends AbstractController
{
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
        name: 'get_tracklist_tags',
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
    public function getTracklistTagWithTracklistsEndpoint(User $user, int $tagId): JsonResponse
    {
        return $this->json([]);
    }

    #[IsAuthenticated]
    #[Route(
        path:'/api/tags',
        name: 'app_tracklist_tag',
        methods: ['POST'],
        stateless: true,
    )]
    public function createTracklistTagEndpoint(
        #[MapRequestPayload] CreateTracklistTagRequestDto $dto,
        User $user
    ): JsonResponse
    {
        return $this->json(
            data: $this->tracklistTagService->createTracklistTag($user, $dto),
            status: Response::HTTP_CREATED
        );
    }
}
