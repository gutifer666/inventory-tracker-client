import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { LoginService } from '../../../share/services/login/login.service';

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

    constructor(private loginService: LoginService, private router: Router) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/employee'] }]
            },
            {
                label: 'Administrar',
                items: [
                    { label: 'Nueva Transacción', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/employee/transaction'] },
                    { label: 'Editar Perfil', icon: 'pi pi-fw pi-user', routerLink: ['/employee/edit-profile'] }
                ]
            },
            {
                label: 'Acciones',
                items: [
                    { label: 'Imprimir Factura', icon: 'pi pi-fw pi-print', routerLink: ['/employee/print-invoice'] },
                    { label: 'Documentación', icon: 'pi pi-fw pi-file', routerLink: ['/employee/documentation'] },
                    {
                        label: 'Log Out',
                        icon: 'pi pi-fw pi-sign-out',
                        command: () => this.logout()
                    }
                ]
            },
        ];
    }

    logout() {
        this.loginService.logout();
        this.router.navigate(['/login']);
    }
}
