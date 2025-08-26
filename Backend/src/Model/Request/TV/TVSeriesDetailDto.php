<?php declare(strict_types=1);

namespace App\Model\Request\TV;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

class TVSeriesDetailDto
{
    public function __construct(
        #[SerializedName('media_id')]
        #[Assert\NotBlank(
            message: 'Parameter "media_id" is required.'
        )]
        #[Assert\Range(
            minMessage: 'Parameter "media_id" must be at least 1.',
            min: 1
        )]
        public ?int $mediaId = null,
        public string $language = 'de-DE',
        #[SerializedName('append_to_response')]
        public ?string $appendToResponse = null,
    ){}
}