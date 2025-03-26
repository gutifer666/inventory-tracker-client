import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Inventory Tracker by
        <a href="https://javiergutierrez.trade/" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Javier Gutiérrez</a>
    </div>`
})
export class AppFooter {}
