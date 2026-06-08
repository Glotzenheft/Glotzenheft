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
