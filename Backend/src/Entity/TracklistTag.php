<?php

declare(strict_types=1);

namespace App\Entity;

use App\Enum\TracklistTagType;
use App\Repository\TracklistTagRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TracklistTagRepository::class)]
class TracklistTag
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(enumType: TracklistTagType::class)]
    private ?TracklistTagType $tracklistTagType = null;

    #[ORM\Column(length: 255)]
    private ?string $tagName = null;

    #[ORM\Column(length: 7, nullable: true)]
    private ?string $color = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $icon = null;

    #[ORM\ManyToOne(inversedBy: 'tracklistTags')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Tracklist $tracklist = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $slug = null;

    #[ORM\Column]
    private ?bool $isSpoiler = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTracklistTagType(): ?TracklistTagType
    {
        return $this->tracklistTagType;
    }

    public function setTracklistTagType(TracklistTagType $tracklistTagType): static
    {
        $this->tracklistTagType = $tracklistTagType;

        return $this;
    }

    public function getTagName(): ?string
    {
        return $this->tagName;
    }

    public function setTagName(string $tagName): static
    {
        $this->tagName = $tagName;

        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): static
    {
        $this->color = $color;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getIcon(): ?string
    {
        return $this->icon;
    }

    public function setIcon(?string $icon): static
    {
        $this->icon = $icon;

        return $this;
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

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function isSpoiler(): ?bool
    {
        return $this->isSpoiler;
    }

    public function setIsSpoiler(bool $isSpoiler): static
    {
        $this->isSpoiler = $isSpoiler;

        return $this;
    }
}
