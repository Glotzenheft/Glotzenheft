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

namespace App\Tests\Unit\Controller\API\Tracklist;

use App\Controller\API\Tracklist\TracklistController;
use App\Entity\Episode;
use App\Entity\Media;
use App\Entity\Season;
use App\Entity\Tracklist;
use App\Entity\TracklistEpisode;
use App\Entity\TracklistSeason;
use App\Entity\TracklistTag;
use App\Entity\User;
use App\Enum\MediaType;
use App\Enum\TracklistStatus;
use App\Enum\TracklistTagType;
use App\Model\Request\Tracklist\CreateTracklistDto;
use App\Model\Request\Tracklist\UpdateTracklistDto;
use App\Repository\SeasonRepository;
use App\Repository\TracklistRepository;
use App\Service\Tracklist\TracklistService;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use ReflectionProperty;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AttributeLoader;
use Symfony\Component\Serializer\NameConverter\MetadataAwareNameConverter;
use Symfony\Component\Serializer\Normalizer\BackedEnumNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

/** Tests the real controller, service and JSON serialization with mocked persistence. */
class TracklistControllerTest extends TestCase
{
    /** @var TracklistRepository&MockObject */
    private TracklistRepository $tracklistRepository;
    /** @var EntityRepository<Media>&MockObject */
    private EntityRepository $mediaRepository;
    /** @var SeasonRepository&MockObject */
    private SeasonRepository $seasonRepository;
    private TracklistController $controller;
    private User $user;
    private Media $media;
    private Season $season;
    /** @var list<Tracklist|TracklistSeason> */
    private array $persisted = [];

    protected function setUp(): void
    {
        $this->tracklistRepository = $this->createMock(TracklistRepository::class);
        $this->mediaRepository = $this->createMock(EntityRepository::class);
        $this->seasonRepository = $this->createMock(SeasonRepository::class);
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->method('getRepository')->willReturnMap([
            [Media::class, $this->mediaRepository],
            [Season::class, $this->seasonRepository],
        ]);
        $entityManager->method('persist')->willReturnCallback(function (object $entity): void {
            if ($entity instanceof Tracklist || $entity instanceof TracklistSeason)
            {
                $this->persisted[] = $entity;
            }
        });
        // Generated IDs and timestamps become available only after flushing.
        $entityManager->method('flush')->willReturnCallback(function (): void {
            foreach ($this->persisted as $entity)
            {
                $this->initializeEntity($entity, $entity instanceof Tracklist ? 42 : 50);
            }
            $this->persisted = [];
        });

        $service = new TracklistService($this->tracklistRepository, $this->seasonRepository, $entityManager);
        $this->controller = new TracklistController($service);

        $metadata = new ClassMetadataFactory(new AttributeLoader());
        $serializer = new Serializer([
            new BackedEnumNormalizer(),
            new ObjectNormalizer($metadata, new MetadataAwareNameConverter($metadata)),
        ], [new JsonEncoder()]);
        $container = new Container();
        $container->set('serializer', $serializer);
        $this->controller->setContainer($container);

        $this->user = new User();
        $this->media = (new Media())->setType(MediaType::TV);
        $this->initializeEntity($this->media, 10);
        $this->season = (new Season())->setMedia($this->media)->setSeasonNumber(0);
        $this->initializeEntity($this->season, 20);
    }

    /** @return array<string, array{MediaType}> */
    public static function mediaTypes(): array
    {
        return ['movie' => [MediaType::Movie], 'series' => [MediaType::TV]];
    }

    /** @dataProvider mediaTypes */
    public function testGetReturnsCompleteDetails(MediaType $type): void
    {
        // Arrange
        $tracklist = $this->createExistingTracklist($type);
        $this->tracklistRepository->expects(self::once())->method('findOneBy')
            ->with(['id' => 42, 'user' => $this->user])->willReturn($tracklist);

        // Act
        $response = $this->controller->getTracklistEndpoint($this->user, 42);

        // Assert
        $data = $this->decode($response, 200);
        $this->assertCompleteDetails($data, $type);
        self::assertSame('Personal note', $data['comment']);
        self::assertSame(30, $data['tags'][0]['id']);
        self::assertSame('genre', $data['tags'][0]['tracklistTagType']);
        if ($type === MediaType::TV)
        {
            $episode = $data['tracklistSeason']['tracklistEpisodes'][0];
            self::assertSame(70, $episode['id']);
            self::assertSame(60, $episode['episode']['id']);
            self::assertArrayHasKey('watchDateTime', $episode);
            self::assertNull($episode['watchDateTime']);
            self::assertArrayNotHasKey('watchDate', $episode);
        }
    }

    /** @dataProvider mediaTypes */
    public function testCreateReturnsPersistedDetailsWithoutAnotherGet(MediaType $type): void
    {
        // Arrange
        $this->media->setType($type);
        $this->mediaRepository->method('find')->with(10)->willReturn($this->media);
        $this->seasonRepository->method('find')->with(20)->willReturn($this->season);
        $this->tracklistRepository->expects(self::never())->method('findOneBy');
        $dto = new CreateTracklistDto(
            tracklistName: 'New tracklist',
            tracklistStatus: TracklistStatus::WATCHING,
            mediaId: 10,
            mediaType: $type->value,
            seasonId: $type === MediaType::TV ? 20 : null,
            comment: 'New note',
            customAirDate: '2026-10-28',
            language: 'ja',
            subtitle: 'de',
            customPosterPath: '/custom.jpg',
            startEpisodeNumber: 2,
            endEpisodeNumber: 4,
            customSeasonNumber: 0,
            customPartNumber: 1,
        );
        $request = Request::create('/api/tracklists', 'POST');

        // Act
        $response = $this->controller->createTracklistEndpoint($dto, $this->user, $request);

        // Assert
        $data = $this->decode($response, 201);
        $this->assertCompleteDetails($data, $type);
        self::assertSame('New note', $data['comment']);
        self::assertSame([], $data['tags']);
        if ($type === MediaType::TV)
        {
            self::assertSame([], $data['tracklistSeason']['tracklistEpisodes']);
        }
    }

    /** @dataProvider mediaTypes */
    public function testPatchReturnsTheSameCompleteFormatAsGet(MediaType $type): void
    {
        // Arrange
        $tracklist = $this->createExistingTracklist($type);
        $this->tracklistRepository->expects(self::exactly(2))->method('findOneBy')
            ->with(['id' => 42, 'user' => $this->user])->willReturn($tracklist);
        $body = ['comment' => null, 'is_rewatching' => false, 'custom_part_number' => null];
        $request = Request::create(
            '/api/tracklists/42', 'PATCH', server: ['CONTENT_TYPE' => 'application/json'],
            content: json_encode($body, JSON_THROW_ON_ERROR),
        );
        $dto = new UpdateTracklistDto(isRewatching: false);

        // Act
        $response = $this->controller->updateTracklistEndpoint(42, $dto, $this->user, $request);
        $getResponse = $this->controller->getTracklistEndpoint($this->user, 42);

        // Assert
        $data = $this->decode($response, 200);
        $this->assertCompleteDetails($data, $type);
        self::assertNull($data['comment']);
        self::assertFalse($data['isRewatching']);
        self::assertSame(30, $data['tags'][0]['id']);
        if ($type === MediaType::TV)
        {
            self::assertNull($data['tracklistSeason']['customPartNumber']);
            self::assertSame(70, $data['tracklistSeason']['tracklistEpisodes'][0]['id']);
        }
        self::assertSame($data, $this->decode($getResponse, 200));
    }

    /** @return array<string, array{string}> */
    public static function deniedOperations(): array
    {
        return ['read' => ['read'], 'update' => ['update']];
    }

    /** @dataProvider deniedOperations */
    public function testReadAndUpdateRemainScopedToTheCurrentUser(string $operation): void
    {
        // Arrange
        $this->tracklistRepository->expects(self::once())->method('findOneBy')
            ->with(['id' => 42, 'user' => $this->user])->willReturn(null);
        $dto = new UpdateTracklistDto();
        $request = Request::create('/api/tracklists/42', 'PATCH', content: '{}');

        // Act & Assert
        $this->expectException(NotFoundHttpException::class);
        if ($operation === 'read')
        {
            $this->controller->getTracklistEndpoint($this->user, 42);
        }
        else
        {
            $this->controller->updateTracklistEndpoint(42, $dto, $this->user, $request);
        }
    }

    public function testCollectionStillReturnsLightweightTracklists(): void
    {
        // Arrange
        $tracklist = $this->createExistingTracklist(MediaType::TV);
        $this->tracklistRepository->method('findAllTracklistsByUserWithMediaAndTags')
            ->with($this->user)->willReturn([$tracklist]);

        // Act
        $response = $this->controller->getTracklistsEndpoint($this->user);

        // Assert
        $data = $this->decode($response, 200);
        self::assertSame(42, $data[0]['id']);
        self::assertSame(30, $data[0]['tags'][0]['id']);
        self::assertArrayNotHasKey('comment', $data[0]);
        self::assertArrayNotHasKey('tracklistSeason', $data[0]);
    }

    public function testExplicitMinimalPreferenceStillReturnsNoContent(): void
    {
        // Arrange
        $tracklist = $this->createExistingTracklist(MediaType::TV);
        $this->tracklistRepository->method('findOneBy')->willReturn($tracklist);
        $request = Request::create('/api/tracklists/42', 'PATCH', content: '{}');
        $request->headers->set('Prefer', 'return=minimal');
        $dto = new UpdateTracklistDto();

        // Act
        $response = $this->controller->updateTracklistEndpoint(42, $dto, $this->user, $request);

        // Assert
        self::assertSame(204, $response->getStatusCode());
        self::assertSame('', $response->getContent());
    }

    private function createExistingTracklist(MediaType $type): Tracklist
    {
        $this->media->setType($type);
        $tracklist = (new Tracklist())->setMedia($this->media)->setUser($this->user)
            ->setTracklistName('Existing tracklist')->setStatus(TracklistStatus::WATCHING)
            ->setIsRewatching(true)->setComment('Personal note')->setLanguage('ja')->setSubtitle('de')
            ->setCustomAirDate(new DateTimeImmutable('2026-10-28'))->setCustomPosterPath('/custom.jpg');
        $this->initializeEntity($tracklist, 42);
        $tag = (new TracklistTag())->setTagName('Drama')->setTracklistTagType(TracklistTagType::GENRE)
            ->setSlug('drama')->setIsSpoiler(false)->setIsAdult(false);
        $this->initializeEntity($tag, 30);
        $tracklist->addTracklistTag($tag);

        if ($type === MediaType::TV)
        {
            $tracklistSeason = (new TracklistSeason())->setSeason($this->season)
                ->setStartEpisodeNumber(2)->setEndEpisodeNumber(4)->setCustomSeasonNumber(0)->setCustomPartNumber(1);
            $this->initializeEntity($tracklistSeason, 50);
            $tracklist->setTracklistSeason($tracklistSeason);
            $episode = (new Episode())->setSeason($this->season)->setEpisodeNumber(2);
            $this->initializeEntity($episode, 60);
            $sighting = (new TracklistEpisode())->setEpisode($episode)->setWatchDate(null);
            $this->initializeEntity($sighting, 70);
            $tracklistSeason->addTracklistEpisode($sighting);
        }

        return $tracklist;
    }

    /** @param Media|Season|Tracklist|TracklistSeason|TracklistTag|Episode|TracklistEpisode $entity */
    private function initializeEntity(object $entity, int $id): void
    {
        (new ReflectionProperty($entity, 'id'))->setValue($entity, $id);
        $entity->setCreatedAt(new DateTimeImmutable('2026-10-28 19:00:00'));
    }

    /** @return array<array-key, mixed> */
    private function decode(Response $response, int $status): array
    {
        self::assertSame($status, $response->getStatusCode());
        $content = $response->getContent();
        self::assertIsString($content);
        return json_decode($content, true, flags: JSON_THROW_ON_ERROR);
    }

    /** @param array<string, mixed> $data */
    private function assertCompleteDetails(array $data, MediaType $type): void
    {
        self::assertSame(42, $data['id']);
        self::assertSame($type->value, $data['media']['type']);
        self::assertSame('2026-10-28 19:00:00', $data['createdAt']);
        self::assertSame('2026-10-28', $data['customAirDate']);
        self::assertSame('ja', $data['language']);
        self::assertSame('de', $data['subtitle']);
        self::assertSame('/custom.jpg', $data['customPosterPath']);
        self::assertArrayHasKey('comment', $data);
        self::assertArrayHasKey('tags', $data);
        self::assertArrayHasKey('tracklistSeason', $data);
        if ($type === MediaType::Movie)
        {
            self::assertNull($data['tracklistSeason']);
        }
        else
        {
            self::assertSame(50, $data['tracklistSeason']['id']);
            self::assertSame(20, $data['tracklistSeason']['season']['id']);
            self::assertSame(0, $data['tracklistSeason']['season']['seasonNumber']);
            self::assertSame(0, $data['tracklistSeason']['customSeasonNumber']);
            self::assertSame(2, $data['tracklistSeason']['startEpisodeNumber']);
            self::assertSame(4, $data['tracklistSeason']['endEpisodeNumber']);
            self::assertArrayHasKey('tracklistEpisodes', $data['tracklistSeason']);
        }
    }
}
