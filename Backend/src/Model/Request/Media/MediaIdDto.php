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

namespace App\Model\Request\Media;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class MediaIdDto
{
    public function __construct(
        #[SerializedName('tmdb_id')]
        #[Assert\NotBlank(
            message: 'Query parameter "tmdb_id" is required.'
        )]
        public ?int $tmdbId = null,
        #[SerializedName('media_type')]
        #[Assert\NotBlank(
            message: 'Query parameter "media_type" is required.'
        )]
        #[Assert\Choice(
            choices: ['movie', 'tv'],
            message: 'Query parameter "media_type" must be either "movie" or "tv".'
        )]
        public ?string $mediaType = null,
        public ?string $language = 'de-DE',
    ){}
}