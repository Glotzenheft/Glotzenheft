<?php declare(strict_types=1);

namespace App\API\TheMovieDB\Traits;

use App\API\TheMovieDB\Movies\Details\TMDBMovieDetailsService;
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
        private readonly TMDBTVSeriesDetailsService $tvService,
        private readonly TMDBMovieDetailsService $movieService,
        private readonly LoggerInterface $logger,
        private readonly EntityManagerInterface $entityManager
    )
    {
    }

    public function handleTMDBMediaDetail(int $tmdbID, MediaType $type): ?Media
    {
        $media = $this->entityManager->getRepository(Media::class)->findOneBy([
            'tmdbID' => $tmdbID,
            'type' => $type,
        ]);

        if (!$media instanceof Media)
        {
            $media = new Media();
        }

        switch ($type)
        {
            case MediaType::TV:
                $result = $this->tvService->getTVSeriesDetails($tmdbID);
                $firstAirDate = DateTime::createFromFormat('Y-m-d', $result['first_air_date']);
                $name = $result['name'];
                $originalName = $result['original_name'];
                break;
            case MediaType::Movie:
                $result = $this->movieService->getMovieDetails($tmdbID);
                $firstAirDate = DateTime::createFromFormat('Y-m-d', $result['release_date']);
                $name = $result['title'];
                $originalName = $result['original_title'];
                break;
            case MediaType::ANIME:
                return null;
        }

        $genreArray = $result['genres'] ?? null;

        $media
            ->setName($name ?? '')
            ->setOriginalName($originalName ?? '')
            ->setDescription($result['overview'] ?? '')
            ->setFirstAirDate($firstAirDate ?? null)
            ->setImdbID($result['external_ids']['imdb_id'] ?? null)
            ->setPosterPath($result['poster_path'] ?? null)
            ->setBackdropPath($result['backdrop_path'] ?? '')
            ->setType($type)
            ->setTmdbID($tmdbID)
        ;

        foreach ($genreArray as $genre)
        {
            $id = $genre['id'];
            $tmdbGenre = $this->entityManager->getRepository(TMDBGenre::class)->findOneBy(['tmdbGenreID' => $id]);
            $media->addTmdbGenre($tmdbGenre);
        }

        $this->entityManager->persist($media);
        $this->entityManager->flush();

        return $media;
    }
}