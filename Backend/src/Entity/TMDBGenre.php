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
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Repository\TMDBGenreRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TMDBGenreRepository::class)]
#[ORM\HasLifecycleCallbacks]
class TMDBGenre
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['media_details'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['media_details'])]
    private ?int $tmdbGenreID = null;

    /**
     * @var Collection<int, Media>
     */
    #[ORM\ManyToMany(targetEntity: Media::class, mappedBy: 'tmdbGenres')]
    private Collection $media;

    #[ORM\Column(length: 255)]
    #[Groups(['media_details'])]
    private ?string $name = null;

    public function __construct()
    {
        $this->media = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTmdbGenreID(): ?int
    {
        return $this->tmdbGenreID;
    }

    public function setTmdbGenreID(int $tmdbGenreID): static
    {
        $this->tmdbGenreID = $tmdbGenreID;

        return $this;
    }

    /**
     * @return Collection<int, Media>
     */
    public function getMedia(): Collection
    {
        return $this->media;
    }

    public function addMedia(Media $media): static
    {
        if (!$this->media->contains($media))
        {
            $this->media->add($media);
            $media->addTmdbGenre($this);
        }

        return $this;
    }

    public function removeMedia(Media $media): static
    {
        if ($this->media->removeElement($media))
        {
            $media->removeTmdbGenre($this);
        }

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
}
