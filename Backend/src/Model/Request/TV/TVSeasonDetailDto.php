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

namespace App\Model\Request\TV;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class TVSeasonDetailDto
{
    public function __construct(
        #[SerializedName('tmdb_id')]
        #[Assert\NotBlank(message: 'Query parameter "tmdb_id" is required.')]
        #[Assert\Type(type: 'integer')]
        #[Assert\Positive(message: 'Query parameter "tmdb_id" must be a positive number.')]
        public int $tmdbId,

        #[SerializedName('season_number')]
        #[Assert\NotBlank(message: 'Query parameter "season_number" is required.')]
        #[Assert\Type(type: 'integer')]
        #[Assert\GreaterThanOrEqual(value: 0, message: 'Query parameter "season_number" must be 0 or greater.')]
        public int $seasonNumber,

        public string $language = 'de-DE',
        #[SerializedName('append_to_response')]
        public ?string $appendToResponse = null,
    ) {}
}