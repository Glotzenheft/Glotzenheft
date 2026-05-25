import {Pipe, PipeTransform} from '@angular/core';
import * as i18nIsoLanguages from '@cospired/i18n-iso-languages';

import de from '@cospired/i18n-iso-languages/langs/de.json'

i18nIsoLanguages.registerLocale(de);

@Pipe({
    name: 'languageName',
    standalone: true
})
export class LanguageNamePipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value || value === '-') return '-';

        const name = i18nIsoLanguages.getName(value, 'de');

        return name ? name : value;
    }
}
