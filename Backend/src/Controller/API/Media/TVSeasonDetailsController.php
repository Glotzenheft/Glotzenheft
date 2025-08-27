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

use App\Model\Request\TV\TVSeasonDetailDto;
use App\Security\IsAuthenticated;
use App\Service\TMDB\TVSeries\TVSeriesSeasonService;
use App\TmdbApi\ApiException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;

class TVSeasonDetailsController extends AbstractController
{
    public function __construct(
        private readonly TVSeriesSeasonService $service
    ){}

    /**
     * @param TVSeasonDetailDto $params
     * @return JsonResponse
     * @throws ApiException
     */
    #[IsAuthenticated]
    #[Route('/api/tv/season', name: 'get_tv_season_details', methods: ['GET'])]
    public function getTVSeasonDetails(
        #[MapQueryString]
        TVSeasonDetailDto $params
    ): JsonResponse
    {
        return $this->json(
            $this->service->getSeasonDetails($params)
        );
    }
}
