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

    public function findByUserAndMediaWithSeasonsAndEpisodes(User $user, Media $media): array
    {
        return $this->createQueryBuilder('t')
            ->leftJoin('t.tracklistSeasons', 's') // Verknüpfung zu TracklistSeason
            ->leftJoin('s.tracklistEpisodes', 'e') // Verknüpfung zu TracklistEpisode
            ->addSelect('s', 'e') // Sorgt dafür, dass die Objekte mitgeladen werden
            ->where('t.user = :user')
            ->andWhere('t.media = :media')
            ->setParameter('user', $user)
            ->setParameter('media', $media)
            ->getQuery()
            ->getResult();
    }


    //    /**
    //     * @return Tracklist[] Returns an array of Tracklist objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('t.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Tracklist
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
