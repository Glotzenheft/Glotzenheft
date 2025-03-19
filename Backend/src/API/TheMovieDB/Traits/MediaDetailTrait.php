<?php declare(strict_types=1);

namespace App\API\TheMovieDB\Traits;

use App\API\TheMovieDB\Movies\Details\TMDBMovieDetailsService;
use App\API\TheMovieDB\TVSeries\Details\TMDBTVSeriesDetailsService;
use App\API\TheMovieDB\TVSeries\SeasonDetails\TMDBTVSeasonDetailsService;
use App\Entity\Media;
use App\Entity\TMDBGenre;
use App\Entity\User;
use App\Enum\MediaType;
use App\Repository\TracklistRepository;
use App\Service\Tracklist\TracklistService;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

trait MediaDetailTrait
{
    public function __construct
    (
        private readonly TMDBTVSeriesDetailsService $tvService,
        private readonly TMDBMovieDetailsService $movieService,
        private readonly TMDBTVSeasonDetailsService $seasonService,
        private readonly LoggerInterface $logger,
        private readonly EntityManagerInterface $entityManager,
        private readonly TracklistService $tracklistService,
        private readonly TracklistRepository $tracklistRepository,
        private readonly NormalizerInterface $normalizer,
    )
    {
    }

    /**
     * @param array $requestData
     * @param MediaType $type
     * @param string $language
     * @return array{error: string, code: int} | array{media: Media}
     */
    public function handleTMDBMediaDetail(array $requestData, MediaType $type, string $language = 'de-DE'): array
    {
        if (isset($requestData['mediaID']))
        {
            $mediaID = $requestData['mediaID'];
            $media = $this->entityManager->getRepository(Media::class)->find($mediaID);
            if (!$media instanceof Media || $media->getType() !== $type)
            {
                return [
                    'error' => 'Media not found',
                    'code' => 404,
                ];
            }
            $tmdbID = $media->getTMDBId();
        }
        else
        {
            $tmdbID = $requestData['tmdbID'];
            $media = $this->entityManager->getRepository(Media::class)->findOneBy([
                'tmdbID' => $tmdbID,
                'type' => $type,
            ]);

            if (!$media instanceof Media)
            {
                $media = new Media();
            }
        }

        $lastUpdate = $media->getUpdatedAt();
        $now = new DateTimeImmutable();

        /**
         * Only fetch media details from tmdb if last update is not within the last 5 minutes.
         */
        if (!$lastUpdate instanceof DateTimeImmutable || $now->getTimestamp() - $lastUpdate->getTimestamp() > 300)
        {
            $numberOfSeasons = 0;
            $firstAirDate = false;
            $seasons = null;
            switch ($type)
            {
                case MediaType::TV:
                    $result = $this->tvService->getTVSeriesDetails($tmdbID, $language);
                    if (isset($result['error']))
                    {
                        return $result;
                    }
                    $firstAirDate = DateTime::createFromFormat('Y-m-d', $result['first_air_date']);
                    $name = $result['name'] ?? null;
                    $originalName = $result['original_name'] ?? null;
                    $numberOfSeasons = $result['number_of_seasons'] ?? null;
                    $seasons = $result['seasons'] ?? null;
                    break;
                case MediaType::Movie:
                    $result = $this->movieService->getMovieDetails($tmdbID, $language);
                    if (isset($result['error']))
                    {
                        return $result;
                    }
                    $firstAirDate = DateTime::createFromFormat('Y-m-d', $result['release_date']);
                    $name = $result['title'] ?? null;
                    $originalName = $result['original_title'] ?? null;
                    break;
                case MediaType::ANIME:
                    return [
                        'error' => 'Not supported media type',
                        'code' => 404,
                    ];
            }

            $genreArray = $result['genres'] ?? null;

            $media
                ->setName($name ?? '')
                ->setOriginalName($originalName ?? '')
                ->setDescription($result['overview'] ?? '')
                ->setFirstAirDate($firstAirDate ?: null)
                ->setImdbID($result['external_ids']['imdb_id'] ?? null)
                ->setPosterPath($result['poster_path'] ?? null)
                ->setBackdropPath($result['backdrop_path'] ?? null)
                ->setType($type)
                ->setTmdbID($tmdbID)
                ->setRuntime($result['runtime'] ?? null)
                ->setUpdatedAt(new DateTimeImmutable())
            ;

            foreach ($genreArray as $genre)
            {
                $id = $genre['id'];
                $tmdbGenre = $this->entityManager->getRepository(TMDBGenre::class)->findOneBy(['tmdbGenreID' => $id]);
                if (!$tmdbGenre instanceof TMDBGenre) continue;

                $media->addTmdbGenre($tmdbGenre);
            }

            $this->entityManager->persist($media);

            if ($type === MediaType::TV && $numberOfSeasons > 0 && $seasons !== null)
            {
                foreach ($seasons as $season)
                {
                    $seasonNumber = $season['season_number'] ?? null;
                    if ($seasonNumber === null) continue;

                    $this->seasonService->handleSeasonDetails($tmdbID, $seasonNumber, $media, $language);
                }
            }

            $this->entityManager->flush();
        }

        $tracklists = [];
        if (isset($requestData['user_id']))
        {
            $user = $this->entityManager->getRepository(User::class)->find($requestData['user_id']);
            if (!$user instanceof User)
            {
                return [
                    'error' => 'User not found',
                    'code' => 404,
                ];
            }
            $tracklists = $this->tracklistRepository->findByUserAndMediaWithSeasonsAndEpisodes($user, $media);
        }

        return [
            'media' => $media,
            'tracklists' => $tracklists,
        ];
    }

    /**
     * @param Request $request
     * @return array{mediaID: int|null, tmdbID: int|null}
     */
    private function handleRequest(Request $request): array
    {
        $mediaID = $request->query->get('media_id') ?: null;
        $mediaID = $mediaID !== null ? (int) $mediaID : null;
        $tmdbID = $request->query->get('tmdb_id') ?: null;
        $tmdbID = $tmdbID !== null ? (int) $tmdbID : null;
        $userID = $request->attributes->get('user_id') ?: null;

        if (!isset($mediaID) && !isset($tmdbID))
        {
            return [
                'error' => 'Atleast one query parameter ("media_id" or "tmdb_id") is required.',
                'code' => 400
            ];
        }

        return [
            'mediaID' => $mediaID,
            'tmdbID' => $tmdbID,
            'user_id' => $userID,
        ];
    }

    public function searchMediaID(array $data): array
    {
        $tmdbID = $data['tmdb_id'];
        $type = MediaType::tryFrom($data['media_type']);
        $media = $this->entityManager->getRepository(Media::class)->findOneBy([
            'tmdbID' => $tmdbID,
        ]);

        if (!$media instanceof Media)
        {
            $data = ['tmdbID' => $tmdbID];
            $media = $this->handleTMDBMediaDetail($data, $type);
            if (isset($result['error']))
            {
                return $result;
            }
            $media = $media['media'];
        }
        elseif ($media->getType() !== $type)
        {
            return [
                'error' => 'Media ID not found.',
                'code' => 404,
            ];
        }

        return [
            'media_id' => $media->getId(),
        ];
    }
}