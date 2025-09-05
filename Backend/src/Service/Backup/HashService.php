<?php

declare(strict_types=1);

namespace App\Service\Backup;

class HashService
{
    /**
     * Generates a SHA256 hash for a given data array.
     * The array is encoded to a JSON string before hashing.
     *
     * @param array $data
     * @return string
     */
    public function generateForData(array $data): string
    {
        $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        return hash('sha256', $json);
    }

    /**
     * Generates a SHA256 hash for a raw string content.
     *
     * @param string $content
     * @return string
     */
    public function generateForContent(string $content): string
    {
        return hash('sha256', $content);
    }
}