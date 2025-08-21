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

namespace App\Model\Request\Search;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class MovieSearchRequestDto
{
    public function __construct(
        #[Assert\NotBlank(
            message: 'Search query parameter "q" is required.'
        )]
        public ?string $q = null,
        #[SerializedName('include_adult')]
        public bool $includeAdult = true,
        public string $language = 'de-DE',
        #[SerializedName('primary_release_year')]
        public ?string $primaryReleaseYear = null,
        #[Assert\Range(
            minMessage: 'Page number must be at least 1.',
            min: 1
        )]
        public int $page = 1,
        public ?string $region = null,
        public ?int $year = null
    ){}
}