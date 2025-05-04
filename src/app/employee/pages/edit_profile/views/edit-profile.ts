import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Services
import { UserService } from '../../../../share/services/user/user.service';
import { LoginService } from '../../../../share/services/login/login.service';
import { AuthService } from '../../../../share/services/auth/auth.service';
import { User } from '../../../../share/interfaces/user.interface';

@Component({
    selector: 'app-edit-profile',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        FluidModule,
        InputTextModule,
        ButtonModule,
        PasswordModule,
        ToastModule,
        ProgressSpinnerModule
    ],
    providers: [MessageService, UserService, LoginService, AuthService],
    template: `
        <p-fluid>
            <div class="flex mt-8">
                <div class="card flex flex-col gap-6 w-full">
                    <div class="font-semibold text-xl">Editar Perfil</div>

                    <div class="flex flex-col md:flex-row gap-6" *ngIf="loading">
                        <div class="flex justify-center w-full">
                            <p-progressSpinner></p-progressSpinner>
                        </div>
                    </div>

                    <div class="flex flex-col gap-6" *ngIf="!loading && currentUser">
                        <div class="flex flex-col md:flex-row gap-6">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="username">Nombre de Usuario</label>
                                <input pInputText id="username" type="text" [value]="currentUser.username" disabled />
                                <small>El nombre de usuario no se puede modificar</small>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-6">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="fullName">Nombre Completo</label>
                                <input pInputText id="fullName" type="text" [(ngModel)]="fullName" />
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-6">
                            <div class="flex flex-wrap gap-2 w-full">
                                <label for="password">Nueva Contraseña</label>
                                <p-password id="password" [(ngModel)]="password" [toggleMask]="true" [feedback]="true"></p-password>
                            </div>
                        </div>

                        <div class="flex gap-2">
                            <p-button label="Guardar Cambios" [fluid]="false" (click)="updateProfile()" [disabled]="submitting"></p-button>
                            <p-button label="Recargar Datos" [fluid]="false" (click)="loadUserData()" severity="secondary"></p-button>
                        </div>
                    </div>
                </div>
            </div>
            <p-toast></p-toast>
        </p-fluid>
    `
})
export class EditProfile implements OnInit {
    currentUser: User | null = null;
    userId: number | null = null;
    fullName: string = '';
    password: string = '';
    loading: boolean = true;
    submitting: boolean = false;

    constructor(
        private userService: UserService,
        private loginService: LoginService,
        private authService: AuthService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getCurrentUserId();
    }

    /**
     * Get the current user ID from the login service
     */
    getCurrentUserId() {
        console.log('Getting current user ID...');

        // Try from LoginService first
        const currentUser = this.loginService.getCurrentUser();
        console.log('Current user from login service:', currentUser);

        if (currentUser && currentUser.id > 0) {
            this.userId = currentUser.id;
            console.log('User ID set from login service to:', this.userId);
            this.loadUserData();
            return;
        }

        // Try to get user from AuthService
        const authUser = this.authService.currentUserValue;
        console.log('Current user from auth service:', authUser);

        if (authUser && authUser.username) {
            // We have a user from AuthService but need to find their ID
            console.log('Getting all users to find match for username:', authUser.username);
            this.userService.getUsers().subscribe({
                next: (users) => {
                    const matchedUser = users.find(u => u.username === authUser.username);
                    if (matchedUser) {
                        this.userId = matchedUser.id;
                        console.log('User ID set from username match to:', this.userId);

                        // Update the stored user with the correct ID
                        const updatedUser = {
                            ...authUser,
                            id: matchedUser.id,
                            fullName: matchedUser.fullName
                        };
                        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

                        // If AuthService has an updateCurrentUser method, use it
                        if (typeof this.authService.updateCurrentUser === 'function') {
                            this.authService.updateCurrentUser(updatedUser);
                        }

                        this.loadUserData();
                    } else {
                        this.setDefaultUserId();
                    }
                },
                error: (error) => {
                    console.error('Error getting users:', error);
                    this.setDefaultUserId();
                }
            });
        } else {
            this.setDefaultUserId();
        }
    }

    /**
     * Set a default user ID for testing
     */
    private setDefaultUserId() {
        console.log('No user found in any service, setting default ID for testing');
        this.userId = 2; // Default ID for testing - using employee ID from logs
        console.log('User ID set to default:', this.userId);

        // Show error message
        this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Se ha establecido un ID de usuario por defecto para pruebas.'
        });

        this.loadUserData();
    }

    /**
     * Load user data based on the current user ID
     */
    loadUserData() {
        if (!this.userId) {
            this.loading = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo obtener el ID de usuario.'
            });
            return;
        }

        this.loading = true;
        this.userService.getUserById(this.userId).subscribe({
            next: (user) => {
                if (user) {
                    this.currentUser = user;
                    this.fullName = user.fullName;
                    // No establecemos la contraseña para evitar mostrar la contraseña actual
                    this.password = '';
                    console.log('User data loaded successfully:', user);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se encontró el usuario.'
                    });
                }
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading user data:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al cargar los datos del usuario: ' + error.message
                });
                this.loading = false;
            }
        });
    }

    /**
     * Update the user profile
     */
    updateProfile() {
        if (!this.currentUser || !this.userId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No hay datos de usuario para actualizar.'
            });
            return;
        }

        this.submitting = true;

        // Create updated user object
        const updatedUser: User = {
            ...this.currentUser,
            fullName: this.fullName,
            password: this.password || this.currentUser.password // Use existing password if no new one provided
        };

        this.userService.updateUser(updatedUser).subscribe({
            next: (user) => {
                if (user) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Perfil actualizado correctamente.'
                    });

                    // Update local user data
                    this.currentUser = user;
                    this.password = ''; // Clear password field after update

                    // Update stored user if using AuthService
                    if (this.authService.currentUserValue) {
                        const authUser = this.authService.currentUserValue;
                        const updatedAuthUser = {
                            ...authUser,
                            fullName: this.fullName
                        };
                        localStorage.setItem('currentUser', JSON.stringify(updatedAuthUser));

                        if (typeof this.authService.updateCurrentUser === 'function') {
                            this.authService.updateCurrentUser(updatedAuthUser);
                        }
                    }
                }
                this.submitting = false;
            },
            error: (error) => {
                console.error('Error updating user profile:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al actualizar el perfil: ' + error.message
                });
                this.submitting = false;
            }
        });
    }
}

