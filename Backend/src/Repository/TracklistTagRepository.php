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

use App\Entity\TracklistTag;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TracklistTag>
 */
class TracklistTagRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TracklistTag::class);
    }

    /**
     * @param User $user
     * @param int $id
     * @return TracklistTag|null
     */
    public function findTagWithTracklistsByIdAndUser(User $user, int $id): ?TracklistTag
    {
        return $this->createQueryBuilder('tag')
            ->addSelect('tracklists')
            ->leftJoin('tag.tracklists', 'tracklists')

            ->addSelect('partial media.{id, originalName, name, posterPath, type}')
            ->leftJoin('tracklists.media', 'media')

            ->andWhere('tag.id = :id')
            ->andWhere('tag.user = :user')
            ->setParameter('id', $id)
            ->setParameter('user', $user)

            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param User $user
     * @return array
     */
    public function findAllTagsWithTracklistsByUser(User $user): array
    {
        return $this->createQueryBuilder('tag')
            ->addSelect('tracklists')
            ->leftJoin('tag.tracklists', 'tracklists')

            ->addSelect('partial media.{id, originalName, name, posterPath, type}')
            ->leftJoin('tracklists.media', 'media')

            ->andWhere('tag.user = :user')
            ->setParameter('user', $user)

            ->getQuery()
            ->getResult();
    }
}
