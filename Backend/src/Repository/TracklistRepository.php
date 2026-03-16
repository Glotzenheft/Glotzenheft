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
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
declare(strict_types=1);

namespace App\Repository;

use App\Entity\Media;
use App\Entity\Tracklist;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Tracklist>
 */
class TracklistRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tracklist::class);
    }

    /**
     * @param User $user
     * @param Media $media
     * @return array
     */
    public function findTracklistsByUserAndMediaWithSeasonsEpisodesAndTags(
        User $user,
        Media $media
    ): array
    {
        return $this->createQueryBuilder('t')
            ->leftJoin('t.tracklistSeason', 's')
            ->leftJoin('s.tracklistEpisodes', 'e')
            ->leftJoin('t.tracklistTags', 'tags')
            ->addSelect('s', 'e')
            ->addSelect('PARTIAL tags.{id, tagName, tracklistTagType, color, description, icon, slug, isSpoiler, createdAt, updatedAt}')
            ->where('t.user = :user')
            ->andWhere('t.media = :media')
            ->setParameter('user', $user)
            ->setParameter('media', $media)
            ->getQuery()
            ->getResult();
    }

    /**
     * @param int $tracklistId
     * @param User $user
     * @return Tracklist|null
     */
    public function findTracklistByTracklistIdAndUserWithSeasonEpisodesAndTags(
        int $tracklistId,
        User $user
    ): ?Tracklist
    {
        return $this->createQueryBuilder('tracklist')
            ->leftJoin('t.tracklistSeason', 'season')
            ->leftJoin('s.tracklistEpisodes', 'episodes')
            ->leftJoin('t.tracklistTags', 'tags')
            ->addSelect('season', 'episodes')
            ->addSelect('PARTIAL tags.{id, tagName, tracklistTagType, color, description, icon, slug, isSpoiler, createdAt, updatedAt}')

            ->where('tracklist.id = :tracklistId')
            ->andWhere('tracklist.user = :user')
            ->setParameter('tracklistId', $tracklistId)
            ->setParameter('user', $user)

            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param User $user
     * @return array
     */
    public function findAllTracklistsByUserWithSeasonEpisodesAndTags(
        User $user
    ): array
    {
        return $this->createQueryBuilder('tracklist')
            ->leftJoin('tracklist.tracklistSeason', 'season')
            ->leftJoin('season.tracklistEpisodes', 'episodes')
            ->leftJoin('tracklist.tracklistTags', 'tags')
            ->addSelect('season', 'episodes')
            ->addSelect('PARTIAL tags.{id, tagName, tracklistTagType, color, description, icon, slug, isSpoiler, createdAt, updatedAt}')

            ->where('tracklist.user = :user')
            ->setParameter('user', $user)

            ->getQuery()
            ->getResult();
    }

    /**
     * @param User $user
     * @return array
     */
    public function findAllTracklistsByUserWithMediaAndTags(
        User $user
    ): array
    {
        return $this->createQueryBuilder('tracklist')
            ->leftJoin('tracklist.tracklistTags', 'tags')
            ->leftJoin('tracklist.media', 'media')
            ->addSelect('PARTIAL media.{id, posterPath, type, createdAt, updatedAt}')
            ->addSelect('PARTIAL tags.{id, tagName, tracklistTagType, color, description, icon, slug, isSpoiler, createdAt, updatedAt}')

            ->where('tracklist.user = :user')
            ->setParameter('user', $user)

            ->getQuery()
            ->getResult();
    }
}
