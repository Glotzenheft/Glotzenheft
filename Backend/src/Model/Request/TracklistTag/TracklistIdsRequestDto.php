<?php

declare(strict_types=1);

namespace App\Model\Request\TracklistTag;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class TracklistIdsRequestDto
{
    public function __construct(
        #[SerializedName('tracklist_ids')]
        #[Assert\NotBlank(message: 'Field "tracklist_ids" is required.')]
        #[Assert\All([new Assert\Type('integer')])]
        public ?array $tracklistIdsArray = null
    ) {}
}