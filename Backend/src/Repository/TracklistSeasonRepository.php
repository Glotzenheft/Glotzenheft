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

namespace App\Repository;

use App\Entity\TracklistSeason;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TracklistSeason>
 */
class TracklistSeasonRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TracklistSeason::class);
    }

    public function findOneByBackupHashAndUser(string $backupHash, User $user): ?TracklistSeason
    {
        return $this->createQueryBuilder('ts')
            ->innerJoin('ts.tracklist', 't')
            ->andWhere('ts.backupHash = :hash')
            ->andWhere('t.user = :user')
            ->setParameter('hash', $backupHash)
            ->setParameter('user', $user)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
