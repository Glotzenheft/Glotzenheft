<?php

declare(strict_types=1);

namespace App\Model\Request\TracklistEpisode;

use Symfony\Component\Validator\Constraints as Assert;

readonly class CreateBulkTracklistEpisodeRequestDto
{
    /**
     * @param array<CreateTracklistEpisodeRequestDto> $episodes
     */
    public function __construct(
        #[Assert\NotBlank(message: 'The episodes array cannot be empty.')]
        #[Assert\Count(min: 1, minMessage: 'You must provide at least one episode.')]
        #[Assert\Valid]
        #[Assert\Type('array')]
        public array $episodes = []
    ){}
}