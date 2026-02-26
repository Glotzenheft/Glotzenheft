<?php

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
     * oder eine leere Antwort (204) zurückgibt, basierend auf den
     * Client-Präferenzen im Query oder Header.
     *
     * @param Request $request
     * @param mixed $data
     * @param int $successStatus
     * @param array $context
     * @return JsonResponse
     */
    private function createConditionalResponse(
        Request $request,
        mixed $data,
        int $successStatus,
        array $context = []
    ): JsonResponse {
        $wantsMinimalByQuery = $request->query->get('return') === 'minimal';
        $preferHeader = $request->headers->get(
            key: 'Prefer',
            default: ''
        );
        $wantsMinimalByHeader = str_contains($preferHeader, 'return=minimal');

        if ($wantsMinimalByQuery || $wantsMinimalByHeader) {
            return $this->json(
                data: null,
                status: Response::HTTP_NO_CONTENT
            );
        }

        return $this->json(
            data: $data,
            status: $successStatus,
            context: $context
        );
    }
}