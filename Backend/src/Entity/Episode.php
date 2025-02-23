<?php declare(strict_types=1);

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Repository\EpisodeRepository;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Attribute\Context;

#[ORM\Entity(repositoryClass: EpisodeRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Episode
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['media_details', 'tracklist_details', 'tracklist_episodes', 'tracklist_episode'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['media_details'])]
    private ?int $tmdbEpisodeID = null;

    #[ORM\Column(length: 255)]
    #[Groups(['media_details', 'tracklist_episodes'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['media_details'])]
    private ?string $overview = null;

    #[ORM\Column]
    #[Groups(['media_details', 'tracklist_details', 'tracklist_episodes', 'tracklist_episode'])]
    private ?int $episodeNumber = null;

    #[ORM\Column]
    #[Groups(['media_details', 'tracklist_episodes'])]
    private ?int $runtime = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['media_details', 'tracklist_episodes'])]
    #[Context(['datetime_format' => 'Y-m-d'])]
    private ?DateTimeInterface $airDate = null;

    #[ORM\OneToMany(targetEntity: TracklistEpisode::class, mappedBy: 'episode', cascade: ['persist'], orphanRemoval: true)]
    private Collection $tracklistEpisodes;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['media_details', 'tracklist_episodes'])]
    private ?string $stillPath = null;

    #[ORM\ManyToOne(inversedBy: 'episodes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Season $Season = null;

    public function __construct()
    {
        $this->tracklistEpisodes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTmdbEpisodeID(): ?int
    {
        return $this->tmdbEpisodeID;
    }

    public function setTmdbEpisodeID(int $tmdbEpisodeID): static
    {
        $this->tmdbEpisodeID = $tmdbEpisodeID;

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

    public function getAirDate(): ?DateTimeInterface
    {
        return $this->airDate;
    }

    public function setAirDate(?DateTimeInterface $airDate): static
    {
        $this->airDate = $airDate;

        return $this;
    }

    /**
     * @return Collection<int, TracklistEpisode>
     */
    public function getTracklistEpisodes(): Collection
    {
        return $this->tracklistEpisodes;
    }

    public function addTracklistEpisode(TracklistEpisode $tracklistEpisode): static
    {
        if (!$this->tracklistEpisodes->contains($tracklistEpisode))
        {
            $this->tracklistEpisodes->add($tracklistEpisode);
            $tracklistEpisode->setEpisode($this);
        }

        return $this;
    }

    public function removeTracklistEpisode(TracklistEpisode $tracklistEpisode): static
    {
        $this->tracklistEpisodes->removeElement($tracklistEpisode);

        return $this;
    }

    public function getStillPath(): ?string
    {
        return $this->stillPath;
    }

    public function setStillPath(?string $stillPath): static
    {
        $this->stillPath = $stillPath;

        return $this;
    }

    public function getSeason(): ?Season
    {
        return $this->Season;
    }

    public function setSeason(?Season $Season): static
    {
        $this->Season = $Season;

        return $this;
    }
}
