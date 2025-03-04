<?php declare(strict_types=1);

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

trait RequestTrait
{
    public function __construct
    (
        private readonly EntityManagerInterface $entityManager
    )
    {
    }

    private array $data = [];
    private function handleRequest(Request $request): array
    {
        $body = json_decode($request->getContent(), true);

        $userSecurityQuestion = $body['security_question'] ?? null;

        $userSecurityAnswer = $body['security_answer'] ?? null;

        $newPassword = $body['new_password'] ?? null;

        $tracklistName = $request->query->get('tracklist_name') ?: null;

        $tracklistID = filter_var($request->query->get('tracklist_id'), FILTER_VALIDATE_INT) ?: null;

        $tracklistSeasonID = filter_var($request->query->get('tracklist_season_id'), FILTER_VALIDATE_INT) ?: null;

        $userID = $request->attributes->get('user_id') ?: null;

        $mediaID = filter_var($request->query->get('media_id'), FILTER_VALIDATE_INT) ?: null;

        $seasonID = filter_var($request->query->get('season_id'), FILTER_VALIDATE_INT) ?: null;

        $episodeID = filter_var($request->query->get('episode_id'), FILTER_VALIDATE_INT) ?: null;

        $tracklistEpisodeID = filter_var($request->query->get('tracklist_episode_id'), FILTER_VALIDATE_INT) ?: null;

        $mediaType = $request->query->get('media_type') ?: null;

        $tracklistStatus = $request->query->get('tracklist_status') ?: null;

        $tracklistRating = filter_var($request->query->get('tracklist_rating'), FILTER_VALIDATE_INT) ?: null;

        $tracklistStartDate = $request->query->get('tracklist_start_date') ?: null;

        $tracklistFinishDate = $request->query->get('tracklist_finish_date') ?: null;

        $watchDate = $request->query->get('watch_date') ?: null;

        $statisticPeriodStartDate = $request->query->get('period_start_date') ?: null;

        $statisticPeriodEndDate = $request->query->get('period_end_date') ?: null;

        $userActivityPage = filter_var($request->query->get('user_activity_page'), FILTER_VALIDATE_INT) ?: null;

        return [
            'user_id' => $userID,
            'security_question' => $userSecurityQuestion,
            'security_answer' => $userSecurityAnswer,
            'new_password' => $newPassword,
            'tracklist_name' => $tracklistName,
            'tracklist_id' => $tracklistID,
            'tracklist_season_id' => $tracklistSeasonID,
            'tracklist_episode_id' => $tracklistEpisodeID,
            'media_id' => $mediaID,
            'media_type' => $mediaType,
            'season_id' => $seasonID,
            'episode_id' => $episodeID,
            'tracklist_status' => $tracklistStatus,
            'tracklist_rating' => $tracklistRating,
            'tracklist_start_date' => $tracklistStartDate,
            'tracklist_finish_date' => $tracklistFinishDate,
            'watch_date' => $watchDate,
            'period_start_date' => $statisticPeriodStartDate,
            'period_end_date' => $statisticPeriodEndDate,
            'user_activity_page' => $userActivityPage,
        ];
    }

    private function returnInvalidRequest(): array
    {
        return [
            'error' => 'Invalid request',
            'code' => Response::HTTP_BAD_REQUEST
        ];
    }

    private function returnDatabaseError(): array
    {
        return [
            'error' => 'Database error occurred.',
            'code' => Response::HTTP_INTERNAL_SERVER_ERROR
        ];
    }

    private function returnUserNotFound(): array
    {
        return [
            'error' => 'User not found',
            'code' => Response::HTTP_NOT_FOUND
        ];
    }

    private function returnTracklistIDNotProvided(): array
    {
        return [
            'error' => 'TracklistID not provided.',
            'code' => Response::HTTP_BAD_REQUEST
        ];
    }

    private function returnTracklistSeasonIDNotProvided(): array
    {
        return [
            'error' => 'TracklistSeasonID not provided.',
            'code' => Response::HTTP_BAD_REQUEST
        ];
    }

    private function returnTracklistEpisodeIDNotProvided(): array
    {
        return [
            'error' => 'TracklistEpisodeID not provided.',
            'code' => Response::HTTP_BAD_REQUEST
        ];
    }

    private function returnInvalidTracklistStatus(): array
    {
        return[
            'error' => 'Invalid tracklist status',
            'code'  => Response::HTTP_BAD_REQUEST
        ];
    }

    private function returnMediaNotFound(): array
    {
        return [
            'error' => 'Media not found',
            'code' => Response::HTTP_NOT_FOUND
        ];
    }

    private function returnSeasonIDNotProvided(): array
    {
        return [
            'error' => 'Parameter season_id not provided.',
            'code' => Response::HTTP_BAD_REQUEST
        ];
    }

    private function returnTracklistIDProvided(): array
    {
        return [
            'error' => 'Tracklist ID provided, even though create tracklist endpoint used!',
            'code' => Response::HTTP_BAD_REQUEST
        ];
    }

    private function returnInvalidMediaType(): array
    {
        return [
            'error' => 'Invalid media type',
            'code' => Response::HTTP_BAD_REQUEST
        ];
    }

    private function returnTracklistNotFound(): array
    {
        return [
            'error' => 'Tracklist not found',
            'code' => Response::HTTP_NOT_FOUND
        ];
    }

    private function returnSeasonNotFound(): array
    {
        return [
            'error' => 'Season not found',
            'code' => Response::HTTP_NOT_FOUND
        ];
    }

    private function returnWrongTracklistTracklistSeason(): array
    {
        return [
            'error' => 'Provided tracklist season does not belong to the tracklist.',
            'code' => Response::HTTP_CONFLICT
        ];
    }

    private function returnWrongMediaSeason(): array
    {
        return [
            'error' => 'Provided season_id does not belong to the media_id.',
            'code' => Response::HTTP_CONFLICT
        ];
    }

    private function returnWrongTracklistSeasonTracklistEpisode(): array
    {
        return [
            'error' => 'Provided tracklist_episode_id does not belong to the tracklist_season_id.',
            'code' => Response::HTTP_CONFLICT
        ];
    }

    private function returnWrongSeasonEpisode(): array
    {
        return [
            'error' => 'Provided season_id does not belong to the episode_id.',
            'code' => Response::HTTP_CONFLICT
        ];
    }

    private function returnTracklistSeasonNotFound(): array
    {
        return [
            'error' => 'TracklistSeason not found',
            'code' => Response::HTTP_NOT_FOUND
        ];
    }

    private function returnEpisodeNotFound(): array
    {
        return [
            'error' => 'Episode not found',
            'code' => Response::HTTP_NOT_FOUND
        ];
    }

    private function returnTracklistEpisodeNotFound(): array
    {
        return [
            'error' => 'Tracklist episode not found',
            'code' => Response::HTTP_NOT_FOUND
        ];
    }

    private function returnUserDeleteError(): array
    {
        return [
            'error' => 'There was an error while deleting the user. Please try again.',
            'code' => Response::HTTP_INTERNAL_SERVER_ERROR
        ];
    }

    private function returnTracklistDeleteError(): array
    {
        return [
            'error' => 'There was an error while deleting the tracklist. Please try again.',
            'code' => Response::HTTP_INTERNAL_SERVER_ERROR
        ];
    }

    private function returnTracklistEpisodeDeleteError(): array
    {
        return [
            'error' => 'There was an error while deleting the tracklist episode. Please try again.',
            'code' => Response::HTTP_INTERNAL_SERVER_ERROR
        ];
    }

    private function returnPasswordChangeError(): array
    {
        return [
            'error' => 'There was an error while changing the password. Please try again.',
            'code' => Response::HTTP_INTERNAL_SERVER_ERROR
        ];
    }

    private function returnWatchDateError(): array
    {
        return [
            'error' => 'There was an error while creating the watch date. Please try again with a ISO 8601 format.',
            'code' => Response::HTTP_BAD_REQUEST
        ];
    }

    private function returnTracklistEpisodeAlreadyExistsError(): array
    {
        return [
            'error' => 'There is already an tracklist episode entry for this episode.',
            'code' => Response::HTTP_CONFLICT,
        ];
    }

    private function returnUserNotAuthorized(): array
    {
        return [
            'error' => 'The user is not authorized to do this for another user.',
            'code' => Response::HTTP_FORBIDDEN
        ];
    }

    private function returnInvalidRating(): array
    {
        return [
            'error' => 'Invalid rating provided. Rating must be between 1 and 10.',
            'code' => Response::HTTP_BAD_REQUEST
        ];
    }

    private function returnInvalidDate(): array
    {
        return [
            'error' => 'Invalid date provided. Use the following format: Y-m-d.',
            'code' => Response::HTTP_BAD_REQUEST
        ];
    }

    private function validateRequest(): bool
    {
        if (!isset($this->data['user_id'], $this->data['security_question'], $this->data['security_answer']))
        {
            return false;
        }

        $user = $this->entityManager->getRepository(User::class)->find($this->data['user_id']);
        if (!$user instanceof User)
        {
            return false;
        }
        $this->data['user'] = $user;

        $securityQuestion = $user->getSecurityQuestion()->value;
        if ($securityQuestion !== $this->data['security_question'])
        {
            return false;
        }

        $securityAnswer = $this->data['security_answer'];
        if (!$securityAnswer || !password_verify($securityAnswer, $user->getSecurityAnswer()))
        {
            return false;
        }

        return true;
    }
}