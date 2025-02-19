<?php declare(strict_types=1);

namespace App\Service\Tracklist;

use App\Entity\Episode;
use App\Entity\Tracklist;
use App\Entity\TracklistEpisode;
use App\Entity\TracklistSeason;
use App\Entity\User;
use App\Service\RequestTrait;
use DateMalformedStringException;
use DateTime;
use Symfony\Component\HttpFoundation\Request;

class TracklistEpisodeService
{
    use RequestTrait;

    /**
     * @param Request $request
     * @return TracklistEpisode[]
     */
    public function createTracklistEpisode(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        if (!isset($this->data['tracklist_id'], $this->data['tracklist_season_id'], $this->data['episode_id'], $this->data['watch_date'], $this->data['user_id']))
        {
            return $this->returnInvalidRequest();
        }

        $user = $this->entityManager->getRepository(User::class)->find($this->data['user_id']);
        if (!$user instanceof User)
        {
            return $this->returnUserNotFound();
        }

        $tracklist = $this->entityManager->getRepository(Tracklist::class)->find($this->data['tracklist_id']);
        if (!$tracklist instanceof Tracklist)
        {
            return $this->returnTracklistNotFound();
        }

        if ($user !== $tracklist->getUser())
        {
            return $this->returnUserNotAuthorized();
        }

        $tracklistSeason = $this->entityManager->getRepository(TracklistSeason::class)->find($this->data['tracklist_season_id']);
        if (!$tracklistSeason instanceof TracklistSeason)
        {
            return $this->returnTracklistSeasonNotFound();
        }

        if ($tracklistSeason->getTracklist() !== $tracklist)
        {
            return $this->returnWrongTracklistTracklistSeason();
        }

        $episode = $this->entityManager->getRepository(Episode::class)->find($this->data['episode_id']);
        if (!$episode instanceof Episode)
        {
            return $this->returnEpisodeNotFound();
        }

        $season = $tracklistSeason->getSeason();
        if ($episode->getSeason() !== $season)
        {
            return $this->returnWrongSeasonEpisode();
        }

        $existingEntity = $this->entityManager->getRepository(TracklistEpisode::class)->findOneBy([
            'tracklistSeason' => $tracklistSeason,
            'episode' => $episode,
        ]);

        if ($existingEntity instanceof TracklistEpisode)
        {
            return $this->returnTracklistEpisodeAlreadyExistsError();
        }

        try
        {
            $watchDate = new DateTime($this->data['watch_date']);
        }
        catch (DateMalformedStringException $e)
        {
            return $this->returnWatchDateError();
        }


        $tracklistEpisode = new TracklistEpisode();
        $tracklistEpisode
            ->setTracklistSeason($tracklistSeason)
            ->setEpisode($episode)
            ->setWatchDate($watchDate)
        ;

        $this->entityManager->persist($tracklistEpisode);
        $this->entityManager->flush();

        return [
            'tracklist_episode' => $tracklistEpisode
        ];
    }
}