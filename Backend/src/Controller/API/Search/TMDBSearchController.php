<?php declare(strict_types=1);

namespace App\Controller\API\Search;

use App\Model\Request\Search\MovieSearchRequestDto;
use App\Model\Request\Search\MultiSearchRequestDto;
use App\Model\Request\Search\TvSearchRequestDto;
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
