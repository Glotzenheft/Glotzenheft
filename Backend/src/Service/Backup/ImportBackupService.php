<?php

declare(strict_types=1);

namespace App\Service\Backup;

use App\Entity\Episode;
use App\Entity\Media;
use App\Entity\Season;
use App\Entity\Tracklist;
use App\Entity\TracklistEpisode;
use App\Entity\TracklistSeason;
use App\Entity\User;
use App\Enum\MediaType;
use App\Enum\TracklistStatus;
use App\Model\Request\Media\MediaIdDto;
use App\Repository\TracklistEpisodeRepository;
use App\Repository\TracklistRepository;
use App\Repository\TracklistSeasonRepository;
use App\Service\Media\MediaService;
use App\TmdbApi\ApiException;
use DateTime;
use DateTimeImmutable;
use DateTimeInterface;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\RateLimiter\Storage\InMemoryStorage;

class ImportBackupService
{
    private bool $importStatus;
    public function __construct(
        private readonly EntityManagerInterface     $entityManager,
        private readonly TracklistRepository        $tracklistRepository,
        private readonly TracklistSeasonRepository  $tracklistSeasonRepository,
        private readonly TracklistEpisodeRepository $tracklistEpisodeRepository,
        private readonly MediaService               $mediaService,
        private readonly LoggerInterface            $logger,
    ){}

    /**
     * @param array{tracklists?: array} $backupData
     * @param User $user
     * @return bool
     */
    public function processImport(
        array $backupData,
        User $user
    ): bool
    {
        $limiter = (new RateLimiterFactory([
            'id' => 'tmdb_api',
            'policy' => 'token_bucket',
            'limit' => 40,
            'rate' => ['interval' => '5 seconds'],
        ], new InMemoryStorage()))->create();

        $this->importStatus = true;
        foreach ($backupData['tracklists'] ?? [] as $tracklistData)
        {
            if (!$this->checkTracklistData($tracklistData))
                continue;

            try
            {
                $media = $this->mediaService->findOrCreateMedia(new MediaIdDto(
                    tmdbId: $tracklistData['tmdbId'],
                    mediaType: $tracklistData['mediaType']
                ));

                if (!$this->hasMediaLatestData($media))
                {
                    $limiter->consume()->wait();
                    match ($media->getType())
                    {
                        MediaType::Movie => $media = $this->mediaService->updateMovieFromTmdb($media, 'de-DE'),
                        MediaType::TV => $media = $this->mediaService->updateTvSeriesFromTmdb($media, 'de-DE'),
                    };
                }

                $tracklistEntity = $this->findOrCreateTracklist($tracklistData, $user, $media);

                $this->populateTracklistFromBackup($tracklistEntity, $tracklistData);
                $this->entityManager->persist($tracklistEntity);

                if ($media->getType() === MediaType::TV)
                {
                    $this->importSeasonsAndEpisodes($tracklistEntity, $tracklistData['seasons']);
                }
            }
            catch (ApiException $e)
            {
                $this->logger->error(
                    message: 'TMDB API exception while importing tracklists: ' . $tracklistData['tracklistName'],
                    context: [
                        'item' => $tracklistData,
                        'exception' => $e->getMessage()
                    ]
                );
                $this->importStatus = false;
            }
        }

        $this->entityManager->flush();
        return $this->importStatus;
    }

    /**
     * @param array $tracklistData
     * @param User $user
     * @param Media $media
     * @return Tracklist
     */
    private function findOrCreateTracklist(
        array $tracklistData,
        User $user,
        Media $media
    ): Tracklist
    {
        $hash = $tracklistData['hash'] ?? null;
        if ($hash)
        {
            $tracklist = $this->tracklistRepository->findOneBy([
                'backupHash' => $hash,
                'user' => $user]
            );
            if ($tracklist instanceof Tracklist)
            {
                return $tracklist;
            }
        }

        return (new Tracklist())->setUser($user)->setMedia($media);
    }

    /**
     * @param Tracklist $tracklistEntity
     * @param array $tracklistData
     * @return void
     */
    private function populateTracklistFromBackup(
        Tracklist $tracklistEntity,
        array $tracklistData
    ): void
    {
        if ($tracklistEntity->getId() !== null)
        {
            $lastUpdateTracklistEntity = $tracklistEntity->getUpdatedAt();
            if ($lastUpdateTracklistEntity !== null)
            {
                $lastUpdateTracklistData = DateTime::createFromFormat(
                    'Y-m-d H:i:s',
                    $tracklistData['updatedAt'] ?? ''
                );
                if ($lastUpdateTracklistData instanceof DateTimeInterface
                    && $lastUpdateTracklistEntity >= $lastUpdateTracklistData
                )
                {
                    return;
                }
            }
        }

        $startDate = DateTime::createFromFormat('Y-m-d', $tracklistData['startDate']);
        if (!$startDate instanceof DateTime)
        {
            $startDate = null;
        }

        $finishDate = DateTime::createFromFormat('Y-m-d', $tracklistData['finishDate']);
        if (!$finishDate instanceof DateTime)
        {
            $finishDate = null;
        }

        $tracklistEntity
            ->setBackupHash($tracklistData['hash'])
            ->setTracklistName($tracklistData['tracklistName'])
            ->setIsRewatching($tracklistData['isRewatching'])
            ->setStatus(TracklistStatus::tryFrom($tracklistData['status']))
            ->setRating($tracklistData['rating'])
            ->setStartDate($startDate)
            ->setFinishDate($finishDate);
    }

    /**
     * @param Tracklist $tracklist
     * @param array $seasonsData
     * @return void
     */
    private function importSeasonsAndEpisodes(
        Tracklist $tracklist,
        array $seasonsData
    ): void
    {
        foreach ($seasonsData as $seasonData)
        {
            try
            {
                $tracklistSeason = $this->findOrCreateTracklistSeason($tracklist, $seasonData);
                $this->entityManager->persist($tracklistSeason);

                foreach ($seasonData['episodes'] as $episodeData)
                {
                    try
                    {
                        $tracklistEpisode = $this->findOrCreateTracklistEpisode($tracklistSeason, $episodeData);
                        $this->populateTracklistEpisodeFromBackup(
                            episodeEntity: $tracklistEpisode,
                            episodeData: $episodeData
                        );
                        $this->entityManager->persist($tracklistEpisode);
                    }
                    catch (Exception $e)
                    {
                        $this->logger->error(
                            message: $e->getMessage(),
                            context: [
                                'item' => $seasonData,
                                'exception' => $e->getMessage()
                            ]
                        );
                        $this->importStatus = false;
                    }
                }
            }
            catch (Exception $e)
            {
                $this->logger->error(
                    message: $e->getMessage(),
                    context: [
                        'item' => $seasonData,
                        'exception' => $e->getMessage()
                    ]
                );
                $this->importStatus = false;
            }
        }
    }

    /**
     * @param Tracklist $tracklist
     * @param array $seasonData
     * @return TracklistSeason
     * @throws Exception
     */
    private function findOrCreateTracklistSeason(
        Tracklist $tracklist,
        array $seasonData
    ): TracklistSeason
    {
        $seasonHash = $seasonData['hash'] ?? null;
        if ($seasonHash)
        {
            $tracklistSeason = $this->tracklistSeasonRepository->findOneBy(['backupHash' => $seasonHash]);
            if ($tracklistSeason instanceof TracklistSeason) return $tracklistSeason;
        }

        $seasonNumber = $seasonData['seasonNumber'];
        foreach ($tracklist->getTracklistSeasons() as $existingSeason)
        {
            if ($existingSeason->getSeason()?->getSeasonNumber() === $seasonNumber)
            {
                return $existingSeason;
            }
        }

        $season = $tracklist
            ->getMedia()?->getSeasons()
            ->filter(fn(Season $s) => $s->getSeasonNumber() === $seasonNumber)->first();
        if (!$season instanceof Season)
        {
            $media = $tracklist->getMedia();
            if ($media instanceof Media)
            {
                throw new Exception('Could not find Season {$seasonNumber} for media "' . $media->getName()
                    . '", TMDB ID: ' . $media->getTmdbId()
                    . ', Type: ' . $media->getType()->value . '.'
                );
            }
            else
            {
                throw new Exception("Could not find Season {$seasonNumber} for media.");
            }

        }

        return (new TracklistSeason())
            ->setTracklist($tracklist)
            ->setSeason($season)
            ->setBackupHash($seasonHash);
    }

    /**
     * @param TracklistSeason $tracklistSeason
     * @param array $episodeData
     * @return TracklistEpisode
     * @throws Exception
     */
    private function findOrCreateTracklistEpisode(
        TracklistSeason $tracklistSeason,
        array $episodeData
    ): TracklistEpisode
    {
        $episodeHash = $episodeData['hash'] ?? null;
        if ($episodeHash)
        {
            $tracklistEpisode = $this->tracklistEpisodeRepository->findOneBy(['backupHash' => $episodeHash]);
            if ($tracklistEpisode instanceof TracklistEpisode) return $tracklistEpisode;
        }

        $episodeNumber = $episodeData['episodeNumber'] ?? -1;
        foreach ($tracklistSeason->getTracklistEpisodes() as $existingEpisode)
        {
            if ($existingEpisode->getEpisode()?->getEpisodeNumber() === $episodeNumber)
            {
                return $existingEpisode;
            }
        }

        $episode = $tracklistSeason
            ->getSeason()?->getEpisodes()
            ->filter(fn(Episode $e) => $e->getEpisodeNumber() === $episodeNumber)
            ->first();
        if (!$episode)
        {
            $media = $tracklistSeason->getSeason()?->getMedia();
            if ($media instanceof Media)
            {
                throw new Exception('Could not find Episode ' . $episodeNumber . ' for media "' . $media->getName()
                    . '", TMDB ID: ' . $media->getTmdbId()
                    . ', Type: ' . $media->getType()->value . '.'
                );
            }
            else
            {
                throw new Exception("Could not find episode $episodeNumber for season.");
            }
        }

        return (new TracklistEpisode())
            ->setTracklistSeason($tracklistSeason)
            ->setEpisode($episode)
            ->setBackupHash($episodeHash);
    }

    /**
     * @param TracklistEpisode $episodeEntity
     * @param array $episodeData
     * @return void
     */
    private function populateTracklistEpisodeFromBackup(
        TracklistEpisode $episodeEntity,
        array $episodeData
    ): void
    {
        if ($episodeEntity->getId() !== null)
        {
            $lastUpdateTracklistEpisodeEntity = $episodeEntity->getUpdatedAt();
            if ($lastUpdateTracklistEpisodeEntity !== null)
            {
                $lastUpdateTracklistEpsisodeData = DateTime::createFromFormat(
                    'Y-m-d H:i:s',
                    $episodeData['updatedAt'] ?? ''
                );
                if ($lastUpdateTracklistEpsisodeData instanceof DateTimeInterface
                    && $lastUpdateTracklistEpisodeEntity >= $lastUpdateTracklistEpsisodeData
                )
                {
                    return;
                }
            }
        }

        $watchDateTime = DateTime::createFromFormat('Y-m-d H:i:s', $episodeData['watchDate'] ?? '');
        if (!$watchDateTime instanceof DateTime)
        {
            $watchDateTime = null;
        }

        $episodeEntity->setWatchDate($watchDateTime);
    }

    /**
     * @param array $tracklist
     * @return bool
     */
    private function checkTracklistData(array $tracklist): bool
    {
        if (!isset($tracklist['tmdbId']) || !is_int($tracklist['tmdbId']))
            return false;

        if (!isset($tracklist['hash']) || !is_string($tracklist['hash']))
            return false;

        $mediaTypeEnum = MediaType::tryFrom($tracklist['mediaType'] ?? '');
        if ($mediaTypeEnum === null)
            return false;

        if (!isset($tracklist['status']) || TracklistStatus::tryFrom($tracklist['status']) === null)
            return false;

        if (!array_key_exists('rating', $tracklist))
            return false;

        if (!isset($tracklist['isRewatching']) || !is_bool($tracklist['isRewatching']))
            return false;

        if (!array_key_exists('startDate', $tracklist) || !array_key_exists('finishDate', $tracklist))
            return false;

        if (!array_key_exists('updatedAt', $tracklist) || !isset($tracklist['createdAt']) || !is_string($tracklist['createdAt']))
            return false;

        if ($mediaTypeEnum === MediaType::TV)
        {
            if (!isset($tracklist['seasons']) || !is_array($tracklist['seasons']))
                return false;

            foreach ($tracklist['seasons'] as $season)
            {
                if (!is_array($season))
                    return false;

                if (!isset($season['seasonNumber']) || !is_int($season['seasonNumber']))
                    return false;

                if (!isset($season['createdAt']) || !is_string($season['createdAt']))
                    return false;

                if (!isset($season['hash']) || !is_string($season['hash']))
                    return false;

                if (!isset($season['episodes']) || !is_array($season['episodes']))
                    return false;

                foreach ($season['episodes'] as $episode)
                {
                    if (!is_array($episode))
                        return false;

                    if (!isset($episode['episodeNumber']) || !is_int($episode['episodeNumber']) || $episode['episodeNumber'] <= 0)
                        return false;

                    if (!array_key_exists('watchDate', $episode))
                        return false;

                    if (!array_key_exists('updatedAt', $episode) || !isset($episode['createdAt']) || !is_string($episode['createdAt']))
                        return false;

                    if (!isset($episode['hash']) || !is_string($episode['hash']))
                        return false;
                }
            }
        }

        return true;
    }

    /**
     * @param Media $media
     * @return bool
     */
    private function hasMediaLatestData(Media $media): bool
    {
        $dateToCheck = $media->getUpdatedAt() ?? $media->getCreatedAt();

        if ($dateToCheck === null)
            return false;

        $fiveMinutesAgo = new DateTimeImmutable('now - 5 minutes');

        return $dateToCheck >= $fiveMinutesAgo;
    }
}