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

namespace App\Controller\API\Traits;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * @mixin AbstractController
 */
trait ConditionalResponseTrait
{
    /**
     * Erstellt eine HTTP-Antwort, die entweder das volle Datenobjekt (2xx)
     * oder eine leere Antwort (204) zurückgibt, wenn es kein POST-Endpunkt ist,
     * basierend auf den Client-Präferenzen im Query oder Header.
     *
     * @param Request $request
     * @param mixed $data
     * @param int $successStatus
     * @param array $context
     * @param string|null $locationUrl
     * @return Response|JsonResponse
     */
    private function createConditionalResponse(
        Request $request,
        mixed $data,
        int $successStatus,
        array $context = [],
        ?string $locationUrl = null
    ): Response|JsonResponse
    {
        $wantsMinimalByQuery = $request->query->get(key: 'return') === 'minimal';
        $preferHeader = $request->headers->get(
            key: 'Prefer',
            default: ''
        );
        $wantsMinimalByHeader = str_contains($preferHeader, 'return=minimal');

        if ($wantsMinimalByQuery || $wantsMinimalByHeader)
        {
            $minimalStatus = $successStatus === Response::HTTP_CREATED
                ? Response::HTTP_CREATED
                : Response::HTTP_NO_CONTENT;

            $response = new Response(
                content: '',
                status: $minimalStatus
            );

            if ($minimalStatus === Response::HTTP_CREATED && $locationUrl !== null)
            {
                $response->headers->set(
                    key: 'Location',
                    values: $locationUrl
                );
            }

            return $response;
        }

        return $this->json(
            data: $data,
            status: $successStatus,
            context: $context
        );
    }
}