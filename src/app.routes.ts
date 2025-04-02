import { Routes } from '@angular/router';
import { AppAdminLayout } from './app/admin/layout/component/app.admin-layout';
import { AdminDashboard } from './app/admin/pages/dashboard/admin-dashboard';
import { AppEmployeeLayout } from './app/employee/layout/component/app.employee-layout';
import { Login } from './app/share/pages/auth/login';
import { EmployeeDashboard } from './app/employee/pages/dashboard/employee-dashboard';
import { Documentation } from './app/share/pages/documentation/documentation';
import { Landing } from './app/share/pages/landing/landing';
import { ProductCrud } from './app/admin/pages/product/pages/product-crud';
import { Notfound } from './app/share/pages/notfound/notfound';
import { UserCrud } from './app/admin/pages/user/pages/user-crud';

export const appRoutes: Routes = [
    { path: '', component: Login },

    {
        path: 'admin',
        component: AppAdminLayout,
        children: [
            { path: '', component: AdminDashboard },
            { path: 'product', component: ProductCrud },
            { path: 'user', component: UserCrud },
            { path: 'documentation', component: Documentation }
        ]
    },
    {
        path: 'employee',
        component: AppEmployeeLayout,
        children: [
            { path: '', component: EmployeeDashboard },
            { path: 'documentation', component: Documentation }
        ]
    },

    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
