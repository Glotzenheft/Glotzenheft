<?php declare(strict_types=1);

namespace App\Service\TMDB\Movies;

use App\Entity\Media;
use App\Enum\MediaType;
use App\Model\Request\Movie\MovieDetailDto;
use App\Service\Media\AbstractMediaDetailService;
use App\TmdbApi\ApiException;

class MovieDetailService extends AbstractMediaDetailService
{
    /**
     * @param MovieDetailDto $dto
     * @param int|null $userId
     * @return array{media: Media, tracklists: array}|array{error: string, code: int}
     * @throws ApiException
     */
    public function getMovieDetails(
        MovieDetailDto $dto,
        ?int $userId
    ): array
    {
        return $this->getDetails(
            dto: $dto,
            userId: $userId
        );
    }

    /**
     * @return MediaType
     */
    protected function getMediaType(): MediaType
    {
        return MediaType::Movie;
    }
}