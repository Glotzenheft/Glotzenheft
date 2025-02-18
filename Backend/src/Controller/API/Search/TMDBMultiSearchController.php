<?php

declare(strict_types=1);

namespace App\Controller\API\Search;

use App\API\TheMovieDB\MultiSearch\TMDBMultiSearchService;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class TMDBMultiSearchController extends AbstractController
{

    public function __construct
    (
        private readonly TMDBMultiSearchService $multiSearchService,
        private readonly LoggerInterface $logger
    )
    {
    }

    /**
     * @example https://127.0.0.1:8000/api/multi-search?q=solo%20leveling
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/api/multi-search', methods: ['GET'])]
    public function multiSearch(Request $request): JsonResponse
    {
        $q = $request->query->get('q', '');
        $page = (int) $request->query->get('page', 1);
        $language = $request->query->get('language', 'de-DE');

        if (empty($q))
        {
            return $this->json(['error' => 'Query parameter "q" is required.'], 400);
        }

        try
        {
            $result = $this->multiSearchService->multiSearch($q, $page, $language);

            return $this->json([
                'page' => $page,
                'results' => $result['results'] ?? [],
                'total_results' => $result['total_results'] ?? 0,
                'total_pages' => $result['total_pages'] ?? 0,
            ], 200, [], ['groups' => ['search']]);
        } catch (Exception $e)
        {
            $this->logger->error('Error while using multi search: ' . $e->getMessage());
            return $this->json(['error' => 'Internal server error.'], 500);
        }
    }
}
