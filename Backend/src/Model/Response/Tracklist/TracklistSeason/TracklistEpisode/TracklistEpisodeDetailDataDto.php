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

namespace App\Model\Response\Tracklist\TracklistSeason\TracklistEpisode;

use App\Entity\TracklistEpisode;
use App\Model\Response\Media\Series\Season\Episode\EpisodeLightDetailDataDto;
use Symfony\Component\Serializer\Attribute\SerializedName;

readonly class TracklistEpisodeDetailDataDto
{
    public function __construct(
        public int                       $id,
        public string                    $createdAt,
        public ?string                   $updatedAt,
        public ?string                   $watchDateTime,
        #[SerializedName('episode')]
        public EpisodeLightDetailDataDto $episodeDto,
    ){}

    /**
     * @param TracklistEpisode $tracklistEpisode
     * @param EpisodeLightDetailDataDto|null $episodeDto
     * @return self
     */
    public static function fromEntity(
        TracklistEpisode $tracklistEpisode,
        ?EpisodeLightDetailDataDto $episodeDto = null,
    ): self
    {
        if ($episodeDto === null)
        {
            $episodeDto = EpisodeLightDetailDataDto::fromEntity($tracklistEpisode->getEpisode());
        }

        return new self(
            id: $tracklistEpisode->getId(),
            createdAt: $tracklistEpisode->getCreatedAt()->format('Y-m-d H:i:s'),
            updatedAt: $tracklistEpisode->getUpdatedAt()?->format('Y-m-d H:i:s'),
            watchDateTime: $tracklistEpisode->getWatchDate()?->format('Y-m-d H:i:s'),
            episodeDto: $episodeDto,
        );
    }
}