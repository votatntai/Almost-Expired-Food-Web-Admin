import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent {
    deviceToken: string;

    /**
     * Constructor
     */
    constructor(private _appService: AppService) {
        // Request permission for notification in browser
        this._appService.requestPermission();
        // Listen service worker when new nofification are sent to
        this._appService.listenServiceWorker();
    }

    ngOnInit(): void {
        this._appService.notifications$.subscribe(notification => {
        })
    }
}
