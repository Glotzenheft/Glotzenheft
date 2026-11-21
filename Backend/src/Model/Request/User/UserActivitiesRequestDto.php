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

namespace App\Model\Request\User;

use App\Enum\ActivitySortOrder;
use Symfony\Component\Serializer\Attribute\SerializedName;
use App\Enum\MediaType;

final readonly class UserActivitiesRequestDto extends ActivityPageRequestDto
{
    public function __construct(
        int $page = 1,
        int $itemsPerPage = 50,
        #[SerializedName('media_type')]
        public ?MediaType $mediaType = null,
        string $search = '',
        ActivitySortOrder $sortOrder = ActivitySortOrder::Newest,
    ) {
        parent::__construct($page, $itemsPerPage, $search, $sortOrder);
    }
}
