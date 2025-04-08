import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { User, UserService } from '../../../../share/services/user/user.service';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-user-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="Nuevo" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Borrar" icon="pi pi-trash" outlined (onClick)="deleteSelectedUsers()" [disabled]="!selectedUsers || !selectedUsers.length" />
            </ng-template>

            <ng-template #end>
                <p-button label="CSV" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="users()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['username', 'password', 'roles', 'fullName']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedUsers"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Administrar Usuarios</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Buscar..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th pSortableColumn="username" style="min-width: 16rem">
                        Nombre del Usuario
                        <p-sortIcon field="username" />
                    </th>
                    <th pSortableColumn="password" style="min-width:16rem">
                        Contraseña
                        <p-sortIcon field="password" />
                    </th>
                    <th pSortableColumn="roles" style="min-width: 8rem">
                        Rol
                        <p-sortIcon field="roles" />
                    </th>
                    <th pSortableColumn="fullName" style="min-width:10rem">
                        Nombre Completo
                        <p-sortIcon field="fullName" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-user>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="user" />
                    </td>
                    <td style="min-width: 16rem">{{ user.username }}</td>
                    <td style="min-width: 16rem">{{ user.password }}</td>
                    <td style="min-width: 16rem">{{ user.roles }}</td>
                    <td style="min-width: 16rem">{{ user.fullName }}</td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editUser(user)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteUser(user)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="userDialog" [style]="{ width: '450px' }" header="Detalles del Producto" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="username" class="block font-bold mb-3">Nombre de Usuario</label>
                        <input type="text" pInputText id="username" [(ngModel)]="user.username" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !user.username">Nombre requerido.</small>
                    </div>

                    <div>
                        <label for="password" class="block font-bold mb-3">Contraseña</label>
                        <textarea id="password" pTextarea [(ngModel)]="user.password" required rows="1" cols="20" fluid></textarea>
                    </div>

                    <div>
                        <span class="block font-bold mb-4">Rol</span>
                        <div class="grid grid-cols-12 gap-4">
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="rol1" name="rol" value="ROLE_ADMIN" [(ngModel)]="user.roles" />
                                <label for="rol1">Administrador</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="rol2" name="rol" value="ROLE_EMPLOYEE" [(ngModel)]="user.roles" />
                                <label for="rol2">Empleado</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="rol3" name="rol" value="ROLE_CUSTOMER" [(ngModel)]="user.roles" />
                                <label for="rol3">Cliente</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label for="fullName" class="block font-bold mb-3">Nombre Completo</label>
                        <input type="text" pInputText id="fullName" [(ngModel)]="user.fullName" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !user.fullName">Nombre Completo requerido.</small>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Añadir" icon="pi pi-check" (click)="saveUser()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, UserService, ConfirmationService]
})
export class UserCrud implements OnInit {
    userDialog: boolean = false;

    users = signal<User[]>([]);

    user!: User;

    selectedUsers!: User[] | null;

    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.userService.getUsers().subscribe((data) => {
            this.users.set(data);
        });

        this.cols = [
            { field: 'username', header: 'Nombre de Usuario', customExportHeader: 'User Name' },
            { field: 'password', header: 'Contraseña' },
            { field: 'roles', header: 'Rol' },
            { field: 'fullName', header: 'Nombre Completo' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.user = {
            id: 0,
            username: '',
            password: '',
            roles: '',
            fullName: '',
            sales: 0,
            earnings: 0
        };
        this.submitted = false;
        this.userDialog = true;
    }

    editUser(user: User) {
        this.user = { ...user };
        this.userDialog = true;
    }

    deleteSelectedUsers() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected userrs?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedUsers?.forEach((prod) => {
                    this.userService.deleteUser(prod.id).subscribe();
                });
                this.loadDemoData();
                this.selectedUsers = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    deleteUser(user: User) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + user.username + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userService.deleteUser(user.id).subscribe((success) => {
                    if (success) {
                        this.loadDemoData();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Deleted',
                            life: 3000
                        });
                    }
                });
                this.user = {
                    id: 0,
                    username: '',
                    password: '',
                    roles: '',
                    fullName: '',
                    sales: 0,
                    earnings: 0
                };
            }
        });
    }

    saveUser() {
        this.submitted = true;
        let _users = this.users();
        if (this.user.username?.trim()) {
            if (this.user.id) {
                this.userService.updateUser(this.user).subscribe((updatedUser) => {
                    this.loadDemoData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Updated',
                        life: 3000
                    });
                });
            } else {
                this.userService.addUser(this.user).subscribe((newProduct) => {
                    this.loadDemoData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'User Created',
                        life: 3000
                    });
                });
            }
            this.userDialog = false;
            this.user = {
                id: 0,
                username: '',
                password: '',
                roles: '',
                fullName: '',
                sales: 0,
                earnings: 0
            };
        }
    }
}
