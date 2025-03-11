<?php declare(strict_types=1);

namespace App\Entity\Traits;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Attribute\Context;

trait TimestampsTrait
{
    #[ORM\Column]
    #[Groups(['media_details', 'tracklist_details', 'tracklist_episodes', 'tracklist_episode'])]
    #[Context(['datetime_format' => 'Y-m-d H:i:s'])]
    protected ?DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['media_details', 'tracklist_details', 'tracklist_episodes', 'tracklist_episode'])]
    #[Context(['datetime_format' => 'Y-m-d H:i:s'])]
    protected ?DateTimeImmutable $updatedAt = null;

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        if ($this->createdAt === null)
        {
            $this->createdAt = new DateTimeImmutable();
        }
    }

    public function getUpdatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }
}