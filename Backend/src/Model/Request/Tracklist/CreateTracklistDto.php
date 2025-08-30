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
        #[Assert\NotBlank(message: 'Parameter "tracklist_name" is required.')]
        #[Assert\Length(min: 1, max: 255)]
        public ?string $tracklistName = null,

        #[SerializedName('tracklist_status')]
        #[Assert\NotBlank(message: 'Parameter "tracklist_status" is required.')]
        #[Assert\Type(
            type: TracklistStatus::class,
            message: 'Invalid tracklist status.'
        )]
        public ?TracklistStatus $tracklistStatus = null,

        #[SerializedName('is_rewatching')]
        #[Assert\Type('boolean')]
        public bool $isRewatching = false,

        #[SerializedName('media_id')]
        #[Assert\NotBlank(message: 'Parameter "media_id" is required.')]
        #[Assert\Type('integer')]
        public ?int $mediaId = null,

        #[SerializedName('media_type')]
        #[Assert\NotBlank(message: 'Parameter "media_type" is required.')]
        #[Assert\Choice(
            choices: ['movie', 'tv'],
            message: 'Media type must be either "movie" or "tv".'
        )]
        public ?string $mediaType = null,

        #[SerializedName('tracklist_rating')]
        #[Assert\Range(
            notInRangeMessage: 'Rating must be between 1 and 10.',
            min: 1,
            max: 10
        )]
        #[Assert\Type('integer')]
        public ?int $rating = null,

        #[SerializedName('tracklist_start_date')]
        #[Assert\Date(message: 'Start date must be a valid date in Y-m-d format.')]
        public ?string $startDate = null,

        #[SerializedName('tracklist_finish_date')]
        #[Assert\Date(message: 'Finish date must be a valid date in Y-m-d format.')]
        public ?string $finishDate = null,

        #[SerializedName('season_id')]
        #[Assert\Type('integer')]
        public ?int $seasonId = null
    ) {}

    public function checkSeasonId(ExecutionContextInterface $context): void
    {
        if ($this->mediaType === 'tv' && $this->seasonId === null)
        {
            $context
                ->buildViolation(
                    'The query parameter "season_id" is required when the media type is "tv".'
                )
                ->atPath('seasonId')
                ->addViolation();
        }
    }
}