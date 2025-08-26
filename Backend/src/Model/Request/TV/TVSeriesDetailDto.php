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

class TVSeriesDetailDto
{
    public function __construct(
        #[SerializedName('media_id')]
        #[Assert\NotBlank(
            message: 'Parameter "media_id" is required.'
        )]
        #[Assert\Range(
            minMessage: 'Parameter "media_id" must be at least 1.',
            min: 1
        )]
        public ?int $mediaId = null,
        public string $language = 'de-DE',
        #[SerializedName('append_to_response')]
        public ?string $appendToResponse = null,
    ){}
}