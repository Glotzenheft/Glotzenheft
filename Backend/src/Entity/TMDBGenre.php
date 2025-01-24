<?php declare(strict_types=1);

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Repository\TMDBGenreRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TMDBGenreRepository::class)]
class TMDBGenre
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $tmdbGenreID = null;

    /**
     * @var Collection<int, Media>
     */
    #[ORM\ManyToMany(targetEntity: Media::class, inversedBy: 'tmdbGenres')]
    private Collection $media;

    #[ORM\Column(length: 255)]
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
    public function getMediaID(): Collection
    {
        return $this->media;
    }

    public function addMediaID(Media $mediaID): static
    {
        if (!$this->media->contains($mediaID))
        {
            $this->media->add($mediaID);
        }

        return $this;
    }

    public function removeMediaID(Media $mediaID): static
    {
        $this->media->removeElement($mediaID);

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
