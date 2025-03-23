import { Component } from '@angular/core';
import { RecentSalesWidget } from './components/recentsaleswidget';

@Component({
    selector: 'app-admin-dashboard',
    imports: [RecentSalesWidget],
    template: `
        <h1 class="text-3xl font-semibold text-center">Admin Dashboard</h1>
        <div class="flex justify-center items-center">
            <app-recent-sales-widget />
        </div>
    `
})
export class AdminDashboard {}
