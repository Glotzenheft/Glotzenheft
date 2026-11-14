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

import {
    afterNextRender,
    DestroyRef,
    Directive,
    ElementRef,
    inject,
} from '@angular/core';

/** Keep the inherited font size until the actual text exceeds its available width. */
@Directive({
    selector: '[appFitSingleLineText]',
    standalone: true,
})
export class FitSingleLineTextDirective {
    private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        afterNextRender(() => {
            const text = this.element.nativeElement;
            const row = text.parentElement;
            if (!row) return;

            const fit = () => {
                text.style.fontSize = 'inherit';
                const style = getComputedStyle(row);
                const available =
                    row.clientWidth -
                    parseFloat(style.paddingLeft) -
                    parseFloat(style.paddingRight);
                const required = text.getBoundingClientRect().width;
                if (available > 0 && required > available) {
                    const baseSize = parseFloat(
                        getComputedStyle(text).fontSize,
                    );
                    text.style.fontSize = `${(baseSize * available) / required}px`;
                }
            };
            const resize = new ResizeObserver(fit);
            const mutation = new MutationObserver(fit);
            resize.observe(row);
            mutation.observe(text, {
                childList: true,
                characterData: true,
                subtree: true,
            });
            fit();
            this.destroyRef.onDestroy(() => {
                resize.disconnect();
                mutation.disconnect();
            });
        });
    }
}
