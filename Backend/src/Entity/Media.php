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

    #[ORM\Column(options: ['default' => 0])]
    private bool $adult = false;

    #[ORM\Column(nullable: true)]
    private ?int $numberOfEpisodes = null;

    #[ORM\Column(nullable: true)]
    private ?int $numberOfSeasons = null;

    #[ORM\Column(length: 10)]
    private ?string $originalLanguage = null;

    #[ORM\Column(options: ['default' => 0])]
    private float $popularity = 0.0;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $status = null;

    #[ORM\Column(options: ['default' => 0])]
    private float $voteAverage = 0.0;

    #[ORM\Column(options: ['default' => 0])]
    private int $voteCount = 0;

    #[ORM\Column(length: 2048, nullable: true)]
    private ?string $homepage = null;

    #[ORM\Column(nullable: true)]
    private ?int $tvdbId = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $wikidataId = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $facebookId = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $instagramId = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $twitterId = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $tagline = null;

    #[ORM\Column(type: Types::BIGINT, options: ['default' => 0])]
    private string $budget = '0';

    #[ORM\Column(type: Types::BIGINT, options: ['default' => 0])]
    private string $revenue = '0';

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

    public function isAdult(): bool
    {
        return $this->adult;
    }

    public function setAdult(bool $adult): static
    {
        $this->adult = $adult;

        return $this;
    }

    public function getNumberOfEpisodes(): ?int
    {
        return $this->numberOfEpisodes;
    }

    public function setNumberOfEpisodes(?int $numberOfEpisodes): static
    {
        $this->numberOfEpisodes = $numberOfEpisodes;

        return $this;
    }

    public function getNumberOfSeasons(): ?int
    {
        return $this->numberOfSeasons;
    }

    public function setNumberOfSeasons(?int $numberOfSeasons): static
    {
        $this->numberOfSeasons = $numberOfSeasons;

        return $this;
    }

    public function getOriginalLanguage(): ?string
    {
        return $this->originalLanguage;
    }

    public function setOriginalLanguage(string $originalLanguage): static
    {
        $this->originalLanguage = $originalLanguage;

        return $this;
    }

    public function getPopularity(): float
    {
        return $this->popularity;
    }

    public function setPopularity(float $popularity): static
    {
        $this->popularity = $popularity;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getVoteAverage(): float
    {
        return $this->voteAverage;
    }

    public function setVoteAverage(float $voteAverage): static
    {
        $this->voteAverage = $voteAverage;

        return $this;
    }

    public function getVoteCount(): int
    {
        return $this->voteCount;
    }

    public function setVoteCount(int $voteCount): static
    {
        $this->voteCount = $voteCount;

        return $this;
    }

    public function getHomepage(): ?string
    {
        return $this->homepage;
    }

    public function setHomepage(?string $homepage): static
    {
        $this->homepage = $homepage;

        return $this;
    }

    public function getTvdbId(): ?int
    {
        return $this->tvdbId;
    }

    public function setTvdbId(?int $tvdbId): static
    {
        $this->tvdbId = $tvdbId;

        return $this;
    }

    public function getWikidataId(): ?string
    {
        return $this->wikidataId;
    }

    public function setWikidataId(?string $wikidataId): static
    {
        $this->wikidataId = $wikidataId;

        return $this;
    }

    public function getFacebookId(): ?string
    {
        return $this->facebookId;
    }

    public function setFacebookId(?string $facebookId): static
    {
        $this->facebookId = $facebookId;

        return $this;
    }

    public function getInstagramId(): ?string
    {
        return $this->instagramId;
    }

    public function setInstagramId(?string $instagramId): static
    {
        $this->instagramId = $instagramId;

        return $this;
    }

    public function getTwitterId(): ?string
    {
        return $this->twitterId;
    }

    public function setTwitterId(?string $twitterId): static
    {
        $this->twitterId = $twitterId;

        return $this;
    }

    public function getTagline(): ?string
    {
        return $this->tagline;
    }

    public function setTagline(?string $tagline): static
    {
        $this->tagline = $tagline;

        return $this;
    }

    public function getBudget(): string
    {
        return $this->budget;
    }

    public function setBudget(string $budget): static
    {
        $this->budget = $budget;

        return $this;
    }

    public function getRevenue(): string
    {
        return $this->revenue;
    }

    public function setRevenue(string $revenue): static
    {
        $this->revenue = $revenue;

        return $this;
    }
}
