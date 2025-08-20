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
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

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

    public function __construct(
        private readonly TMDBMultiSearchService $multiSearchService,
        private readonly LoggerInterface $logger
    ){}

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
