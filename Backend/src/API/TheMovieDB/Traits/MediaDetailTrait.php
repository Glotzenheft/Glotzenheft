<?php declare(strict_types=1);

namespace App\API\TheMovieDB\Traits;

use App\API\TheMovieDB\TVSeries\Details\TMDBTVSeriesDetailsService;
use App\Entity\Media;
use App\Entity\TMDBGenre;
use App\Enum\MediaType;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

trait MediaDetailTrait
{
    public function __construct
    (
        private readonly TMDBTVSeriesDetailsService $service,
        private readonly LoggerInterface $logger,
        private readonly EntityManagerInterface $entityManager
    )
    {
    }

    public function handleTMDBMediaDetail(int $tmdbID, MediaType $type): Media
    {
        $media = $this->entityManager->getRepository(Media::class)->findOneBy([
            'tmdbID' => $tmdbID,
            'type' => $type,
        ]);

        if (!$media instanceof Media)
        {
            $media = new Media();
        }


        $result = $this->service->getTVSeriesDetails($tmdbID);

        $genreArray = $result['genres'] ?? null;
        $firstAirDate = DateTime::createFromFormat('Y-m-d', $result['first_air_date']);
        $media
            ->setName($result['name'] ?? null)
            ->setOriginalName($result['original_name'] ?? null)
            ->setDescription($result['overview'] ?? null)
            ->setFirstAirDate($firstAirDate)
            ->setImdbID($result['external_ids']['imdb_id'] ?? null)
            ->setPosterPath($result['poster_path'] ?? null)
            ->setBackdropPath($result['backdrop_path'] ?? null)
            ->setType($type)
            ->setTmdbID($tmdbID)
        ;

        foreach ($genreArray as $genre)
        {
            $id = $genre['id'];
            $tmdbGenre = $this->entityManager->getRepository(TMDBGenre::class)->findOneBy(['tmdbGenreID' => $id]);
            $media->addTmdbGenre($tmdbGenre);
            $this->entityManager->persist($media);
            $this->entityManager->flush();
        }

        $this->entityManager->persist($media);
        $this->entityManager->flush();

        return $media;
    }
}