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

namespace App\Tests\Unit\Service\Backup;

use App\Service\Backup\HashService;
use PHPUnit\Framework\TestCase;

class HashServiceTest extends TestCase
{
    private HashService $hashService;

    protected function setUp(): void
    {
        $this->hashService = new HashService();
    }

    public function testGenerateForData(): void
    {
        // Arrange
        $data = ['foo' => 'bar', 'baz' => 123];
        $expectedHash = hash('sha256', json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

        // Act
        $actualHash = $this->hashService->generateForData($data);

        // Assert
        $this->assertEquals($expectedHash, $actualHash);
    }

    public function testGenerateForContent(): void
    {
        // Arrange
        $content = 'this is a test string';
        $expectedHash = hash('sha256', $content);

        // Act
        $actualHash = $this->hashService->generateForContent($content);

        // Assert
        $this->assertEquals($expectedHash, $actualHash);
    }

    public function testGenerateForDataIsConsistent(): void
    {
        // Arrange
        $data = ['a' => 1, 'b' => 2];

        // Act
        $hash1 = $this->hashService->generateForData($data);
        $hash2 = $this->hashService->generateForData($data);

        // Assert
        $this->assertSame($hash1, $hash2);
    }
}
