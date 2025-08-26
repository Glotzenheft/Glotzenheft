<?php declare(strict_types=1);

namespace App\Service\TMDB\TVSeries;

use App\Entity\Media;
use App\Enum\MediaType;
use App\Model\Request\TV\TVSeriesDetailDto;
use App\Service\Media\AbstractMediaDetailService;
use App\TmdbApi\ApiException;

class TVSeriesDetailService extends AbstractMediaDetailService
{
    /**
     * @param TVSeriesDetailDto $dto
     * @param int|null $userId
     * @return array{media: Media, tracklists: array}|array{error: string, code: int}
     * @throws ApiException
     */
    public function getTVSeriesDetails(
        TVSeriesDetailDto $dto,
        ?int $userId
    ): array
    {
        return $this->getDetails(
            dto: $dto,
            userId: $userId,
        );
    }

    /**
     * @return MediaType
     */
    protected function getMediaType(): MediaType
    {
        return MediaType::TV;
    }
}