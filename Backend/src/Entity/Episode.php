<?php declare(strict_types=1);

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Repository\EpisodeRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EpisodeRepository::class)]
class Episode
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $tmdbSeasonID = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $overview = null;

    #[ORM\Column]
    private ?int $episodeNumber = null;

    #[ORM\Column]
    private ?int $runtime = null;

    #[ORM\Column(length: 255)]
    private ?string $posterPath = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $airDate = null;

    #[ORM\OneToOne(mappedBy: 'episode', cascade: ['persist', 'remove'])]
    private ?TracklistEpisode $tracklistEpisode = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getEpisodeNumber(): ?int
    {
        return $this->episodeNumber;
    }

    public function setEpisodeNumber(int $episodeNumber): static
    {
        $this->episodeNumber = $episodeNumber;

        return $this;
    }

    public function getRuntime(): ?int
    {
        return $this->runtime;
    }

    public function setRuntime(int $runtime): static
    {
        $this->runtime = $runtime;

        return $this;
    }

    public function getPosterPath(): ?string
    {
        return $this->posterPath;
    }

    public function setPosterPath(string $posterPath): static
    {
        $this->posterPath = $posterPath;

        return $this;
    }

    public function getAirDate(): ?\DateTimeInterface
    {
        return $this->airDate;
    }

    public function setAirDate(?\DateTimeInterface $airDate): static
    {
        $this->airDate = $airDate;

        return $this;
    }

    public function getTracklistEpisode(): ?TracklistEpisode
    {
        return $this->tracklistEpisode;
    }

    public function setTracklistEpisode(TracklistEpisode $tracklistEpisode): static
    {
        // set the owning side of the relation if necessary
        if ($tracklistEpisode->getEpisode() !== $this) {
            $tracklistEpisode->setEpisode($this);
        }

        $this->tracklistEpisode = $tracklistEpisode;

        return $this;
    }
}
