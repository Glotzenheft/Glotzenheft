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
use App\Model\Request\TracklistTag\UpdateTracklistTagRequestDto;
use App\Model\Response\TracklistTag\TracklistTagLightResponseDto;
use App\Model\Response\TracklistTag\TracklistTagResponseDto;
use App\Repository\TracklistRepository;
use App\Repository\TracklistTagRepository;
use DateTimeImmutable;
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
     * @return TracklistTagLightResponseDto
     */
    public function getTracklistTag(User $user, int $id): TracklistTagLightResponseDto
    {
        $tag = $this->tracklistTagRepository->findLightTagByIdAndUser(
            user:$user,
            id: $id
        );

        if (!$tag instanceof TracklistTag)
        {
            throw new NotFoundHttpException(message: 'Tag not found or access denied.');
        }

        return TracklistTagLightResponseDto::fromEntity($tag);
    }

    /**
     * @param User $user
     * @return TracklistTagLightResponseDto[]
     */
    public function getAllTracklistTags(User $user): array
    {
        $tags = $this->tracklistTagRepository->findAllLightTagsByUser(user: $user);

        return array_map(
            fn(TracklistTag $tag) => TracklistTagLightResponseDto::fromEntity($tag),
            $tags
        );
    }

    /**
     * @param User $user
     * @param int $id
     * @return TracklistTagResponseDto
     */
    public function getTracklistTagWithTracklists(
        User $user,
        int $id
    ): TracklistTagResponseDto
    {
        $tag = $this->tracklistTagRepository->findTagWithTracklistsByIdAndUser(
            user:$user,
            id: $id
        );

        if (!$tag instanceof TracklistTag)
        {
            throw new NotFoundHttpException(message: 'Tag not found or access denied.');
        }

        return TracklistTagResponseDto::fromEntity($tag);
    }

    /**
     * @param User $user
     * @return array
     */
    public function getAllTracklistTagsWithTracklists(User $user): array
    {
        $tags = $this->tracklistTagRepository->findAllTagsWithTracklistsByUser($user);

        return array_map(
            fn(TracklistTag $tag) => TracklistTagResponseDto::fromEntity($tag),
            $tags
        );
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
     * @param int $id
     * @param User $user
     * @param UpdateTracklistTagRequestDto $dto
     * @param array $requestData
     * @return TracklistTagResponseDto
     */
    public function updateTracklistTag(
        int $id,
        User $user,
        UpdateTracklistTagRequestDto $dto,
        array $requestData
    ): TracklistTagResponseDto
    {
        $tag = $this->findAndValidateTracklistTag(
            user: $user,
            id: $id
        );

        $newTagName = (array_key_exists('tag_name', $requestData)
            && $dto->tagName !== null
            && trim($dto->tagName) !== ''
        )
            ? $dto->tagName
            : $tag->getTagName();

        $newType = (array_key_exists('tracklist_tag_type', $requestData)
            && $dto->tracklistTagType !== null
        )
            ? $dto->tracklistTagType
            : $tag->getTracklistTagType();

        $newSlug = $this->slugify($newTagName);

        $identityChanged = $newSlug !== $tag->getSlug() || $newType !== $tag->getTracklistTagType();

        if ($identityChanged)
        {
            $existingTag = $this->tracklistTagRepository->findOneBy([
                'slug' => $newSlug,
                'user' => $user,
                'tracklistTagType' => $newType
            ]);

            if ($existingTag instanceof TracklistTag)
            {
                throw new ConflictHttpException('A tag with this name already exists in this category.');
            }

            $tag->setTagName($newTagName)
                ->setSlug($newSlug)
                ->setTracklistTagType($newType);
        }

        if (array_key_exists('color', $requestData))
        {
            $tag->setColor($dto->color);
        }

        if (array_key_exists('icon', $requestData))
        {
            $tag->setIcon($dto->icon);
        }

        if (array_key_exists('description', $requestData))
        {
            $tag->setDescription($dto->description);
        }

        if (array_key_exists('is_spoiler', $requestData)
            && $dto->isSpoiler !== null
        )
        {
            $tag->setIsSpoiler($dto->isSpoiler);
        }

        $tag->setUpdatedAt(new DateTimeImmutable());
        $this->entityManager->flush();
        return TracklistTagResponseDto::fromEntity($tag);
    }

    /**
     * @param int $id
     * @param User $user
     * @return void
     */
    public function deleteTracklistTag(
        int $id,
        User $user
    ): void
    {
        $tag = $this->findAndValidateTracklistTag(
            user: $user,
            id: $id
        );

        $this->entityManager->remove($tag);
        $this->entityManager->flush();
    }

    /**
     * @param User $user
     * @param int $id
     * @return TracklistTag
     */
    private function findAndValidateTracklistTag(
        User $user,
        int $id
    ): TracklistTag
    {
        $tag = $this->tracklistTagRepository->findOneBy([
            'id' => $id,
            'user' => $user,
        ]);

        if (!$tag instanceof TracklistTag)
        {
            throw new NotFoundHttpException(message: 'Tag not found or access denied.');
        }

        return $tag;
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