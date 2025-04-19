import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'topbar-widget',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule],
    template: `<a class="flex items-center" href="#">
        <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <span class="text-surface-900 dark:text-surface-0 font-medium text-2xl leading-normal mr-20">INVENTORY TRACKER</span>
        </a>

        <a pButton [text]="true" severity="secondary" [rounded]="true" pRipple class="lg:!hidden" pStyleClass="@next" enterClass="hidden" leaveToClass="hidden" [hideOnOutsideClick]="true">
            <i class="pi pi-bars !text-2xl"></i>
        </a>

        <div class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
            <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
                <li>
                    <a (click)="router.navigate(['/landing'], { fragment: 'home' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Inicio</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/landing'], { fragment: 'features' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Características</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/landing'], { fragment: 'highlights' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Destacados</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/landing'], { fragment: 'pricing' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Planes</span>
                    </a>
                </li>
            </ul>
            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
                <button pButton pRipple label="Iniciar Sesión" routerLink="/login" [rounded]="true" [text]="true"></button>
                <button pButton pRipple label="Registrarse" routerLink="/login" [rounded]="true"></button>
            </div>
        </div> `
})
export class TopbarWidget {
    constructor(public router: Router) {}
}
