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

namespace App\Model\Response\Media;

use App\TmdbApi\Model\MovieRecommendations200Response;
use App\TmdbApi\Model\MovieRecommendations200ResponseResultsInner;
use App\TmdbApi\Model\TvSeriesRecommendations200Response;
use App\TmdbApi\Model\TvSeriesRecommendations200ResponseResultsInner;
use Symfony\Component\Serializer\Attribute\SerializedName;

final readonly class RecommendationsResponseDto
{
    /** @var array<MovieRecommendations200ResponseResultsInner|TvSeriesRecommendations200ResponseResultsInner>|null */
    public ?array $recommendations;
    public ?int $page;
    #[SerializedName('total_pages')]
    public ?int $totalPages;
    #[SerializedName('total_results')]
    public ?int $totalResults;

    public function __construct(MovieRecommendations200Response|TvSeriesRecommendations200Response $response)
    {
        $this->page = $response->getPage();
        $this->recommendations = $response->getResults();
        $this->totalPages = $response->getTotalPages();
        $this->totalResults = $response->getTotalResults();
    }
}
