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

use App\API\TheMovieDB\Traits\MediaDetailTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class MediaIDController extends AbstractController
{
    use MediaDetailTrait;

    /**
     * @example https://127.0.0.1:8000/api/media?tmdb_id=205366&media_type=tv
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/api/media', name: 'get_media_id', methods: ['GET'])]
    public function getMediaID(Request $request): JsonResponse
    {
        $tmdbID = $request->query->get('tmdb_id');
        $tmdbID = $tmdbID !== null ? (int) $tmdbID : null;

        $mediaType = $request->query->get('media_type') ?? null;
        if ($tmdbID === null || $mediaType === null)
        {
            return new JsonResponse([
                'error' => 'TMDB ID is required.',
                'code' => 400,
            ]);
        }

        $data = [
            'tmdb_id' =>$tmdbID,
            'media_type' =>$mediaType
        ];
        $mediaID = $this->searchMediaID($data);

        return $this->json($mediaID);
    }
}
