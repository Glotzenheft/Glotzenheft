<?php
/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Repository\SeasonRepository;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Attribute\Context;

#[ORM\Entity(repositoryClass: SeasonRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Season
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['media_details', 'tracklist_details', 'tracklist_episode'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'seasons')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Media $media = null;

    #[ORM\Column]
    #[Groups(['media_details'])]
    private ?int $tmdbSeasonID = null;

    #[ORM\Column]
    #[Groups(['media_details', 'tracklist_details', 'tracklist_episode'])]
    private ?int $seasonNumber = null;

    #[ORM\Column(length: 255)]
    #[Groups(['media_details'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['media_details'])]
    private ?string $overview = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['media_details'])]
    #[Context(['datetime_format' => 'Y-m-d'])]
    private ?DateTimeInterface $airDate = null;

    #[ORM\Column]
    #[Groups(['media_details'])]
    private ?int $episodeCount = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['media_details'])]
    private ?string $posterPath = null;

    /**
     * @var Collection<int, Episode>
     */
    #[ORM\OneToMany(targetEntity: Episode::class, mappedBy: 'season', orphanRemoval: true)]
    #[Groups(['media_details'])]
    private Collection $episodes;

    /**
     * @var Collection<int, TracklistSeason>
     */
    #[ORM\OneToMany(targetEntity: TracklistSeason::class, mappedBy: 'season', orphanRemoval: true)]
    private Collection $tracklistSeasons;

    public function __construct()
    {
        $this->episodes = new ArrayCollection();
        $this->tracklistSeasons = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getTmdbSeasonID(): ?int
    {
        return $this->tmdbSeasonID;
    }

    public function setTmdbSeasonID(int $tmdbSeasonID): static
    {
        $this->tmdbSeasonID = $tmdbSeasonID;

        return $this;
    }

    public function getSeasonNumber(): ?int
    {
        return $this->seasonNumber;
    }

    public function setSeasonNumber(int $seasonNumber): static
    {
        $this->seasonNumber = $seasonNumber;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getOverview(): ?string
    {
        return $this->overview;
    }

    public function setOverview(string $overview): static
    {
        $this->overview = $overview;

        return $this;
    }

    public function getAirDate(): ?DateTimeInterface
    {
        return $this->airDate;
    }

    public function setAirDate(?DateTimeInterface $airDate): static
    {
        $this->airDate = $airDate;

        return $this;
    }

    public function getEpisodeCount(): ?int
    {
        return $this->episodeCount;
    }

    public function setEpisodeCount(int $episodeCount): static
    {
        $this->episodeCount = $episodeCount;

        return $this;
    }

    public function getPosterPath(): ?string
    {
        return $this->posterPath;
    }

    public function setPosterPath(?string $posterPath): static
    {
        $this->posterPath = $posterPath;

        return $this;
    }

    /**
     * @return Collection<int, Episode>
     */
    public function getEpisodes(): Collection
    {
        return $this->episodes;
    }

    public function addEpisode(Episode $episode): static
    {
        if (!$this->episodes->contains($episode))
        {
            $this->episodes->add($episode);
            $episode->setSeason($this);
        }

        return $this;
    }

    public function removeEpisode(Episode $episode): static
    {
        if ($this->episodes->removeElement($episode))
        {
            // set the owning side to null (unless already changed)
            if ($episode->getSeason() === $this)
            {
                $episode->setSeason(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, TracklistSeason>
     */
    public function getTracklistSeasons(): Collection
    {
        return $this->tracklistSeasons;
    }

    public function addTracklistSeason(TracklistSeason $tracklistSeason): static
    {
        if (!$this->tracklistSeasons->contains($tracklistSeason)) {
            $this->tracklistSeasons->add($tracklistSeason);
            $tracklistSeason->setSeason($this);
        }

        return $this;
    }

    public function removeTracklistSeason(TracklistSeason $tracklistSeason): static
    {
        if ($this->tracklistSeasons->removeElement($tracklistSeason)) {
            // set the owning side to null (unless already changed)
            if ($tracklistSeason->getSeason() === $this) {
                $tracklistSeason->setSeason(null);
            }
        }

        return $this;
    }
}
