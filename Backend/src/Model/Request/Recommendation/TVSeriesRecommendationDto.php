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

namespace App\Model\Request\Recommendation;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class TVSeriesRecommendationDto
{
    public function __construct(
        #[SerializedName('tmdb_series_id')]
        #[Assert\NotBlank(
            message: 'Tmdb series id parameter "tmdb_series_id" is required.'
        )]
        public ?int $tmdbSeriesId = null,
        public ?string $language = 'de-DE',
        #[Assert\Range(
            minMessage: 'Page number must be at least 1.',
            min: 1
        )]
        public int $page = 1,
    ){}
}