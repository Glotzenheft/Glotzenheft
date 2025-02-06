import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatting',
})
export class DateFormattingPipe implements PipeTransform {
  transform(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
