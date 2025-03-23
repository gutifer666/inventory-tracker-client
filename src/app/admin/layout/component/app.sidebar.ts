import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
    selector: 'app-admin-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` <div class="layout-sidebar">
        <app-admin-menu></app-admin-menu>
    </div>`
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
