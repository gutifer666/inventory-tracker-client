import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { LoginService } from '../../../share/services/login/login.service';

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

    constructor(private loginService: LoginService, private router: Router) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] }]
            },
            {
                label: 'Administrar',
                items: [
                    { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/admin/user'] },
                    { label: 'Productos', icon: 'pi pi-fw pi-check-square', routerLink: ['/admin/product'] },
                    { label: 'Categorías', icon: 'pi pi-fw pi-tags', routerLink: ['/admin/category'] },
                    { label: 'Proveedores', icon: 'pi pi-fw pi-briefcase', routerLink: ['/admin/supplier'] }
                ]
            },
            {
                label: 'Acciones',
                items: [
                    { label: 'Exportar PDF', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/admin/pdf'] },
                    { label: 'Documentación', icon: 'pi pi-fw pi-file', routerLink: ['/admin/documentation'] },
                    {
                        label: 'Log Out',
                        icon: 'pi pi-fw pi-sign-out',
                        command: () => this.logout()
                    }
                ]
            }
        ];
    }

    logout() {
        this.loginService.logout();
        this.router.navigate(['/login']);
    }
}
