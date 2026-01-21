<?php

declare(strict_types=1);

namespace App\Model\Request\TracklistEpisode;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class CreateTracklistEpisodeDto
{
    public function __construct(
        #[Assert\Type('integer')]
        #[SerializedName('tracklist_id')]
        #[Assert\NotBlank(message: 'Field "tracklist_id" is required.')]
        public ?int $tracklistId = null,

        #[Assert\Type('integer')]
        #[SerializedName('tracklist_season_id')]
        #[Assert\NotBlank(message: 'Field "tracklist_season_id" is required.')]
        public ?int $tracklistSeasonId = null,

        #[Assert\Type('integer')]
        #[SerializedName('episode_id')]
        #[Assert\NotBlank(message: 'Field "episode_id" is required.')]
        public ?int $episodeId = null,

        #[SerializedName('watch_date_time')]
        #[Assert\DateTime(message: 'Field "watch_date_time" must be a valid date time in Y-m-d H:i:s format or null.')]
        public ?string $watchDateTime = null,
    ){}
}