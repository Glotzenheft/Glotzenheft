<?php

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Repository\TracklistSeasonRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TracklistSeasonRepository::class)]
#[ORM\HasLifecycleCallbacks]
class TracklistSeason
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['tracklist_details'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'tracklistSeasons')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Tracklist $tracklist = null;

    /**
     * @var Collection<int, TracklistEpisode>
     */
    #[ORM\OneToMany(targetEntity: TracklistEpisode::class, mappedBy: 'TracklistSeason', orphanRemoval: true)]
    #[Groups(['tracklist_details'])]
    private Collection $tracklistEpisodes;

    #[ORM\ManyToOne(inversedBy: 'tracklistSeasons')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['tracklist_details', 'tracklist_episodes'])]
    private ?Season $season = null;

    public function __construct()
    {
        $this->tracklistEpisodes = new ArrayCollection();
    }

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
            $tracklistEpisode->setTracklistSeason($this);
        }

        return $this;
    }

    public function removeTracklistEpisode(TracklistEpisode $tracklistEpisode): static
    {
        if ($this->tracklistEpisodes->removeElement($tracklistEpisode)) {
            // set the owning side to null (unless already changed)
            if ($tracklistEpisode->getTracklistSeason() === $this) {
                $tracklistEpisode->setTracklistSeason(null);
            }
        }

        return $this;
    }

    public function getSeason(): ?Season
    {
        return $this->season;
    }

    public function setSeason(?Season $season): static
    {
        $this->season = $season;

        return $this;
    }
}
