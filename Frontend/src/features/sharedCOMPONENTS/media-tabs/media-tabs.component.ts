import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabList, TabsModule } from 'primeng/tabs';

@Component({
    selector: 'app-media-tabs',
    imports: [TabsModule, FormsModule],
    templateUrl: './media-tabs.component.html',
    styleUrl: './media-tabs.component.css',
    providers: []
})
export class MediaTabsComponent {
    public value: number = 0; // = 0: tracklisten; = 1: recommendations; = 2: other

    public onChangeTab = (event: string) => {
        console.log(event)
    }
}
