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

use App\Model\Request\Movie\MovieDetailDto;
use App\Security\IsAuthenticated;
use App\Service\TMDB\Movies\MovieDetailService;
use App\TmdbApi\ApiException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class MovieDetailsController extends AbstractController
{
    public function __construct(
        private readonly MovieDetailService $movieDetailService,
        private readonly NormalizerInterface $normalizer,
    ){}

    /**
     * API endpoint to retrieve movie details from the TMDB API.
     * Requires either a `tmdb_id` or a `media_id` as query parameter.
     * @example https://127.0.0.1:8000/api/movie?tmdb_id=372058&media_id=6
     * @param Request $request
     * @param MovieDetailDto $dto
     * @return JsonResponse
     * @throws ExceptionInterface|ApiException
     */
    #[IsAuthenticated]
    #[Route('/api/movie', name: 'get_movie_details', methods: ['GET'])]
    public function getMovieDetails(
        Request $request,
        #[MapQueryString] MovieDetailDto $dto,
    ): JsonResponse
    {
        $userId = $request->attributes->get('user_id');
        $result = $this->movieDetailService->getMovieDetails($dto, $userId);

        if (isset($result['error']))
        {
            return $this->json(
                data: $result['error'],
                status: $result['code']
            );
        }

        return $this->json([
            'media' => $this->normalizer->normalize(
                $result['media'],
                context: ['groups' => ['media_details']]
            ),
            'tracklists' => $this->normalizer->normalize(
                $result['tracklists'],
                context: ['groups' => ['tracklist_details']]
            ),
        ]);
    }
}
