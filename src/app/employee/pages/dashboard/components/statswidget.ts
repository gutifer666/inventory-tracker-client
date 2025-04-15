import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService} from '../../../../share/services/user/user.service';
import { LoginService } from '../../../../share/services/login/login.service';
import { AuthService } from '../../../../share/services/auth/auth.service';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    providers: [UserService, LoginService, AuthService],
    template: `<div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Ventas</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ sales }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ employeeName }}</span>
                <span class="text-muted-color"> - Empleado</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Ganancias</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">€{{ earnings }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-euro text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">Datos actualizados</span>
                <span class="text-muted-color"> - Hoy</span>
            </div>
        </div>`
})
export class StatsWidget implements OnInit {
    sales: number = 0;
    earnings: number = 0;
    employeeName: string = '';

    constructor(
        private userService: UserService,
        private loginService: LoginService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        // Try to get user from LoginService first
        const currentUser = this.loginService.getCurrentUser();

        if (currentUser && currentUser.id > 0) {
            // If we have a valid user ID from LoginService, use it
            this.loadUserData(currentUser.id);
        } else {
            // Try to get user from AuthService
            const authUser = this.authService.currentUserValue;

            if (authUser && authUser.username) {
                // We have a user from AuthService but need to find their ID
                // Get all users and find the one with matching username
                this.userService.getUsers().subscribe(users => {
                    const matchedUser = users.find(u => u.username === authUser.username);
                    if (matchedUser) {
                        this.loadUserData(matchedUser.id);
                    } else {
                        this.loadDefaultUserData();
                    }
                });
            } else {
                this.loadDefaultUserData();
            }
        }
    }

    /**
     * Load user data by ID
     */
    private loadUserData(userId: number) {
        this.userService.getUserById(userId).subscribe(user => {
            if (user) {
                this.sales = user.sales;
                this.earnings = user.earnings;
                this.employeeName = user.fullName;
            } else {
                this.loadDefaultUserData();
            }
        });
    }

    /**
     * Load default user data as fallback
     */
    private loadDefaultUserData() {
        console.warn('No hay usuario logueado. Usando datos de ejemplo.');
        const defaultEmployeeId = 2; // ID del empleado de prueba

        this.userService.getUserById(defaultEmployeeId).subscribe(user => {
            if (user) {
                this.sales = user.sales;
                this.earnings = user.earnings;
                this.employeeName = user.fullName;
            }
        });
    }
}
