import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stringFormatting'
})
export class StringFormattingPipe implements PipeTransform {
    private readonly SPLITT_LENGTH: number = 4;

    transform(value: number | string): string {
        return value.toString().length > this.SPLITT_LENGTH ? `${value.toString().slice(0, this.SPLITT_LENGTH)}...` : value.toString()
    }

}
