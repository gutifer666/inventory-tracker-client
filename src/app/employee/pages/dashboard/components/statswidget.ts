import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { LoginService } from '../../../../share/services/login/login.service';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule, CurrencyPipe],
    template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <!-- Widget de Ventas -->
        <div class="col-span-1">
            <div class="card shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                <div class="p-4">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <h5 class="text-lg font-semibold text-gray-700 dark:text-gray-200 m-0">Ventas</h5>
                            <div class="text-3xl font-bold text-surface-900 dark:text-surface-0 mt-2">{{ employeeSales }}</div>
                        </div>
                        <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/30 rounded-full p-3">
                            <i class="pi pi-shopping-cart text-blue-600 dark:text-blue-300 text-xl"></i>
                        </div>
                    </div>
                    <div class="border-t pt-3 mt-2 border-gray-200 dark:border-gray-700">
                        <div class="flex items-center">
                            <i class="pi pi-arrow-up text-green-500 mr-1"></i>
                            <span class="text-green-500 font-medium">+5% </span>
                            <span class="text-gray-500 dark:text-gray-400 ml-1">vs mes anterior</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Widget de Ganancias -->
        <div class="col-span-1">
            <div class="card shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                <div class="p-4">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <h5 class="text-lg font-semibold text-gray-700 dark:text-gray-200 m-0">Ganancias</h5>
                            <div class="text-3xl font-bold text-surface-900 dark:text-surface-0 mt-2">{{ employeeEarnings | currency:'EUR' }}</div>
                        </div>
                        <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/30 rounded-full p-3">
                            <i class="pi pi-euro text-orange-600 dark:text-orange-300 text-xl"></i>
                        </div>
                    </div>
                    <div class="border-t pt-3 mt-2 border-gray-200 dark:border-gray-700">
                        <div class="flex items-center">
                            <i class="pi pi-arrow-up text-green-500 mr-1"></i>
                            <span class="text-green-500 font-medium">+8% </span>
                            <span class="text-gray-500 dark:text-gray-400 ml-1">vs mes anterior</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class StatsWidget implements OnInit {
    employeeSales: number = 0;
    employeeEarnings: number = 0;

    constructor(private loginService: LoginService) {}

    ngOnInit() {
        // Obtener el usuario logueado del LoginService
        const currentUser = this.loginService.getCurrentUser();

        if (currentUser) {
            this.employeeSales = currentUser.sales;
            this.employeeEarnings = currentUser.earnings;
        } else {
            // Si no hay usuario logueado, suscribirse al observable para detectar cuando se loguee
            this.loginService.currentUser$.subscribe(user => {
                if (user) {
                    this.employeeSales = user.sales;
                    this.employeeEarnings = user.earnings;
                }
            });
        }
    }
}
