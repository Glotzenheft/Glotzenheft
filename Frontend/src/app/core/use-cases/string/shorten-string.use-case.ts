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
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Inject, Injectable } from "@angular/core";
import { I_StringRepository, IT_STRING_REPOSITORY } from "../../interfaces/string.repository";

@Injectable()
export class UC_ShortenString {
    constructor(@Inject(IT_STRING_REPOSITORY) private readonly stringRepository: I_StringRepository) { }

    public execute = (str: string): string => { return this.stringRepository.shortenString(str) }
}