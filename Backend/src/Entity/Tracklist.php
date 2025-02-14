<?php declare(strict_types=1);

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Enum\TracklistStatus;
use App\Repository\TracklistRepository;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TracklistRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Tracklist
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['tracklist_details'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Media::class, inversedBy: 'tracklists')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Media $media = null;

    #[Groups(['tracklist_details'])]
    #[ORM\Column(nullable: true)]
    private ?int $rating = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'tracklists')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[Groups(['tracklist_details'])]
    #[ORM\Column(enumType: TracklistStatus::class)]
    private ?TracklistStatus $status = null;

    #[Groups(['tracklist_details'])]
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?DateTimeInterface $startDate = null;

    #[Groups(['tracklist_details'])]
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?DateTimeInterface $finishDate = null;

    #[Groups(['tracklist_details'])]
    #[ORM\Column(length: 255)]
    private ?string $tracklistName = null;

    /**
     * @var Collection<int, TracklistSeason>
     */
    #[ORM\OneToMany(targetEntity: TracklistSeason::class, mappedBy: 'tracklist', orphanRemoval: true)]
    private Collection $tracklistSeasons;

    public function __construct()
    {
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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
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

    public function getStatus(): ?TracklistStatus
    {
        return $this->status;
    }

    public function setStatus(TracklistStatus $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getStartDate(): ?DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(?DateTimeInterface $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getFinishDate(): ?DateTimeInterface
    {
        return $this->finishDate;
    }

    public function setFinishDate(?DateTimeInterface $finishDate): static
    {
        $this->finishDate = $finishDate;

        return $this;
    }

    public function getTracklistName(): ?string
    {
        return $this->tracklistName;
    }

    public function setTracklistName(string $tracklistName): static
    {
        $this->tracklistName = $tracklistName;

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
            $tracklistSeason->setTracklist($this);
        }

        return $this;
    }

    public function removeTracklistSeason(TracklistSeason $tracklistSeason): static
    {
        if ($this->tracklistSeasons->removeElement($tracklistSeason)) {
            // set the owning side to null (unless already changed)
            if ($tracklistSeason->getTracklist() === $this) {
                $tracklistSeason->setTracklist(null);
            }
        }

        return $this;
    }
}
