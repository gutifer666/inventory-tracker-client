import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StatsWidget } from './components/statswidget';

@Component({
    selector: 'app-employee-dashboard',
    standalone: true,
    imports: [CommonModule, DatePipe, StatsWidget],
    template: `
        <div class="p-4 md:p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-semibold">Panel de Control</h1>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ currentDate | date:'longDate' }}</span>
            </div>

            <div class="mb-8">
                <app-stats-widget></app-stats-widget>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Sección para futuras ampliaciones como gráficos o tablas -->
                <div class="col-span-1 card shadow-md p-4">
                    <h2 class="text-xl font-semibold mb-4">Actividad Reciente</h2>
                    <p class="text-gray-500 dark:text-gray-400">No hay actividad reciente para mostrar.</p>
                </div>

                <div class="col-span-1 card shadow-md p-4">
                    <h2 class="text-xl font-semibold mb-4">Tareas Pendientes</h2>
                    <p class="text-gray-500 dark:text-gray-400">No hay tareas pendientes para mostrar.</p>
                </div>
            </div>
        </div>
    `
})
export class EmployeeDashboard implements OnInit {
    currentDate: Date = new Date();

    ngOnInit() {
        // Aquí podríamos cargar datos adicionales para el dashboard
    }
}
