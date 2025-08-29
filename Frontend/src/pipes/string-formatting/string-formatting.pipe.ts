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

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stringFormatting',
})
export class StringFormattingPipe implements PipeTransform {
    private readonly SPLITT_LENGTH: number = 4;

    transform(value: number | string): string {
        return value.toString().length > this.SPLITT_LENGTH
            ? `${value.toString().slice(0, this.SPLITT_LENGTH)}...`
            : value.toString();
    }
}
