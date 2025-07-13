<?php
/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace App\Controller\API\Media;

use App\API\TheMovieDB\Traits\MediaDetailTrait;
use App\Enum\MediaType;
use App\Security\IsAuthenticated;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Exception\ExceptionInterface;

class TVSeriesDetailsController extends AbstractController
{
    use MediaDetailTrait;

    /**
     * API endpoint to retrieve tv series details (includes seasons and episodes) from the TMDB API.
     * Requires either a `tmdb_id` or a `media_id` as query parameter.
     * @example https://127.0.0.1:8000/api/tv?media_id=1&tmdb_id=205366
     * @param Request $request
     * @return JsonResponse
     * @throws ExceptionInterface
     */
    #[IsAuthenticated]
    #[Route('/api/tv', name: 'get_tv_series_details', methods: ['GET'])]
    public function getTVSeriesDetails(Request $request): JsonResponse
    {
        $requestData = $this->handleRequest($request);

        if (isset($requestData['error']))
        {
            return $this->json($requestData['error'], $requestData['code']);
        }

        $media = $this->handleTMDBMediaDetail($requestData, MediaType::TV);

        if (isset($media['error']))
        {
            return $this->json($media['error'], $media['code']);
        }

        return new JsonResponse([
            'media' => $this->normalizer->normalize($media['media'], null, ['groups' => ['media_details']]),
            'tracklists' => $this->normalizer->normalize($media['tracklists'], null, ['groups' => ['tracklist_details']]),
        ]);
    }
}
