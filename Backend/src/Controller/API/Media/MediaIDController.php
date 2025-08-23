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

namespace App\Controller\API\Media;

use App\Model\Request\Media\MediaIdDto;
use App\Security\IsAuthenticated;
use App\Service\Media\MediaService;
use App\TmdbApi\ApiException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;

class MediaIDController extends AbstractController
{
    public function __construct(
        private readonly MediaService $mediaService,
    ){}

    /**
     * API endpoint to fetch the media id.
     * TMDB id and media type are required.
     * Media type has to be 'movie' or 'tv'.
     *
     * @param MediaIdDto $params
     * @return JsonResponse
     * @throws ApiException
     */
    #[IsAuthenticated]
    #[Route('/api/media', name: 'get_media_id', methods: ['GET'])]
    public function mediaIdEndpoint(
        #[MapQueryString] MediaIdDto $params
    ): JsonResponse
    {
        $mediaId = $this->mediaService->findOrCreateMedia(params: $params)->getId();
        return $this->json([
            'media_id' => $mediaId,
        ]);
    }
}
