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
use App\Model\Request\TracklistTag\CreateTracklistTagRequestDto;
use App\Model\Response\TracklistTag\TracklistTagResponseDto;
use App\Repository\TracklistRepository;
use App\Repository\TracklistTagRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\String\Slugger\SluggerInterface;

readonly class TracklistTagService
{
    public function __construct(
        private TracklistTagRepository $tracklistTagRepository,
        private SluggerInterface       $slugger,
        private EntityManagerInterface $entityManager,
        private TracklistRepository    $tracklistRepository,
    ){}

    /**
     * @param User $user
     * @param int $id
     * @return TracklistTagResponseDto
     */
    public function getTracklistTag(User $user, int $id): TracklistTagResponseDto
    {
        $tag = $this->tracklistTagRepository->findOneBy([
            'id' => $id,
            'user' => $user,
        ]);

        if (!$tag instanceof TracklistTag)
        {
            throw new NotFoundHttpException(message: 'Tag not found or access denied.');
        }

        return TracklistTagResponseDto::fromEntity($tag);
    }

    /**
     * @param User $user
     * @return TracklistTagResponseDto[]
     */
    public function getAllTracklistTags(User $user): array
    {
        $tags = $this->tracklistTagRepository->findBy([
            'user' => $user,
        ]);

        return array_map(
            fn(TracklistTag $tag) => TracklistTagResponseDto::fromEntity($tag),
            $tags
        );
    }

    public function getTracklistTagWithTracklists(User $user, int $id): array
    {
        return [];
    }

    /**
     * @param User $user
     * @param CreateTracklistTagRequestDto $dto
     * @return TracklistTagResponseDto
     */
    public function createTracklistTag(
        User $user,
        CreateTracklistTagRequestDto $dto
    ):TracklistTagResponseDto
    {
        $slug = $this->slugify($dto->tagName);

        $existingTag = $this->tracklistTagRepository->findOneBy([
            'slug' => $slug,
            'user' => $user,
            'tracklistTagType' => $dto->tracklistTagType,
        ]);

        if ($existingTag instanceof TracklistTag)
        {
            throw new ConflictHttpException('Tag already exists for this category.');
        }

        $tracklistTag = (new TracklistTag())
            ->setTagName($dto->tagName)
            ->setTracklistTagType($dto->tracklistTagType)
            ->setUser($user)
            ->setColor($dto->color)
            ->setDescription($dto->description)
            ->setIcon($dto->icon)
            ->setIsSpoiler($dto->isSpoiler)
            ->setSlug($slug);

        if ($dto->tracklistId !== null)
        {
            $tracklist = $this->tracklistRepository->findOneBy([
                'id' => $dto->tracklistId,
                'user' => $user
            ]);

            if ($tracklist instanceof Tracklist)
            {
                $tracklistTag->addTracklist($tracklist);
            }
        }

        $this->entityManager->persist($tracklistTag);
        $this->entityManager->flush();

        return TracklistTagResponseDto::fromEntity($tracklistTag);
    }

    /**
     * @param string $tagName
     * @return string
     */
    private function slugify(string $tagName): string
    {
        return $this->slugger->slug($tagName)->lower()->toString();
    }
}