<?php
/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace App\Service\Tracklist;

use App\Entity\Episode;
use App\Entity\Tracklist;
use App\Entity\TracklistEpisode;
use App\Entity\TracklistSeason;
use App\Entity\User;
use App\Service\RequestTrait;
use DateMalformedStringException;
use DateTime;
use DateTimeImmutable;
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

        if (!isset($this->data['tracklist_id'], $this->data['tracklist_season_id'], $this->data['episode_id'], $this->data['user_id']))
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

        $watchDate = null;
        if (isset($this->data['watch_date']))
        {
            $watchDate = DateTime::createFromFormat('Y-m-d H:i:s', $this->data['watch_date']);
            if (!$watchDate instanceof DateTime)
            {
                $watchDate = null;
            }
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

    public function updateTracklistEpisode(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        $tracklistEpisode = $this->validateAndGetTracklistEpisode();
        if (is_array($tracklistEpisode))
        {
            return $tracklistEpisode;
        }

        $watchDate = null;
        if (isset($this->data['watch_date']))
        {
            try
            {
                $watchDate = new DateTime($this->data['watch_date']);
            }
            catch (DateMalformedStringException $e)
            {
                return $this->returnWatchDateError();
            }
        }

        $tracklistEpisode
            ->setWatchDate($watchDate)
            ->setUpdatedAt(new DateTimeImmutable())
        ;
        $this->entityManager->persist($tracklistEpisode);
        $this->entityManager->flush();

        return [
            'tracklist_episode' => $tracklistEpisode
        ];
    }

    public function deleteTracklistEpisode(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        $tracklistEpisode = $this->validateAndGetTracklistEpisode();
        if (is_array($tracklistEpisode))
        {
            return $tracklistEpisode;
        }

        $this->entityManager->remove($tracklistEpisode);
        $this->entityManager->flush();

        $tracklistEpisode = $this->entityManager->getRepository(TracklistEpisode::class)->find($this->data['tracklist_episode_id']);
        if ($tracklistEpisode instanceof TracklistEpisode)
        {
            return $this->returnTracklistEpisodeDeleteError();
        }

        return [
            'message' => 'Tracklist Episode successfully deleted'
        ];
    }

    private function validateAndGetTracklistEpisode(): TracklistEpisode | array
    {
        if (!isset($this->data['tracklist_id']))
        {
            return $this->returnTracklistIDNotProvided();
        }

        if (!isset($this->data['tracklist_season_id']))
        {
            return $this->returnTracklistSeasonIDNotProvided();
        }

        if (!isset($this->data['tracklist_episode_id']))
        {
            return $this->returnTracklistEpisodeIDNotProvided();
        }

        if (!isset($this->data['user_id']))
        {
            return $this->returnInvalidRequest();
        }

        $user = $this->entityManager->getRepository(User::class)->find($this->data['user_id']);
        if (!$user instanceof User)
        {
            return $this->returnUserNotFound();
        }

        $tracklistEpisode = $this->entityManager->getRepository(TracklistEpisode::class)->find($this->data['tracklist_episode_id']);
        if (!$tracklistEpisode instanceof TracklistEpisode)
        {
            return $this->returnTracklistEpisodeNotFound();
        }

        $tracklistSeason = $this->entityManager->getRepository(TracklistSeason::class)->find($this->data['tracklist_season_id']);
        if (!$tracklistSeason instanceof TracklistSeason)
        {
            return $this->returnTracklistSeasonNotFound();
        }

        if ($tracklistEpisode->getTracklistSeason() !== $tracklistSeason)
        {
            return $this->returnWrongTracklistSeasonTracklistEpisode();
        }

        $tracklist = $this->entityManager->getRepository(Tracklist::class)->find($this->data['tracklist_id']);
        if (!$tracklist instanceof Tracklist)
        {
            return $this->returnTracklistNotFound();
        }

        if ($tracklistSeason->getTracklist() !== $tracklist)
        {
            return $this->returnWrongTracklistTracklistSeason();
        }

        if ($tracklist->getUser() !== $user)
        {
            return $this->returnUserNotAuthorized();
        }

        return $tracklistEpisode;
    }
}