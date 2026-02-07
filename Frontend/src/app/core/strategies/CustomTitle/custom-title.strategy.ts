import {Injectable} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {RouterStateSnapshot, TitleStrategy} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class CustomTitleStrategy extends TitleStrategy {

    constructor(private readonly title: Title) {
        super();
    }

    override updateTitle(snapshot: RouterStateSnapshot): void {
        const titleFromRoute = this.buildTitle(snapshot);

        if (titleFromRoute) {
            this.title.setTitle(`${titleFromRoute} - Glotzenheft`);
        } else {
            this.title.setTitle('Glotzenheft');
        }
    }
}
