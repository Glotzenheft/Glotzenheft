<?php declare(strict_types=1);

namespace App\Model\Request\TracklistTag;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

class DeleteTracklistTagDto
{
    public function __construct(
        #[SerializedName('tracklist_tag_id')]
        #[Assert\NotBlank(message: 'Query parameter "tracklist_tag_id" is required.')]
        #[Assert\Type('integer')]
        public ?int $tracklistTagId = null,

        #[SerializedName('tracklist_id')]
        #[Assert\NotBlank(message: 'Query parameter "tracklist_id" is required.')]
        #[Assert\Type('integer')]
        public ?int $tracklistId = null
    ) {}
}