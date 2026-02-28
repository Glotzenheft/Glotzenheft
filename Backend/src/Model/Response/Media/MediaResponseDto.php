<?php

declare(strict_types=1);

namespace App\Model\Response\Media;

use App\Model\Response\Media\Movie\MovieDetailDataDto;
use App\Model\Response\Media\Series\SeriesDetailDataDto;
use App\Model\Response\Tracklist\TracklistResponseDto;

readonly class MediaResponseDto
{

    public function __construct(
        /**
         * @var MovieDetailDataDto|SeriesDetailDataDto
         */
        public mixed $media,
        /**
         * @var TracklistResponseDto[]
         */
        public array $tracklists,
    ){}
}