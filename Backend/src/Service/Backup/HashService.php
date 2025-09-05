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