import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
    selector: 'app-employee-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` <div class="layout-sidebar">
        <app-employee-menu></app-employee-menu>
    </div>`
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
