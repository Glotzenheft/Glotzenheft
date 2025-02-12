<?php declare(strict_types=1);

namespace App\Tracklist;

use App\Entity\Tracklist;
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
        if (!$tracklist instanceof Tracklist || !$tracklist->getUser()->contains($user))
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

        $tracklist = new Tracklist();
        $tracklist
            ->setTracklistName($tracklistName)
            ->addUser($user)
            ->setStatus($tracklistStatus);
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
        $this->entityManager->flush();

        return [
            'tracklist' => $tracklist,
        ];
    }
}