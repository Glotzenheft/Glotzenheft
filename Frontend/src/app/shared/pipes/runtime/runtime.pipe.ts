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

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'runtime',
    standalone: true
})
export class RuntimePipe implements PipeTransform {
    transform(
        value: number | null | undefined,
        format: 'compact' | 'detailed' | 'multiline' = 'compact',
    ): string {
        if (value == null || value < 0 || (value === 0 && format === 'compact')) {
            return format === 'compact' ? '' : '–';
        }

        const total = `${value} Min.`;
        const hours = Math.floor(value / 60);
        if (hours === 0) return total;

        const minutes = value % 60;
        const duration = minutes ? `${hours} Std. ${minutes} Min.` : `${hours} Std.`;
        if (format === 'compact') return duration;

        const separator = format === 'multiline' ? '\n' : ' ';
        return `${total}${separator}(${duration})`;
    }
}
