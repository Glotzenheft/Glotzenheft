<?php declare(strict_types=1);

namespace App\Model\Request\Tracklist;

use App\Enum\TracklistStatus;
use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class UpdateTracklistDto
{
    public function __construct(
        #[SerializedName('tracklist_id')]
        #[Assert\NotBlank(message: 'Parameter "tracklist_id" is required.')]
        #[Assert\Type('integer')]
        public ?int $tracklistId = null,

        #[SerializedName('tracklist_name')]
        #[Assert\NotBlank(allowNull: true)]
        #[Assert\Length(
            min: 1,
            max: 255
        )]
        public ?string $tracklistName = null,

        #[SerializedName('tracklist_status')]
        #[Assert\Type(
            type: TracklistStatus::class,
            message: 'Invalid tracklist status.'
        )]
        public ?TracklistStatus $tracklistStatus = null,

        #[SerializedName('is_rewatching')]
        #[Assert\Type('boolean')]
        public ?bool $isRewatching = null,

        #[SerializedName('tracklist_rating')]
        #[Assert\Range(
            notInRangeMessage: 'Rating must be between 1 and 10 or null.',
            min: 1,
            max: 10
        )]
        #[Assert\Type('integer')]
        public ?int $rating = null,

        #[SerializedName('tracklist_start_date')]
        #[Assert\Date(message: 'Start date must be a valid date in Y-m-d format or null.')]
        public ?string $startDate = null,

        #[SerializedName('tracklist_finish_date')]
        #[Assert\Date(
            message: 'Finish date must be a valid date in Y-m-d format or null.'
        )]
        public ?string $finishDate = null
    ) {}
}