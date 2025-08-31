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

namespace App\Model\Request\Backup;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

class ImportBackupDto
{
    public function __construct(
        #[Assert\NotBlank(message: 'No file uploaded.')]
        #[Assert\File(
            maxSize: '10M',
            mimeTypes: ['application/json'],
            mimeTypesMessage: 'Please upload a valid JSON file.'
        )]
        public ?UploadedFile $backupFile = null
    ) {
    }
}
