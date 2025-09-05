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

namespace App\Entity;

use App\Entity\Traits\TimestampsTrait;
use App\Enum\BackupStatus;
use App\Enum\BackupType;
use App\Repository\BackupRepository;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: BackupRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Backup
{
    use TimestampsTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['backup_details'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'backups')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(enumType: BackupType::class)]
    #[Groups(['backup_details'])]
    private ?BackupType $type = null;

    #[ORM\Column(enumType: BackupStatus::class)]
    #[Groups(['backup_details'])]
    private ?BackupStatus $status = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['backup_details'])]
    private ?string $filename = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['backup_details'])]
    private ?int $tracklistCount = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $contentHash = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['backup_details'])]
    private ?DateTimeInterface $completedAt = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getType(): ?BackupType
    {
        return $this->type;
    }

    public function setType(BackupType $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getStatus(): ?BackupStatus
    {
        return $this->status;
    }

    public function setStatus(BackupStatus $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(string $filename): static
    {
        $this->filename = $filename;

        return $this;
    }

    public function getTracklistCount(): ?int
    {
        return $this->tracklistCount;
    }

    public function setTracklistCount(?int $tracklistCount): static
    {
        $this->tracklistCount = $tracklistCount;

        return $this;
    }

    public function getContentHash(): ?string
    {
        return $this->contentHash;
    }

    public function setContentHash(?string $contentHash): static
    {
        $this->contentHash = $contentHash;

        return $this;
    }

    public function getCompletedAt(): ?DateTimeInterface
    {
        return $this->completedAt;
    }

    public function setCompletedAt(?DateTimeInterface $completedAt): static
    {
        $this->completedAt = $completedAt;

        return $this;
    }
}
