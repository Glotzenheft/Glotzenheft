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

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Repository\TracklistEpisodeRepository;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Attribute\Context;

#[ORM\Entity(repositoryClass: TracklistEpisodeRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ORM\Table(name: 'tracklist_episode')]
#[ORM\Index(name: 'idx_episode_watch_date', columns: ['watch_date'])]
class TracklistEpisode
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['tracklist_details', 'tracklist_episode'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Episode::class, cascade: ['persist'], inversedBy: 'tracklistEpisodes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['tracklist_details', 'tracklist_episode'])]
    private ?Episode $episode = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['tracklist_details', 'tracklist_episode'])]
    #[Context(['datetime_format' => 'Y-m-d H:i:s'])]
    private ?DateTimeInterface $watchDate = null;

    #[ORM\ManyToOne(inversedBy: 'tracklistEpisodes')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups(['tracklist_episode'])]
    private ?TracklistSeason $tracklistSeason = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEpisode(): ?Episode
    {
        return $this->episode;
    }

    public function setEpisode(Episode $episode): static
    {
        $this->episode = $episode;

        return $this;
    }

    public function getWatchDate(): ?DateTimeInterface
    {
        return $this->watchDate;
    }

    public function setWatchDate(?DateTimeInterface $watchDate): static
    {
        $this->watchDate = $watchDate;

        return $this;
    }

    public function getTracklistSeason(): ?TracklistSeason
    {
        return $this->tracklistSeason;
    }

    public function setTracklistSeason(?TracklistSeason $tracklistSeason): static
    {
        $this->tracklistSeason = $tracklistSeason;

        return $this;
    }
}
