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
use App\Enum\MediaType;
use App\Repository\MediaRepository;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Attribute\Context;

#[ORM\Entity(repositoryClass: MediaRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Media
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['media_details', 'tracklist_details'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['media_details'])]
    private ?int $tmdbID = null;

    #[ORM\Column(nullable: true)]
    private ?int $malID = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['media_details'])]
    private ?string $imdbID = null;

    #[ORM\Column(length: 255)]
    #[Groups(['media_details'])]
    private ?string $originalName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['media_details'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['media_details'])]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['media_details'])]
    #[Context(['datetime_format' => 'Y-m-d'])]
    private ?DateTimeInterface $firstAirDate = null;

    /**
     * @var Collection<int, TMDBGenre>
     */
    #[ORM\ManyToMany(targetEntity: TMDBGenre::class, inversedBy: 'media')]
    #[Groups(['media_details'])]
    private Collection $tmdbGenres;

    /**
     * @var Collection<int, Season>
     */
    #[ORM\OneToMany(targetEntity: Season::class, mappedBy: 'media', orphanRemoval: true)]
    #[Groups(['media_details'])]
    private Collection $seasons;

    /**
     * @var Collection<int, Tracklist>
     */
    #[ORM\OneToMany(targetEntity: Tracklist::class, mappedBy: 'media', orphanRemoval: true)]
    private Collection $tracklists;

    #[ORM\Column(enumType: MediaType::class)]
    #[Groups(['media_details', 'tracklist_details'])]
    private ?MediaType $type = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['media_details', 'tracklist_details'])]
    private ?string $posterPath = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['media_details'])]
    private ?string $backdropPath = null;

    #[ORM\Column(nullable: true)]
    private ?int $runtime = null;

    public function __construct()
    {
        $this->tmdbGenres = new ArrayCollection();
        $this->seasons = new ArrayCollection();
        $this->tracklists = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTmdbID(): ?int
    {
        return $this->tmdbID;
    }

    public function setTmdbID(?int $tmdbID): static
    {
        $this->tmdbID = $tmdbID;

        return $this;
    }

    public function getMalID(): ?int
    {
        return $this->malID;
    }

    public function setMalID(?int $malID): static
    {
        $this->malID = $malID;

        return $this;
    }

    public function getImdbID(): ?string
    {
        return $this->imdbID;
    }

    public function setImdbID(?string $imdbID): static
    {
        $this->imdbID = $imdbID;

        return $this;
    }

    public function getOriginalName(): ?string
    {
        return $this->originalName;
    }

    public function setOriginalName(string $originalName): static
    {
        $this->originalName = $originalName;

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getFirstAirDate(): ?DateTimeInterface
    {
        return $this->firstAirDate;
    }

    public function setFirstAirDate(?DateTimeInterface $firstAirDate): static
    {
        $this->firstAirDate = $firstAirDate;

        return $this;
    }

    /**
     * @return Collection<int, TMDBGenre>
     */
    public function getTmdbGenres(): Collection
    {
        return $this->tmdbGenres;
    }

    public function addTmdbGenre(TMDBGenre $tmdbGenre): static
    {
        if (!$this->tmdbGenres->contains($tmdbGenre))
        {
            $this->tmdbGenres->add($tmdbGenre);
        }

        return $this;
    }

    public function removeTmdbGenre(TMDBGenre $tmdbGenre): static
    {
        $this->tmdbGenres->removeElement($tmdbGenre);

        return $this;
    }

    /**
     * @return Collection<int, Season>
     */
    public function getSeasons(): Collection
    {
        return $this->seasons;
    }

    public function addSeason(Season $season): static
    {
        if (!$this->seasons->contains($season)) {
            $this->seasons->add($season);
            $season->setMedia($this);
        }

        return $this;
    }

    public function removeSeason(Season $season): static
    {
        if ($this->seasons->removeElement($season)) {
            // set the owning side to null (unless already changed)
            if ($season->getMedia() === $this) {
                $season->setMedia(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Tracklist>
     */
    public function getTracklists(): Collection
    {
        return $this->tracklists;
    }

    public function getType(): ?MediaType
    {
        return $this->type;
    }

    public function setType(MediaType $type): static
    {
        $this->type = $type;

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

    public function getBackdropPath(): ?string
    {
        return $this->backdropPath;
    }

    public function setBackdropPath(?string $backdropPath): static
    {
        $this->backdropPath = $backdropPath;

        return $this;
    }

    public function getRuntime(): ?int
    {
        return $this->runtime;
    }

    public function setRuntime(?int $runtime): static
    {
        $this->runtime = $runtime;

        return $this;
    }
}
