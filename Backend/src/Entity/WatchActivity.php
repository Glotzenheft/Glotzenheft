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
use App\Repository\WatchActivityRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\HasLifecycleCallbacks]
#[ORM\Table(name: 'watch_activity')]
#[ORM\Index(name: 'idx_watch_activity_user_watched', columns: ['user_id', 'watched_at', 'id'])]
#[ORM\Index(name: 'idx_watch_activity_user_media_watched', columns: ['user_id', 'media_id', 'watched_at', 'id'])]
#[ORM\Entity(repositoryClass: WatchActivityRepository::class)]
#[ORM\UniqueConstraint(
    name: 'uniq_watch_activity_film_tracklist',
    columns: ['film_tracklist_id'],
)]
class WatchActivity
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'watchActivities')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'watchActivities')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Media $media = null;

    #[ORM\ManyToOne(inversedBy: 'watchActivities')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?Episode $episode = null;

    #[ORM\ManyToOne(inversedBy: 'watchActivities')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Tracklist $tracklist = null;

    #[ORM\OneToOne(inversedBy: 'watchActivity', cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?TracklistEpisode $tracklistEpisode = null;

    #[ORM\Column(nullable: true)]
    private ?DateTimeImmutable $watchedAt = null;

    #[ORM\Column(
        name: 'film_tracklist_id',
        type: 'integer',
        nullable: true,
        insertable: false,
        updatable: false,
        columnDefinition: 'INT GENERATED ALWAYS AS (
        CASE WHEN episode_id IS NULL AND tracklist_episode_id IS NULL
             THEN tracklist_id END
    ) VIRTUAL',
        generated: 'ALWAYS',
    )]
    private ?int $filmTracklistId = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getMedia(): ?Media
    {
        return $this->media;
    }

    public function setMedia(?Media $media): static
    {
        $this->media = $media;

        return $this;
    }

    public function getEpisode(): ?Episode
    {
        return $this->episode;
    }

    public function setEpisode(?Episode $episode): static
    {
        $this->episode = $episode;

        return $this;
    }

    public function getTracklist(): ?Tracklist
    {
        return $this->tracklist;
    }

    public function setTracklist(?Tracklist $tracklist): static
    {
        $this->tracklist = $tracklist;

        return $this;
    }

    public function getTracklistEpisode(): ?TracklistEpisode
    {
        return $this->tracklistEpisode;
    }

    public function setTracklistEpisode(?TracklistEpisode $tracklistEpisode): static
    {
        $this->tracklistEpisode = $tracklistEpisode;

        return $this;
    }

    public function getWatchedAt(): ?DateTimeImmutable
    {
        return $this->watchedAt;
    }

    public function setWatchedAt(?DateTimeImmutable $watchedAt): static
    {
        $this->watchedAt = $watchedAt;

        return $this;
    }
}
