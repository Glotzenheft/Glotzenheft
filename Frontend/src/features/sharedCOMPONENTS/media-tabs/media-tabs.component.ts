import { Component, input, InputSignal, OnInit, output, OutputEmitterRef } from '@angular/core';
import { TabsModule } from 'primeng/tabs';

@Component({
    selector: 'app-media-tabs',
    imports: [TabsModule],
    templateUrl: './media-tabs.component.html',
    styleUrl: './media-tabs.component.css'
})
export class MediaTabsComponent implements OnInit {
    public currentTab: string = "";

    // input variables
    public inpTabList: InputSignal<string[]> = input.required<string[]>();

    // output variables
    public outChangeTab: OutputEmitterRef<string> = output<string>();

    ngOnInit(): void {
        this.currentTab = this.inpTabList()[0];
    }

    public onChangeTab = (event: string | number) => {
        this.currentTab = event.toString();
        this.outChangeTab.emit(event.toString());
    }
}
