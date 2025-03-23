import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-employee-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-employee-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
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
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/employee'] }]
            },
            {
                label: 'Administrar',
                items: [
                    { label: 'Transacción', icon: 'pi pi-fw pi-user', routerLink: ['/employee'] },
                    { label: 'Profile', icon: 'pi pi-fw pi-check-square', routerLink: ['/employee'] }
                ]
            },
            {
                label: 'Acciones',
                items: [
                    { label: 'Imprimir Factura', icon: 'pi pi-fw pi-print', routerLink: ['/employee'] },
                    { label: 'Documentación', icon: 'pi pi-fw pi-file', routerLink: ['/employee/documentation'] },
                    { label: 'Log Out', icon: 'pi pi-fw pi-sign-out', routerLink: ['/login'] }
                ]
            },
        ];
    }
}
