<?php

namespace App\Command;

use App\API\TheMovieDB\Genres\TMDBGenreService;
use App\Entity\TMDBGenre;
use DateTimeImmutable;
use Doctrine\DBAL\Exception;
use Doctrine\ORM\EntityManagerInterface;
use GuzzleHttp\Exception\GuzzleException;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'glotzenheft:tmdb:migrateGenres',
    description: 'Add a short description for your command',
)]
class MigrateTMDBGenresCommand extends Command
{
    public function __construct
    (
        private readonly EntityManagerInterface $entityManager,
        private readonly TMDBGenreService $tmdbGenreService
    )
    {
        parent::__construct();
    }

    /**
     * @throws GuzzleException
     * @throws Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->entityManager->getConnection()->executeStatement("ALTER TABLE tmdbgenre AUTO_INCREMENT = 1");
        $io = new SymfonyStyle($input, $output);

        $io->title('Migrating TMDB genres');

        $io->writeln('Starting migrating tv TMDB genres...');

        $tvGenres = $this->tmdbGenreService->getTVGenres();

        if (empty($tvGenres))
        {
            $io->writeln('Failed to get tv tmdb genres...');
        }
        else
        {
            $io->info('Saving tv genres to the database...');
            $this->persistGenre($tvGenres);
            $this->entityManager->flush();
        }

        $io->writeln('Starting migrating movie TMDB genres...');

        $movieGenres = $this->tmdbGenreService->getMovieGenres();

        if (empty($movieGenres))
        {
            $io->writeln('Failed to get movie tmdb genres...');
        }
        else
        {
            $io->info('Saving movie genres to the database...');
            $this->persistGenre($movieGenres);
            $this->entityManager->flush();
        }

        return Command::SUCCESS;
    }

    private function persistGenre(array $genreArray): void
    {
        foreach ($genreArray['genres'] as $genre)
        {
            if (isset($genre['id']) && isset($genre['name']))
            {
                $id = $genre['id'];
                $name = $genre['name'];

                $existingGenre = $this->entityManager->getRepository(TMDBGenre::class)->findOneBy(['tmdbGenreID' => $id]);
                if ($existingGenre instanceof TMDBGenre)
                {
                    continue;
                }
                $newGenre = new TMDBGenre();
                $newGenre
                    ->setName($name)
                    ->setTmdbGenreID($id)
                    ->setCreatedAt(new DateTimeImmutable())
                ;

                $this->entityManager->persist($newGenre);
            }
        }
    }
}
