<?php declare(strict_types=1);

namespace App\Model\Request\Media;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class MediaIdDto
{
    public function __construct(
        #[SerializedName('tmdb_id')]
        #[Assert\NotBlank(
            message: 'Tmdb Id parameter "tmdb_id" is required.'
        )]
        public ?int $tmdbId = null,
        #[SerializedName('media_type')]
        #[Assert\NotBlank(
            message: 'Media type parameter "media_type" is required.'
        )]
        #[Assert\Choice(
            choices: ['movie', 'tv'],
            message: 'Media type must be either "movie" or "tv".'
        )]
        public ?string $mediaType = null,
        public ?string $language = 'de-DE',
    ){}
}