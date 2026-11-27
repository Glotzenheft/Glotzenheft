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

namespace App\Model\Request\TracklistSeason;

use DateTimeImmutable;
use Symfony\Component\Serializer\Attribute\Context;
use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Validator\Constraints as Assert;

readonly class TracklistSeasonEpisodeStateDto
{
    public function __construct(
        #[SerializedName('episode_id')]
        #[Assert\Positive]
        public int $episodeId,

        public bool $watched,

        #[SerializedName('watch_date_time')]
        #[Context([DateTimeNormalizer::FORMAT_KEY => 'Y-m-d H:i:s'])]
        public ?DateTimeImmutable $watchDateTime = null,
    ) {}

    #[Assert\IsTrue(message: 'An unwatched episode cannot have a watch date.')]
    public function isWatchDateValid(): bool
    {
        return $this->watched || $this->watchDateTime === null;
    }
}
