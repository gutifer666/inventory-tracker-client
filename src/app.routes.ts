import { Routes } from '@angular/router';
import { AppAdminLayout } from './app/admin/layout/component/app.admin-layout';
import { AdminDashboard } from './app/admin/pages/dashboard/admin-dashboard';
import { AppEmployeeLayout } from './app/employee/layout/component/app.employee-layout';
import { Login } from './app/share/pages/auth/login';
import { EmployeeDashboard } from './app/employee/pages/dashboard/employee-dashboard';
import { AppDemoLayout } from './app/demo/layout/component/app.demo-layout';
import { Dashboard } from './app/demo/pages/dashboard/dashboard';
import { Documentation } from './app/share/pages/documentation/documentation';
import { Landing } from './app/share/pages/landing/landing';

export const appRoutes: Routes = [

    { path: '',
        component : Login },
    {
        path: 'admin',
        component: AppAdminLayout,
        children: [
            { path: '', component: AdminDashboard },
            { path: 'documentation', component: Documentation }
        ]
    },
    {
        path: 'employee',
        component: AppEmployeeLayout,
        children: [
            { path: '', component: EmployeeDashboard },
            { path: 'documentation', component: Documentation },
        ]
    },
    {
        path: 'demo',
        component: AppDemoLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/demo/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/demo/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: '**', redirectTo: '/notfound' }
];
