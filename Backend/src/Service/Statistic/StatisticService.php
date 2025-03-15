<?php declare(strict_types=1);

namespace App\Service\Statistic;

use App\Entity\User;
use App\Enum\MediaType;
use App\Service\RequestTrait;
use DateMalformedStringException;
use DateTimeImmutable;
use Symfony\Component\HttpFoundation\Request;

class StatisticService
{
    use RequestTrait;

    public function getWatchTimePerDay(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        $watchTimeArray = [];
        $watchTimeUnknownDate = 0;
        try
        {
            $periodStart = isset($this->data['period_start_date'])
                ? new DateTimeImmutable($this->data['period_start_date'])
                : new DateTimeImmutable('0001-01-01');

            $periodEnd = isset($this->data['period_end_date'])
                ? new DateTimeImmutable($this->data['period_end_date'])
                : new DateTimeImmutable();
        }
        catch (DateMalformedStringException $e)
        {
            return $this->returnInvalidDate();
        }

        $user = $this->entityManager->getRepository(User::class)->find($this->data['user_id']);
        if (!$user instanceof User)
        {
            return $this->returnUserNotFound();
        }

        $tracklists = $user->getTracklists();
        foreach ($tracklists as $tracklist)
        {
            $media = $tracklist->getMedia();
            if ($media->getType() === MediaType::Movie)
            {
                $finishDate = $tracklist->getFinishDate();
                $finishDateString = $finishDate?->format('Y-m-d');
                if ($finishDate)
                {
                    if (!isset($watchTimeArray[$finishDateString]))
                    {
                        $watchTimeArray[$finishDateString] = 0;
                    }

                    if ($finishDate >= $periodStart && $finishDate <= $periodEnd)
                    {
                        $watchTimeArray[$finishDateString] += $media->getRuntime();
                    }
                }
                else
                {
                    $watchTimeUnknownDate += $media->getRuntime();
                }

            }
            elseif ($media->getType() === MediaType::TV)
            {
                $tracklistSeasons = $tracklist->getTracklistSeasons();
                foreach ($tracklistSeasons as $tracklistSeason)
                {
                    $tracklistEpisodes = $tracklistSeason->getTracklistEpisodes();
                    foreach ($tracklistEpisodes as $tracklistEpisode)
                    {
                        $watchDate = $tracklistEpisode->getWatchDate();
                        $watchDateString = $watchDate?->format('Y-m-d');
                        if ($watchDate)
                        {
                            if (!isset($watchTimeArray[$watchDateString]))
                            {
                                $watchTimeArray[$watchDateString] = 0;
                            }

                            if ($watchDate >= $periodStart && $watchDate <= $periodEnd)
                            {
                                $watchTimeArray[$watchDateString] += $tracklistEpisode->getEpisode()->getRuntime();
                            }

                        }
                        else
                        {
                            $watchTimeUnknownDate += $tracklistEpisode->getEpisode()->getRuntime();
                        }
                    }
                }
            }
        }

        $watchTimeArray['unknown_date'] = $watchTimeUnknownDate;

        $filteredWatchTimeArray = array_filter($watchTimeArray, function ($value) {
            return $value !== 0;
        });

        krsort($filteredWatchTimeArray);

        return $filteredWatchTimeArray;
    }

    public function getUserRatings(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        $ratings = [];
        $ratings['no_rating'] = 0;

        $user = $this->entityManager->getRepository(User::class)->find($this->data['user_id']);
        if (!$user instanceof User)
        {
            return $this->returnUserNotFound();
        }

        $tracklists = $user->getTracklists();
        foreach ($tracklists as $tracklist)
        {
            $rating = $tracklist->getRating();
            if (!$rating)
            {
                $ratings['no_rating']++;
            }
            else
            {
                if (!isset($ratings[$rating]))
                {
                    $ratings[$rating] = 0;
                }

                $ratings[$rating]++;
            }
        }

        ksort($ratings);

        return $ratings;
    }
}