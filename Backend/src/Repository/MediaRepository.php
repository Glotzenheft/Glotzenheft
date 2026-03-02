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
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Media>
 */
class MediaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Media::class);
    }

    /**
     * @param int $id
     * @return Media|null
     */
    public function findMediaWithSeasonsAndEpisodesById(
        int $id
    ): ?Media
    {
        return $this->createQueryBuilder('media')
            ->leftJoin('media.seasons', 'seasons')
            ->leftJoin('seasons.episodes', 'episodes')
            ->leftJoin('media.tmdbGenres', 'genres')
            ->addSelect('seasons', 'episodes', 'genres')

            ->where('media.id = :id')
            ->setParameter('id', $id)

            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param int $tmdbId
     * @param string $type
     * @return Media|null
     */
    public function findMediaWithSeasonsAndEpisodesByTmdbIdAndType(
        int $tmdbId,
        string $type
    ): ?Media
    {
        return $this->createQueryBuilder('media')
            ->leftJoin('media.seasons', 'seasons')
            ->leftJoin('seasons.episodes', 'episodes')
            ->leftJoin('media.tmdbGenres', 'genres')
            ->addSelect('seasons', 'episodes', 'genres')

            ->where('media.type = :type')
            ->andWhere('media.tmdbId = :tmdbId')
            ->setParameter('type', $type)
            ->setParameter('tmdbId', $tmdbId)

            ->getQuery()
            ->getOneOrNullResult();
    }
}
