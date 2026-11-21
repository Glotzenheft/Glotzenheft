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

namespace App\Model\Response\User;

use DateTimeImmutable;
use Symfony\Component\Serializer\Attribute\SerializedName;

final readonly class WatchActivityResponseDto
{
    public string $type;
    public string $date;
    public ?int $runtime;

    public function __construct(
        DateTimeImmutable $watchedAt,
        int|string|null $runtime,
        #[SerializedName('mediaID')]
        public int $mediaId,
        public string $mediaTitle,
        #[SerializedName('seasonID')]
        public ?int $seasonId,
        public ?int $seasonNumber,
        #[SerializedName('episodeID')]
        public ?int $episodeId,
        public ?int $episodeNumber,
        #[SerializedName('tracklistID')]
        public int $tracklistId,
        public string $tracklistName,
        #[SerializedName('tracklistSeasonID')]
        public ?int $tracklistSeasonId,
        #[SerializedName('tracklistEpisodeID')]
        public ?int $tracklistEpisodeId,
        public ?string $posterPath,
        public ?string $stillPath,
    ){
        $this->type = $episodeId === null ? 'movie' : 'episode';
        $this->date = $watchedAt->format('Y-m-d H:i:s');
        $this->runtime = $runtime === null ? null : (int) $runtime;
    }
}
