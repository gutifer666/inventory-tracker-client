import { Component } from '@angular/core';
import { StatsWidget } from './components/statswidget';

@Component({
    selector: 'app-employee-dashboard',
    imports: [StatsWidget],
    template: `
        <h1 class="text-3xl font-semibold">Empleado Dashboard</h1>
        <app-stats-widget />
    `
})
export class EmployeeDashboard {}
