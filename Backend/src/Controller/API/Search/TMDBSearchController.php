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

namespace App\Controller\API\Search;

use App\Model\Request\Movie\MovieSearchRequestDto;
use App\Model\Request\Search\MultiSearchRequestDto;
use App\Model\Request\TV\TvSearchRequestDto;
use App\Service\TMDB\Search\TMDBSearchService;
use App\TmdbApi\ApiException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;


final class TMDBSearchController extends AbstractController
{
    public function __construct(
        private readonly TMDBSearchService $searchService
    ){}

    /**
     * @param MultiSearchRequestDto $searchParams
     * @return JsonResponse
     * @throws ApiException
     */
    #[Route('/api/search/multi', name: 'searchMultiEndpoint', methods: ['GET'])]
    public function searchMultiEndpoint(
        #[MapQueryString] MultiSearchRequestDto $searchParams
    ): JsonResponse
    {
        return $this->json(
            $this->searchService->searchMulti($searchParams)
        );
    }

    /**
     * @param MovieSearchRequestDto $searchParams
     * @return JsonResponse
     * @throws ApiException
     */
    #[Route('/api/search/movie', name: 'searchMovieEndpoint', methods: ['GET'])]
    public function searchMovieEndpoint(#[MapQueryString] MovieSearchRequestDto $searchParams): JsonResponse
    {
        return $this->json(
            $this->searchService->searchMovie($searchParams)
        );
    }

    /**
     * @param TvSearchRequestDto $searchParams
     * @return JsonResponse
     * @throws ApiException
     */
    #[Route('/api/search/tv', name: 'searchTVEndpoint', methods: ['GET'])]
    public function searchTVEndpoint(#[MapQueryString] TvSearchRequestDto $searchParams): JsonResponse
    {
        return $this->json(
            $this->searchService->searchTV($searchParams)
        );
    }
}
