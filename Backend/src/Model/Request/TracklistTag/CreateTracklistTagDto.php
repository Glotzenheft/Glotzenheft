<?php

declare(strict_types=1);

namespace App\Model\Request\TracklistTag;

use App\Enum\TracklistTagType;
use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

class CreateTracklistTagDto
{
    public function __construct(
        #[SerializedName('tag_name')]
        #[Assert\NotBlank(message: 'Field "tag_name" is required.')]
        #[Assert\Length(min: 1, max: 255)]
        public ?string $tagName = null,

        #[SerializedName('tracklist_tag_type')]
        #[Assert\NotBlank(message: 'Field "tracklist_tag_type" is required.')]
        #[Assert\Type(
            type: TracklistTagType::class,
            message: 'Invalid tracklist tag type.'
        )]
        public ?TracklistTagType $tracklistTagType = null,

        #[SerializedName('color')]
        #[Assert\Regex(
            pattern: '/^#[0-9A-Fa-f]{6}$/',
            message: 'Your color has to be a 7 length hexcode starting with "#".'
        )]
        public ?string $color = null,

        #[SerializedName('description')]
        #[Assert\Length(min: 1)]
        public ?string $description = null,

        #[SerializedName('icon')]
        #[Assert\Length(
            min: 2,
            max: 50,
            minMessage: 'Your icon class name is too short.',
            maxMessage: 'Your icon class name is too long.',
        )]
        public ?string $icon = null,

        #[SerializedName('tracklist_id')]
        #[Assert\NotBlank(message: 'Field "tracklist_id" is required.')]
        #[Assert\Type('integer')]
        public ?int $tracklistId = null,

        #[SerializedName('slug')]
        #[Assert\Length(min: 1, max: 255)]
        public ?string $slug = null,

        #[SerializedName('is_spoiler')]
        #[Assert\Type('boolean')]
        public ?bool $isSpoiler = false,
    ) {}
}