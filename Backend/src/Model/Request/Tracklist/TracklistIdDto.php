<?php

declare(strict_types=1);

namespace App\Model\Request\Tracklist;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class TracklistIdDto
{
    public function __construct(
        #[SerializedName('tracklist_id')]
        #[Assert\NotBlank(message: 'Query parameter "tracklist_id" is required.')]
        #[Assert\Type('integer')]
        public ?int $tracklistId = null
    ) {}
}