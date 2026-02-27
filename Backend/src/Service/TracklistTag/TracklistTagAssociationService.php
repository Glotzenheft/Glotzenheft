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

namespace App\Service\TracklistTag;

use App\Entity\Tracklist;
use App\Entity\TracklistTag;
use App\Entity\User;
use App\Repository\TracklistRepository;
use App\Repository\TracklistTagRepository;
use App\Service\Traits\EntityValidationTrait;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

readonly class TracklistTagAssociationService
{
    use EntityValidationTrait;

    public function __construct(
        private TracklistRepository $tracklistRepository,
        private TracklistTagRepository $tracklistTagRepository,
        private EntityManagerInterface $entityManager
    ) {}

    /**
     * @param int $tracklistId
     * @param int $tagId
     * @param User $user
     * @return void
     */
    public function addTagToTracklist(
        int $tracklistId,
        int $tagId,
        User $user,
    ): void
    {
        $tracklist = $this->findAndValidateTracklist(
            tracklistId: $tracklistId,
            user: $user,
            tracklistRepository: $this->tracklistRepository
        );

        $tag = $this->findAndValidateTracklistTag(
            user: $user,
            id: $tagId,
            tracklistTagRepository: $this->tracklistTagRepository
        );

        $tracklist->addTracklistTag($tag);
        $this->entityManager->flush();
    }

    /**
     * @param int $tracklistId
     * @param int $tagId
     * @param User $user
     * @return void
     */
    public function addTracklistToTag(
        int $tracklistId,
        int $tagId,
        User $user,
    ): void
    {
        $tag = $this->findAndValidateTracklistTag(
            user: $user,
            id: $tagId,
            tracklistTagRepository: $this->tracklistTagRepository
        );

        $tracklist = $this->findAndValidateTracklist(
            tracklistId: $tracklistId,
            user: $user,
            tracklistRepository: $this->tracklistRepository
        );

        $tag->addTracklist($tracklist);
        $this->entityManager->flush();
    }

    /**
     * @param int $tracklistId
     * @param User $user
     * @param array $tagIds
     * @return void
     */
    public function addTagsToTracklists(
        int $tracklistId,
        User $user,
        array $tagIds,
    ): void
    {
        $tracklist = $this->findAndValidateTracklist(
            tracklistId: $tracklistId,
            user: $user,
            tracklistRepository: $this->tracklistRepository
        );

        foreach ($tagIds as $id)
        {
            $tag = $this->findAndValidateTracklistTag(
                user: $user,
                id: $id,
                tracklistTagRepository: $this->tracklistTagRepository
            );

            $tracklist->addTracklistTag($tag);
        }

        $this->entityManager->flush();
    }

    /**
     * @param int $tagId
     * @param User $user
     * @param Integer[] $tracklistIds
     * @return void
     */
    public function addTracklistsToTag(
        int $tagId,
        User $user,
        array $tracklistIds,
    ): void
    {
        $tag = $this->findAndValidateTracklistTag(
            user: $user,
            id: $tagId,
            tracklistTagRepository: $this->tracklistTagRepository
        );

        foreach ($tracklistIds as $id)
        {
            $tracklist = $this->findAndValidateTracklist(
                tracklistId: $id,
                user: $user,
                tracklistRepository: $this->tracklistRepository
            );
            $tracklist->addTracklistTag($tag);
        }

        $this->entityManager->flush();
    }

    /**
     * @param int $tracklistId
     * @param int $tagId
     * @param User $user
     * @return void
     */
    public function removeTagFromTracklist(
        int $tracklistId,
        int $tagId,
        User $user,
    ): void
    {
        $tracklist = $this->findAndValidateTracklist(
            tracklistId: $tracklistId,
            user: $user,
            tracklistRepository: $this->tracklistRepository
        );

        $tag = $this->findAndValidateTracklistTag(
            user: $user,
            id: $tagId,
            tracklistTagRepository: $this->tracklistTagRepository
        );

        $tracklist->removeTracklistTag($tag);
        $this->entityManager->flush();
    }

    /**
     * @param int $tagId
     * @param int $tracklistId
     * @param User $user
     * @return void
     */
    public function removeTracklistFromTag(
        int $tagId,
        int $tracklistId,
        User $user,
    ): void
    {
        $tag = $this->findAndValidateTracklistTag(
            user: $user,
            id: $tagId,
            tracklistTagRepository: $this->tracklistTagRepository
        );

        $tracklist = $this->findAndValidateTracklist(
            tracklistId: $tracklistId,
            user: $user,
            tracklistRepository: $this->tracklistRepository
        );

        $tag->removeTracklist($tracklist);
        $this->entityManager->flush();
    }

    /**
     * @param int $tagId
     * @param User $user
     * @param Integer[] $tracklistIds
     * @return void
     */
    public function removeTracklistsFromTag(
        int $tagId,
        User $user,
        array $tracklistIds,
    ): void
    {
        $tag = $this->findAndValidateTracklistTag(
            user: $user,
            id: $tagId,
            tracklistTagRepository: $this->tracklistTagRepository
        );

        foreach ($tracklistIds as $id)
        {
            $tracklist = $this->findAndValidateTracklist(
                tracklistId: $id,
                user: $user,
                tracklistRepository: $this->tracklistRepository
            );
            $tag->removeTracklist($tracklist);
        }

        $this->entityManager->flush();
    }

    /**
     * @param int $tracklistId
     * @param User $user
     * @param Integer[] $tagIds
     * @return void
     */
    public function removeTagsFromTracklist(
        int $tracklistId,
        User $user,
        array $tagIds,
    ): void
    {
        $tracklist = $this->findAndValidateTracklist(
            tracklistId: $tracklistId,
            user: $user,
            tracklistRepository: $this->tracklistRepository
        );

        foreach ($tagIds as $id)
        {
            $tag = $this->findAndValidateTracklistTag(
                user: $user,
                id: $id,
                tracklistTagRepository: $this->tracklistTagRepository
            );
            $tracklist->removeTracklistTag($tag);
        }

        $this->entityManager->flush();
    }
}