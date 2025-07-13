<?php
/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace App\Service\Tracklist;

use App\Entity\Media;
use App\Entity\Season;
use App\Entity\Tracklist;
use App\Entity\TracklistSeason;
use App\Entity\User;
use App\Enum\TracklistStatus;
use App\Service\RequestTrait;
use DateTime;
use DateTimeImmutable;
use Symfony\Component\HttpFoundation\Request;
use ValueError;

class TracklistService
{
    use RequestTrait;

    /**
     * @param Request $request
     * @return array
     */
    public function getUserTracklists(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        if (!isset($this->data['user_id']))
        {
            return $this->returnInvalidRequest();
        }

        $user = $this->entityManager->getRepository(User::class)->find($this->data['user_id']);
        if (!$user instanceof User)
        {
            return $this->returnUserNotFound();
        }

        $tracklists = $user->getTracklists();

        return [
            'tracklists' => $tracklists->toArray()
        ];
    }
    /**
     * Get tracklist entity based on its id.
     * Only returns the tracklist, if the request is from the creator of the tracklist.
     * @param Request $request
     * @return array
     */
    public function getTracklist(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        $tracklist = $this->validateAndGetTracklist();
        if (is_array($tracklist)) // When there is an error
        {
            return $tracklist;
        }

        return [
            'tracklist' => $tracklist,
        ];
    }

    /**
     * Creates a new tracklist for an existing user.
     * Returns the tracklist entity.
     * @param Request $request
     * @return array
     */
    public function createTracklist(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        if (!isset($this->data['tracklist_name'], $this->data['user_id'], $this->data['tracklist_status'], $this->data['media_id'], $this->data['media_type']))
        {
            return $this->returnInvalidRequest();
        }

        if (isset($this->data['tracklist_id']))
        {
            return $this->returnTracklistIDProvided();
        }

        if (!in_array($this->data['media_type'], ['tv', 'movie']))
        {
            return $this->returnInvalidMediaType();
        }

        if ($this->data['media_type'] === 'tv' && !isset($this->data['season_id']))
        {
            return $this->returnSeasonIDNotProvided();
        }

        try
        {
            $tracklistStatus = TracklistStatus::from($this->data['tracklist_status']);
        }
        catch
        (ValueError $e)
        {
            return $this->returnInvalidTracklistStatus();
        }

        $user = $this->entityManager->getRepository(User::class)->find($this->data['user_id']);
        if (!$user instanceof User)
        {
            return $this->returnUserNotFound();
        }

        $media = $this->entityManager->getRepository(Media::class)->find($this->data['media_id']);
        if (!$media instanceof Media)
        {
            return $this->returnMediaNotFound();
        }

        $tracklistName = $this->data['tracklist_name'];

        $tracklist = new Tracklist();
        $tracklist
            ->setTracklistName($tracklistName)
            ->setUser($user)
            ->setStatus($tracklistStatus)
            ->setMedia($media)
        ;

        $tracklist = $this->setOptionalTracklistProperties($tracklist);
        if (is_array($tracklist)) // When there is an error
        {
            return $tracklist;
        }

        $this->entityManager->persist($tracklist);

        if ($this->data['media_type'] === 'tv')
        {
            $season = $this->entityManager->getRepository(Season::class)->find($this->data['season_id']);
            if (!$season instanceof Season)
            {
                return $this->returnSeasonNotFound();
            }

            if ($this->data['media_id'] !== $season->getMedia()->getId())
            {
                return $this->returnWrongMediaSeason();
            }

            $tracklistSeason = new TracklistSeason();
            $tracklistSeason
                ->setSeason($season)
                ->setTracklist($tracklist)
            ;
            $this->entityManager->persist($tracklistSeason);
            $tracklist->addTracklistSeason($tracklistSeason);
        }
        $this->entityManager->flush();

        return [
            'tracklist' => $tracklist,
        ];
    }

    /**
     * @param Request $request
     * @return array
     */
    public function updateTracklist(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        $tracklist = $this->validateAndGetTracklist();
        if (is_array($tracklist)) // When there is an error
        {
            return $tracklist;
        }

        if (isset($this->data['tracklist_name']))
        {
            $tracklist->setTracklistName($this->data['tracklist_name']);
        }

        if (isset($this->data['tracklist_status']))
        {
            try
            {
                $tracklistStatus = TracklistStatus::from($this->data['tracklist_status']);
                $tracklist->setStatus($tracklistStatus);
            }
            catch
            (ValueError $e)
            {
                return $this->returnInvalidTracklistStatus();
            }
        }

        $tracklist = $this->setOptionalTracklistProperties($tracklist);
        if (is_array($tracklist)) // When there is an error
        {
            return $tracklist;
        }

        $this->entityManager->persist($tracklist);
        $this->entityManager->flush();

        return [
            'tracklist' => $tracklist,
        ];
    }

    public function deleteTracklist(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        $tracklist = $this->validateAndGetTracklist();
        if (is_array($tracklist)) // When there is an error
        {
            return $tracklist;
        }

        $this->entityManager->remove($tracklist);
        $this->entityManager->flush();

        $tracklist = $this->entityManager->getRepository(Tracklist::class)->find($this->data['tracklist_id']);
        if ($tracklist instanceof Tracklist)
        {
            return $this->returnTracklistDeleteError();
        }

        return [
            'message' => 'Tracklist deleted',
            'code' => 200,
        ];
    }

    private function setOptionalTracklistProperties(Tracklist $tracklist): Tracklist | array
    {
        $rating = null;
        if (!empty($this->data['tracklist_rating']) && is_numeric($this->data['tracklist_rating']))
        {
            $rating = (int) $this->data['tracklist_rating'];
            if ($rating < 1 || $rating > 10)
            {
                return $this->returnInvalidRating();
            }
        }
        $tracklist->setRating($rating);

        $startDate = null;
        if (!empty($this->data['tracklist_start_date']))
        {
            $startDate = DateTime::createFromFormat('Y-m-d', $this->data['tracklist_start_date']);
            if ($startDate === false || $startDate->format('Y-m-d') !== $this->data['tracklist_start_date'])
            {
                return $this->returnInvalidDate();
            }
        }
        $tracklist->setStartDate($startDate);

        $finishDate = null;
        if (!empty($this->data['tracklist_finish_date']))
        {
            $finishDate = DateTime::createFromFormat('Y-m-d', $this->data['tracklist_finish_date']);
            if ($finishDate === false || $finishDate->format('Y-m-d') !== $this->data['tracklist_finish_date'])
            {
                return $this->returnInvalidDate();
            }
        }
        $tracklist->setFinishDate($finishDate);
        $tracklist->setUpdatedAt(new DateTimeImmutable());

        return $tracklist;
    }

    private function validateAndGetTracklist(): Tracklist | array
    {
        if (!isset($this->data['tracklist_id']))
        {
            return $this->returnTracklistIDNotProvided();
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

        $tracklist = $this->entityManager->getRepository(Tracklist::class)->find($this->data['tracklist_id']);
        if (!$tracklist instanceof Tracklist)
        {
            return $this->returnTracklistNotFound();
        }

        if ($tracklist->getUser() !== $user)
        {
            return $this->returnUserNotAuthorized();
        }

        return $tracklist;
    }
}