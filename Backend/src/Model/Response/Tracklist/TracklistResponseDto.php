<?php

declare(strict_types=1);

namespace App\Model\Response\Tracklist;

use App\Model\Response\Media\MediaLightDetailResponseDto;
use App\Model\Response\Tracklist\TracklistSeason\TracklistSeasonDetailDataDto;
use App\Model\Response\TracklistTag\TracklistTagResponseDto;

readonly class TracklistResponseDto
{
    public function __construct(
        public int    $id,
        public string $tracklistName,
        public string $createdAt,
        public string $updatedAt,
        public string $status,
        public int    $rating,
        public bool   $isRewatching,
        public string $startDate,
        public string $finishDate,
        /**
         * @var TracklistSeasonDetailDataDto[]
         */
        public array  $tracklistSeasons,
        /**
         * @var TracklistTagResponseDto[]
         */
        public array  $tags,
        /**
         * @var MediaLightDetailResponseDto[]
         */
        public array  $media,
    ){}
}