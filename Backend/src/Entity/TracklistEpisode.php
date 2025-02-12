<?php declare(strict_types=1);

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Repository\TracklistEpisodeRepository;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TracklistEpisodeRepository::class)]
#[ORM\HasLifecycleCallbacks]
class TracklistEpisode
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['tracklist_details'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'tracklistEpisodes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Tracklist $tracklist = null;

    #[ORM\OneToOne(inversedBy: 'tracklistEpisode', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['tracklist_details'])]
    private ?Episode $episode = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['tracklist_details'])]
    private ?DateTimeInterface $watchDate = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function setWatchDate(DateTimeInterface $watchDate): static
    {
        $this->watchDate = $watchDate;

        return $this;
    }
}
