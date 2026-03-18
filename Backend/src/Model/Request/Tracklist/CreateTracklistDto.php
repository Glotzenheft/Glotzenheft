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

namespace App\Model\Request\Tracklist;

use App\Enum\TracklistStatus;
use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

#[Assert\Callback(callback: 'checkSeasonId')]
readonly class CreateTracklistDto
{
    public function __construct(
        #[SerializedName('tracklist_name')]
        #[Assert\NotBlank(message: 'Field "tracklist_name" is required.')]
        #[Assert\Length(min: 1, max: 255)]
        public ?string $tracklistName = null,

        #[SerializedName('tracklist_status')]
        #[Assert\NotBlank(message: 'Field "tracklist_status" is required.')]
        #[Assert\Type(
            type: TracklistStatus::class,
            message: 'Invalid tracklist status.'
        )]
        public ?TracklistStatus $tracklistStatus = null,

        #[SerializedName('is_rewatching')]
        #[Assert\Type('boolean')]
        public bool $isRewatching = false,

        #[SerializedName('media_id')]
        #[Assert\NotBlank(message: 'Field "media_id" is required.')]
        #[Assert\Type('integer')]
        public ?int $mediaId = null,

        #[SerializedName('media_type')]
        #[Assert\NotBlank(message: 'Field "media_type" is required.')]
        #[Assert\Choice(
            choices: ['movie', 'tv'],
            message: 'Media type must be either "movie" or "tv".'
        )]
        public ?string $mediaType = null,

        #[SerializedName('tracklist_rating')]
        #[Assert\Range(
            notInRangeMessage: 'The rating must be between 1 and 10.',
            min: 1,
            max: 10
        )]
        #[Assert\Type('integer')]
        public ?int $rating = null,

        #[SerializedName('tracklist_start_date')]
        #[Assert\DateTime(
            format: 'Y-m-d H:i:s',
            message: 'The start date must be a valid date in Y-m-d H:i:s format or null.'
        )]
        public ?string $startDate = null,

        #[SerializedName('tracklist_finish_date')]
        #[Assert\DateTime(
            format: 'Y-m-d H:i:s',
            message: 'The finish date must be a valid date in Y-m-d H:i:s format or null.'
        )]
        public ?string $finishDate = null,

        #[SerializedName('season_id')]
        #[Assert\Type('integer')]
        public ?int $seasonId = null,

        #[Assert\Type('string')]
        public ?string $comment = null,

        #[SerializedName('custom_air_date')]
        #[Assert\Date(message: 'The custom air date must be a valid date in Y-m-d format or null.')]
        public ?string $customAirDate = null,

        #[Assert\Language]
        public ?string $language = null,

        #[SerializedName('subtitle')]
        #[Assert\Language]
        public ?string $subtitle = null,

        #[SerializedName('custom_poster_path')]
        #[Assert\Type('string')]
        public ?string $customPosterPath = null,

        #[SerializedName('start_episode_number')]
        #[Assert\Type('integer')]
        public ?int $startEpisodeNumber = null,

        #[SerializedName('end_episode_number')]
        #[Assert\Type('integer')]
        public ?int $endEpisodeNumber = null,

        #[SerializedName('custom_season_number')]
        #[Assert\Type('integer')]
        public ?int $customSeasonNumber = null,

        #[SerializedName('custom_part_number')]
        #[Assert\Type('integer')]
        public ?int $customPartNumber = null,
    ) {}

    public function checkSeasonId(ExecutionContextInterface $context): void
    {
        if ($this->mediaType === 'tv' && $this->seasonId === null)
        {
            $context
                ->buildViolation(
                    'The "season_id" field is required when the media type is "tv".'
                )
                ->atPath('seasonId')
                ->addViolation();
        }
    }
}