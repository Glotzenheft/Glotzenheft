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
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace App\Entity\Traits;

use DateTimeImmutable;
use DateTimeZone;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Attribute\Context;

trait TimestampsTrait
{
    #[ORM\Column]
    #[Groups(['media_details', 'tracklist_details', 'tracklist_episodes', 'tracklist_episode', 'timestamp'])]
    #[Context(['datetime_format' => 'Y-m-d H:i:s'])]
    protected ?DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['media_details', 'tracklist_details', 'tracklist_episodes', 'tracklist_episode', 'timestamp'])]
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
            $this->createdAt = $this->getCurrentTime();
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

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = $this->getCurrentTime();
    }

    /**
     * Erstellt ein DateTimeImmutable-Objekt mit der korrekten Zeitzone.
     */
    private function getCurrentTime(): DateTimeImmutable
    {
        return new DateTimeImmutable('now', new DateTimeZone('Europe/Berlin'));
    }
}