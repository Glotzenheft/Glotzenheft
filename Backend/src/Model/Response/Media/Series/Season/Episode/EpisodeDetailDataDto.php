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

namespace App\Model\Response\Media\Series\Season\Episode;

use App\Entity\Episode;

readonly class EpisodeDetailDataDto
{
    public function __construct(
        public int $id,
        public int $tmdbEpisodeId,
        public string $createdAt,
        public ?string $updatedAt,
        public string $name,
        public string $overview,
        public int $episodeNumber,
        public int $runtime,
        public ?string $stillPath,
        public ?string $airDate,
    ){}

    /**
     * @param Episode $episode
     * @return self
     */
    public static function fromEntity(Episode $episode): self
    {
        return new self(
            id: $episode->getId(),
            tmdbEpisodeId: $episode->getTmdbEpisodeId(),
            createdAt: $episode->getCreatedAt()->format('Y-m-d H:i:s'),
            updatedAt: $episode->getUpdatedAt()?->format('Y-m-d H:i:s'),
            name: $episode->getName(),
            overview: $episode->getOverview(),
            episodeNumber: $episode->getEpisodeNumber(),
            runtime: $episode->getRuntime(),
            stillPath: $episode->getStillPath(),
            airDate: $episode->getAirDate(),
        );
    }
}