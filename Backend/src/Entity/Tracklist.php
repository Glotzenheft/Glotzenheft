<?php declare(strict_types=1);

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Enum\TracklistStatus;
use App\Repository\TracklistRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TracklistRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Tracklist
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * @var Collection<int, Media>
     */
    #[ORM\ManyToMany(targetEntity: Media::class, inversedBy: 'tracklists')]
    private Collection $media;

    #[ORM\Column(nullable: true)]
    private ?int $rating = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'tracklists')]
    private Collection $user;

    /**
     * @var Collection<int, TracklistEpisode>
     */
    #[ORM\OneToMany(targetEntity: TracklistEpisode::class, mappedBy: 'tracklist', orphanRemoval: true)]
    private Collection $tracklistEpisodes;

    #[ORM\Column(enumType: TracklistStatus::class)]
    private ?TracklistStatus $status = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $finishDate = null;

    public function __construct()
    {
        $this->media = new ArrayCollection();
        $this->user = new ArrayCollection();
        $this->tracklistEpisodes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Media>
     */
    public function getMedia(): Collection
    {
        return $this->media;
    }

    public function addMedium(Media $medium): static
    {
        if (!$this->media->contains($medium)) {
            $this->media->add($medium);
        }

        return $this;
    }

    public function removeMedium(Media $medium): static
    {
        $this->media->removeElement($medium);

        return $this;
    }

    public function getRating(): ?int
    {
        return $this->rating;
    }

    public function setRating(?int $rating): static
    {
        $this->rating = $rating;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUser(): Collection
    {
        return $this->user;
    }

    public function addUser(User $user): static
    {
        if (!$this->user->contains($user)) {
            $this->user->add($user);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        $this->user->removeElement($user);

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
        if (!$this->tracklistEpisodes->contains($tracklistEpisode)) {
            $this->tracklistEpisodes->add($tracklistEpisode);
            $tracklistEpisode->setTracklist($this);
        }

        return $this;
    }

    public function removeTracklistEpisode(TracklistEpisode $tracklistEpisode): static
    {
        if ($this->tracklistEpisodes->removeElement($tracklistEpisode)) {
            // set the owning side to null (unless already changed)
            if ($tracklistEpisode->getTracklist() === $this) {
                $tracklistEpisode->setTracklist(null);
            }
        }

        return $this;
    }

    public function getStatus(): ?TracklistStatus
    {
        return $this->status;
    }

    public function setStatus(TracklistStatus $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(?\DateTimeInterface $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getFinishDate(): ?\DateTimeInterface
    {
        return $this->finishDate;
    }

    public function setFinishDate(?\DateTimeInterface $finishDate): static
    {
        $this->finishDate = $finishDate;

        return $this;
    }
}
