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
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace App\EventListener;

use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Validator\Exception\ValidationFailedException;

#[AsEventListener(event: KernelEvents::EXCEPTION, method: 'onKernelException')]
readonly class ValidationExceptionListener
{
    public function __construct(
        private LoggerInterface $logger
    ){}

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        if (!$exception instanceof HttpException)
        {
            return;
        }

        $previous = $exception->getPrevious();
        if (!$previous instanceof ValidationFailedException)
        {
            return;
        }

        $errors = [];
        foreach ($previous->getViolations() as $violation)
        {
            $errors[$violation->getPropertyPath()] = $violation->getMessage();
        }

        $this->logger->error(
            'API Validation Exception: {errors}',
            ['errors' => $errors]
        );

        $response = new JsonResponse(
            ['errors' => $errors],
            Response::HTTP_UNPROCESSABLE_ENTITY
        );

        $event->setResponse($response);
    }
}