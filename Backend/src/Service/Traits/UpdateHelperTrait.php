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

namespace App\Service\Traits;

use DateTimeInterface;

trait UpdateHelperTrait
{
    /**
     * Vergleicht einen neuen Wert mit einem bestehenden und ruft den Setter nur bei einer Änderung auf.
     * Aktualisiert eine als Referenz übergebene "isChanged"-Flag.
     *
     * @param bool $isChanged
     * @param callable $setter
     * @param mixed $currentValue
     * @param mixed $newValue
     * @return void
     */
    protected function setPropertyIfChanged(
        bool     &$isChanged,
        callable $setter,
        mixed    $currentValue,
        mixed    $newValue
    ): void
    {
        if ($currentValue instanceof DateTimeInterface && $newValue instanceof DateTimeInterface)
        {
            if ($currentValue->getTimestamp() !== $newValue->getTimestamp())
            {
                $setter($newValue);
                $isChanged = true;
            }
            return;
        }

        if ($currentValue !== $newValue)
        {
            $setter($newValue);
            $isChanged = true;
        }
    }
}