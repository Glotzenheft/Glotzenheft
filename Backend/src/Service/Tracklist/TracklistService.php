<?php declare(strict_types=1);

namespace App\Service\Tracklist;

use App\Entity\Media;
use App\Entity\Season;
use App\Entity\Tracklist;
use App\Entity\TracklistSeason;
use App\Entity\User;
use App\Enum\TracklistStatus;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use ValueError;

readonly class TracklistService
{
    public function __construct
    (
        private EntityManagerInterface $entityManager
    )
    {
    }

    public function getUserTracklist(array $tracklistData): array
    {
        $user = $this->entityManager->getRepository(User::class)->find($tracklistData['userID']);
        if (!$user instanceof User)
        {
            return [
                'error' => 'User not found',
                'code' => 404
            ];
        }

        $tracklists = $user->getTracklists();

        return [
            'tracklists' => $tracklists->toArray()
        ];
    }
    /**
     * Get tracklist entity based on its id.
     * Only returns the tracklist, if the request is from the creator of the tracklist.
     * @param array $tracklistData
     * @return array
     */
    public function getTracklist(array $tracklistData): array
    {
        $userID = $tracklistData['userID'];
        $user = $this->entityManager->getRepository(User::class)->find($userID);
        if (!$user instanceof User)
        {
            return [
                'error' => 'User not found',
                'code' => 404,
            ];
        }

        $tracklistID = $tracklistData['tracklistID'];
        $tracklist = $this->entityManager->getRepository(Tracklist::class)->find($tracklistID);
        if (!$tracklist instanceof Tracklist || !$tracklist->getUser() === $user)
        {
            return [
                'error' => 'Tracklist not found',
                'code' => 404,
            ];
        }

        return [
            'tracklist' => $tracklist,
        ];
    }

    /**
     * Creates a new tracklist for an existing user.
     * Returns the tracklist entity.
     * @param array $tracklistData
     * @return array
     */
    public function createTracklist(array $tracklistData): array
    {
        $tracklistName = $tracklistData['tracklistName'];
        try
        {
            $tracklistStatus = TracklistStatus::from($tracklistData['tracklistStatus']);
        }
        catch
        (ValueError $e)
        {
            return[
                'error' => 'Invalid tracklist status',
                'code'  => 400
            ];
        }

        $userID = $tracklistData['userID'];
        $user = $this->entityManager->getRepository(User::class)->find($userID);
        if (!$user instanceof User)
        {
            return [
                'error' => 'User not found',
                'code' => 404,
            ];
        }

        $media = $this->entityManager->getRepository(Media::class)->find($tracklistData['mediaID']);
        if (!$media instanceof Media)
        {
            return [
                'error' => 'Media not found',
                'code' => 404,
            ];
        }

        $tracklist = new Tracklist();
        $tracklist
            ->setTracklistName($tracklistName)
            ->setUser($user)
            ->setStatus($tracklistStatus)
            ->setMedia($media)
        ;

        if (isset($tracklistData['tracklistRating']))
        {
            $tracklist->setRating($tracklistData['tracklistRating']);
        }

        if (isset($tracklistData['tracklistStartDate']))
        {
            $startDate = DateTime::createFromFormat('Y-m-d', $tracklistData['tracklistStartDate']);
            $tracklist->setStartDate($startDate);
        }

        if (isset($tracklistData['tracklistFinishDate']))
        {
            $finishDate = DateTime::createFromFormat('Y-m-d', $tracklistData['tracklistFinishDate']);
            $tracklist->setFinishDate($finishDate);
        }

        $this->entityManager->persist($tracklist);

        if ($tracklistData['mediaType'] === 'tv')
        {
            $season = $this->entityManager->getRepository(Season::class)->find($tracklistData['seasonID']);
            if (!$season instanceof Season)
            {
                return [
                    'error' => 'Season not found',
                    'code' => 404,
                ];
            }

            $tracklistSeason = new TracklistSeason();
            $tracklistSeason
                ->setSeason($season)
                ->setTracklist($tracklist)
            ;
            $this->entityManager->persist($tracklistSeason);
        }
        $this->entityManager->flush();

        return [
            'tracklist' => $tracklist,
        ];
    }
}