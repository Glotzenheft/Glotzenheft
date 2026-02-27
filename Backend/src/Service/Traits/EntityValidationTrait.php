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

namespace App\Service\Traits;

use App\Entity\Tracklist;
use App\Entity\TracklistTag;
use App\Entity\User;
use App\Repository\TracklistRepository;
use App\Repository\TracklistTagRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

trait EntityValidationTrait
{
    /**
     * @param int $tracklistId
     * @param User $user
     * @param TracklistRepository $tracklistRepository
     * @return Tracklist
     */
    private function findAndValidateTracklist(
        int $tracklistId,
        User $user,
        TracklistRepository $tracklistRepository,
    ): Tracklist
    {
        $tracklist = $tracklistRepository->findOneBy([
            'id' => $tracklistId,
            'user' => $user,
        ]);

        if (!$tracklist instanceof Tracklist)
        {
            throw new NotFoundHttpException(message: 'Tracklist not found or access denied.');
        }

        return $tracklist;
    }

    private function findAndValidateTracklistTag(
        User $user,
        int $id,
        TracklistTagRepository $tracklistTagRepository
    ): TracklistTag
    {
        $tag = $tracklistTagRepository->findOneBy([
            'id' => $id,
            'user' => $user,
        ]);

        if (!$tag instanceof TracklistTag)
        {
            throw new NotFoundHttpException(message: 'Tag not found or access denied.');
        }

        return $tag;
    }
}