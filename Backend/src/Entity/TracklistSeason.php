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
    #[Groups(['tracklist_details', 'tracklist_episode'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'tracklistSeasons')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Tracklist $tracklist = null;

    /**
     * @var Collection<int, TracklistEpisode>
     */
    #[ORM\OneToMany(targetEntity: TracklistEpisode::class, mappedBy: 'tracklistSeason', cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['tracklist_details'])]
    private Collection $tracklistEpisodes;

    #[ORM\ManyToOne(inversedBy: 'tracklistSeasons')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['tracklist_details', 'tracklist_episode'])]
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
