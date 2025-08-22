import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'titleFormatting'
})
export class TitleFormattingPipe implements PipeTransform {
    private STRING_SPLITT: number = 14;

    transform(value: string): string {
        return value.length > this.STRING_SPLITT ? `${value.slice(0, this.STRING_SPLITT)}...` : value;
    }

}
