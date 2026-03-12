import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateTimeWithUnitFormatting',
})
export class DatetimeWithUnitFormattingPipe implements PipeTransform {
    transform(date: string): string {
        if (!date) return '';

        const _date = new Date(date);

        if (isNaN(_date.getTime())) return '';

        const datePart = _date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

        const timePart = _date.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit',
        });

        return `${datePart} ${timePart}\u00A0Uhr`;
    }
}
