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
    name: 'dollarCurrency',
    standalone: true
})
export class DollarCurrencyPipe implements PipeTransform {
    transform(value: number | string | null | undefined): string {
        const amount = Number(value);

        if (!Number.isFinite(amount) || amount <= 0) {
            return '-';
        }

        const units = [
            {divisor: 1_000, suffix: 'Tsd.'},
            {divisor: 1_000_000, suffix: 'Mio.'},
            {divisor: 1_000_000_000, suffix: 'Mrd.'},
            {divisor: 1_000_000_000_000, suffix: 'Bio.'}
        ];

        let unitIndex = -1;
        for (let index = 0; index < units.length; index++) {
            if (amount >= units[index].divisor) {
                unitIndex = index;
            }
        }
        if (unitIndex === -1) {
            const roundedAmount = Math.round(amount);
            return roundedAmount === 1_000 ? '$1 Tsd.' : `$${roundedAmount}`;
        }

        let compactAmount = Math.round(amount / units[unitIndex].divisor);
        if (compactAmount === 1_000 && unitIndex < units.length - 1) {
            unitIndex++;
            compactAmount = Math.round(amount / units[unitIndex].divisor);
        }

        return `$${compactAmount} ${units[unitIndex].suffix}`;
    }

}
