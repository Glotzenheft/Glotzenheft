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
