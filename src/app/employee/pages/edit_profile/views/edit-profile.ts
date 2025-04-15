import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services
import { UserService} from '../../../../share/services/user/user.service';
import { LoginService } from '../../../../share/services/login/login.service';

// Interfaces
import { User } from '../../../../share/interfaces/user.interface';

@Component({
    selector: 'app-edit-profile',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        CardModule,
        ToastModule
    ],
    providers: [MessageService, UserService, LoginService],
    template: `
        <div class="p-4 md:p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-semibold">Editar Perfil</h1>
            </div>

            <div class="card shadow-md p-4">
                <form (ngSubmit)="saveProfile()" #profileForm="ngForm">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Nombre de Usuario -->
                        <div class="field col-span-1">
                            <label for="username" class="block text-lg font-medium mb-2">Nombre de Usuario</label>
                            <input
                                pInputText
                                id="username"
                                [(ngModel)]="user.username"
                                name="username"
                                required
                                class="w-full p-inputtext-lg"
                                placeholder="Nombre de usuario"
                                [disabled]="true"
                            />
                        </div>

                        <!-- Nombre Completo -->
                        <div class="field col-span-1">
                            <label for="fullName" class="block text-lg font-medium mb-2">Nombre Completo</label>
                            <input
                                pInputText
                                id="fullName"
                                [(ngModel)]="user.fullName"
                                name="fullName"
                                required
                                class="w-full p-inputtext-lg"
                                placeholder="Nombre completo"
                            />
                            <small *ngIf="submitted && !user.fullName" class="p-error">El nombre completo es requerido.</small>
                        </div>

                        <!-- Contraseña -->
                        <div class="field col-span-1">
                            <label for="password" class="block text-lg font-medium mb-2">Contraseña</label>
                            <input
                                pInputText
                                type="password"
                                id="password"
                                [(ngModel)]="password"
                                name="password"
                                class="w-full p-inputtext-lg"
                                placeholder="Dejar en blanco para mantener la actual"
                            />
                        </div>

                        <!-- Confirmar Contraseña -->
                        <div class="field col-span-1">
                            <label for="confirmPassword" class="block text-lg font-medium mb-2">Confirmar Contraseña</label>
                            <input
                                pInputText
                                type="password"
                                id="confirmPassword"
                                [(ngModel)]="confirmPassword"
                                name="confirmPassword"
                                class="w-full p-inputtext-lg"
                                placeholder="Confirmar contraseña"
                            />
                            <small *ngIf="passwordMismatch" class="p-error">Las contraseñas no coinciden.</small>
                        </div>
                    </div>

                    <!-- Información de Estadísticas (Solo lectura) -->
                    <div class="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <h3 class="text-xl font-medium mb-4">Estadísticas</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="field col-span-1">
                                <label class="block text-lg font-medium mb-2">Ventas Totales</label>
                                <div class="text-xl">{{ user.sales }}</div>
                            </div>
                            <div class="field col-span-1">
                                <label class="block text-lg font-medium mb-2">Ganancias Totales</label>
                                <div class="text-xl">€{{ user.earnings }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end mt-6 gap-2">
                        <p-button
                            label="Cancelar"
                            icon="pi pi-times"
                            (onClick)="cancel()"
                            styleClass="p-button-outlined p-button-secondary"
                        ></p-button>
                        <p-button
                            type="submit"
                            label="Guardar"
                            icon="pi pi-check"
                        ></p-button>
                    </div>
                </form>
            </div>
        </div>

        <p-toast></p-toast>
    `
})
export class EditProfile implements OnInit {
    user: User = {
        id: 0,
        username: '',
        password: '',
        roles: '',
        fullName: '',
        sales: 0,
        earnings: 0
    };

    password: string = '';
    confirmPassword: string = '';
    submitted: boolean = false;
    passwordMismatch: boolean = false;

    constructor(
        private userService: UserService,
        private loginService: LoginService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        const currentUser = this.loginService.getCurrentUser();

        if (currentUser) {
            // Obtener los datos del usuario desde UserService usando el ID del usuario logueado
            this.userService.getUserById(currentUser.id).subscribe(user => {
                if (user) {
                    this.user = { ...user };
                }
            });
        } else {
            console.warn('No hay usuario logueado. Redirigiendo a login.');
            this.router.navigate(['/login']);
        }
    }

    saveProfile() {
        this.submitted = true;
        this.passwordMismatch = false;

        // Validar que el nombre completo no esté vacío
        if (!this.user.fullName?.trim()) {
            return;
        }

        // Validar que las contraseñas coincidan si se está cambiando
        if (this.password) {
            if (this.password !== this.confirmPassword) {
                this.passwordMismatch = true;
                return;
            }
            // Actualizar la contraseña solo si se ha proporcionado una nueva
            this.user.password = this.password;
        }

        // Guardar los cambios
        this.userService.updateUser(this.user).subscribe(
            (updatedUser) => {
                if (updatedUser) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Perfil Actualizado',
                        detail: 'Tu perfil ha sido actualizado correctamente',
                        life: 3000
                    });

                    // Actualizar el nombre completo en el localStorage si es necesario
                    const currentUser = this.loginService.getCurrentUser();
                    if (currentUser && currentUser.fullName !== this.user.fullName) {
                        currentUser.fullName = this.user.fullName;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    }
                }
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ha ocurrido un error al actualizar el perfil',
                    life: 3000
                });
            }
        );
    }

    cancel() {
        this.router.navigate(['/employee']);
    }
}
