<?php declare(strict_types=1);

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