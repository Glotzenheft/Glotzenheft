import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateFormatting',
})
export class DateFormattingPipe implements PipeTransform {
    transform(date: string): string {
        return new Date(date).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}
