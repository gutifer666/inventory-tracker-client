import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../admin/layout/component/app.floatingconfigurator';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-admin-floating-configurator />
        <div
            class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div
                    style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20"
                         style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg"
                                 class="mb-8 w-16 shrink-0 mx-auto">
                                <path
                                    d="M5 10L27 2L49 10V30L27 38L5 30V10Z"
                                    stroke="var(--primary-color)"
                                    stroke-width="2"
                                    fill="none"
                                />
                                <path
                                    d="M5 10L27 18L49 10"
                                    stroke="var(--primary-color)"
                                    stroke-width="2"
                                    fill="none"
                                />
                                <path
                                    d="M18 22L24 28L36 16"
                                    stroke="var(--primary-color)"
                                    stroke-width="2"
                                    fill="none"
                                />
                            </svg>
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Inventory
                                Tracker
                            </div>
                            <span class="text-muted-color font-medium">Loguéate para continuar</span>
                        </div>

                        <div>
                            <label for="email1"
                                   class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Nombre</label>
                            <input pInputText id="email1" type="text" placeholder="Nombre de usuario"
                                   class="w-full md:w-[30rem] mb-8" [(ngModel)]="userName" />

                            <label for="password1"
                                   class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Introduce contraseña"
                                        [toggleMask]="true" styleClass="mb-4" [fluid]="true"
                                        [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Recuérdame</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">¿Olvidaste la contraseña?</span>
                            </div>
                            <p-button label="Iniciar sesión" (click)="login()" styleClass="w-full"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    userName: string = '';
    password: string = '';
    checked: boolean = false;

    constructor(private loginService: LoginService, private router: Router) { }

    login() {
        const credentials = { userName: this.userName, password: this.password };
        this.loginService.login(credentials).subscribe(
            response => {
                if (response.role === 'ADMIN') {
                    this.router.navigate(['admin']);
                } else if (response.role === 'EMPLOYEE') {
                    this.router.navigate(['employee']);
                } else {
                    // ...handle other roles...
                }
            },
            error => {
                // ...handle error...
            }
        );
    }
}
