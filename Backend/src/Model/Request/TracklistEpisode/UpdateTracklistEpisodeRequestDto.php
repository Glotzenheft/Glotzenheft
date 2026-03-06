<?php

declare(strict_types=1);

namespace App\Model\Request\TracklistEpisode;

use DateTimeImmutable;
use Symfony\Component\Serializer\Annotation\Context;
use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;

readonly class UpdateTracklistEpisodeRequestDto
{
    public function __construct(
        #[Context([DateTimeNormalizer::FORMAT_KEY => 'Y-m-d H:i:s'])]
        #[SerializedName('watch_date_time')]
        public ?DateTimeImmutable $watchDateTime = null,
    ){}
}