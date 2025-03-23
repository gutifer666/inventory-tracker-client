import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-admin-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-admin-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] }]
            },
            {
                label: 'Administrar',
                items: [
                    { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/admin'] },
                    { label: 'Productos', icon: 'pi pi-fw pi-check-square', routerLink: ['/admin/product'] }
                ]
            },
            {
                label: 'Acciones',
                items: [
                    { label: 'Exportar PDF', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/admin'] },
                    { label: 'Documentación', icon: 'pi pi-fw pi-file', routerLink: ['/admin/documentation'] },
                    { label: 'Log Out', icon: 'pi pi-fw pi-sign-out', routerLink: ['/'] }
                ]
            }
        ];
    }
}
