<?php declare(strict_types=1);

namespace App\EventListener;

use App\TmdbApi\ApiException;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

#[AsEventListener(event: KernelEvents::EXCEPTION, method: 'onKernelException')]
readonly class ApiExceptionListener
{
    public function __construct(
        private LoggerInterface $logger
    ){}

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        if (!$exception instanceof ApiException)
        {
            return;
        }

        $this->logger->error(
            'TMDB API Exception: {message}',
            ['message' => $exception->getMessage()]
        );

        $errorResponse = new JsonResponse(
            ['error' => 'An error occurred with the external TMDB service.'],
            Response::HTTP_BAD_GATEWAY
        );

        $event->setResponse($errorResponse);
    }
}