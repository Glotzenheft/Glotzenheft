<?php

declare(strict_types=1);

namespace App\Controller\API\Tracklist;

use App\Security\IsAuthenticated;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TracklistEpisodeController extends AbstractController
{
    #[Route('/tracklist-episode')]
    #[IsAuthenticated]
    public function index(): Response
    {
        return $this->render('tracklist_episode/index.html.twig');
    }
}
