<?php declare(strict_types=1);

namespace App\Model\Request\Media;

interface MediaDetailDtoInterface
{
    public function getMediaId(): ?int;
    public function getTmdbId(): ?int;
    public function getLanguage(): string;
}