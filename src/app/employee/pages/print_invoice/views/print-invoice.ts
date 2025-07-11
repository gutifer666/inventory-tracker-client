import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';

// Services
import { TransactionService} from '../../../../share/services/transaction/transaction.service';
import { UserService } from '../../../../share/services/user/user.service';
import { LoginService } from '../../../../share/services/login/login.service';
import { AuthService } from '../../../../share/services/auth/auth.service';

// Interfaces
import { Transaction } from '../../../../share/interfaces/transaction.interface';

@Component({
    selector: 'app-print-invoice',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        ToastModule,
        CardModule,
        DialogModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule
    ],
    providers: [MessageService],
    template: `
        <div class="p-4 md:p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-semibold">Imprimir Factura</h1>
            </div>

            <div class="card shadow-md p-4">
                <p-table
                    #dt
                    [value]="transactions"
                    [rows]="10"
                    [paginator]="true"
                    [globalFilterFields]="['clientName', 'productName', 'createdAt']"
                    [tableStyle]="{ 'min-width': '75rem' }"
                    [rowHover]="true"
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} transacciones"
                    [showCurrentPageReport]="true"
                    [rowsPerPageOptions]="[10, 20, 30]"
                >
                    <ng-template pTemplate="caption">
                        <div class="flex items-center justify-between">
                            <h5 class="m-0">Mis Transacciones</h5>
                            <div class="p-input-icon-left">
                                <i class="pi pi-search"></i>
                                <input pInputText type="text" (input)="applyFilter($event)" placeholder="Buscar..." />
                            </div>
                        </div>
                    </ng-template>
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Cliente</th>
                            <th>Producto</th>
                            <th>Código</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-transaction>
                        <tr>
                            <td>{{ transaction.clientName }}</td>
                            <td>{{ transaction.productName }}</td>
                            <td>{{ transaction.productCode }}</td>
                            <td>{{ transaction.quantity }}</td>
                            <td>€{{ transaction.transactionPrice }}</td>
                            <td>{{ transaction.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
                            <td>
                                <button
                                    pButton
                                    pRipple
                                    icon="pi pi-print"
                                    class="p-button-rounded p-button-success mr-2"
                                    (click)="printInvoice(transaction)"
                                ></button>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="7" class="text-center">No se encontraron transacciones.</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>

        <p-dialog [(visible)]="invoiceDialog" [style]="{ width: '650px' }" header="Factura" [modal]="true">
            <div class="invoice-container p-4" *ngIf="selectedTransaction">
                <div class="invoice-header mb-6">
                    <h2 class="text-2xl font-bold mb-2">FACTURA</h2>
                    <div class="flex justify-between">
                        <div>
                            <p class="mb-1"><strong>Fecha:</strong> {{ selectedTransaction.createdAt | date: 'dd/MM/yyyy HH:mm' }}</p>
                            <p class="mb-1"><strong>Factura #:</strong> INV-{{ selectedTransaction.id }}</p>
                        </div>
                        <div>
                            <p class="mb-1"><strong>Empresa:</strong> Inventory Tracker</p>
                            <p class="mb-1"><strong>Dirección:</strong> Calle Principal 123</p>
                            <p class="mb-1"><strong>Teléfono:</strong> +34 123 456 789</p>
                        </div>
                    </div>
                </div>

                <div class="invoice-client mb-6">
                    <h3 class="text-xl font-semibold mb-2">Cliente</h3>
                    <p class="mb-1"><strong>Nombre:</strong> {{ selectedTransaction.clientName }}</p>
                </div>

                <div class="invoice-items mb-6">
                    <h3 class="text-xl font-semibold mb-2">Detalles</h3>
                    <table class="w-full border-collapse">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="border p-2 text-left">Producto</th>
                                <th class="border p-2 text-left">Código</th>
                                <th class="border p-2 text-left">Cantidad</th>
                                <th class="border p-2 text-left">Precio Unitario</th>
                                <th class="border p-2 text-left">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="border p-2">{{ selectedTransaction.productName }}</td>
                                <td class="border p-2">{{ selectedTransaction.productCode }}</td>
                                <td class="border p-2">{{ selectedTransaction.quantity }}</td>
                                <td class="border p-2">€{{ selectedTransaction.transactionPrice / selectedTransaction.quantity }}</td>
                                <td class="border p-2">€{{ selectedTransaction.transactionPrice }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="invoice-total mb-6">
                    <div class="flex justify-end">
                        <div class="w-1/3">
                            <div class="flex justify-between mb-1">
                                <span><strong>Subtotal:</strong></span>
                                <span>€{{ selectedTransaction.transactionPrice }}</span>
                            </div>
                            <div class="flex justify-between mb-1">
                                <span><strong>IVA (21%):</strong></span>
                                <span>€{{ (selectedTransaction.transactionPrice * 0.21).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>€{{ (selectedTransaction.transactionPrice * 1.21).toFixed(2) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="invoice-footer">
                    <p class="text-center text-gray-500">Gracias por su compra</p>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <button pButton pRipple label="Cerrar" icon="pi pi-times" class="p-button-text" (click)="hideInvoiceDialog()"></button>
                <button pButton pRipple label="Imprimir" icon="pi pi-print" class="p-button-text" (click)="printDocument()"></button>
            </ng-template>
        </p-dialog>

        <p-toast></p-toast>
    `
})
export class PrintInvoice implements OnInit {
    transactions: Transaction[] = [];
    selectedTransaction: Transaction | null = null;
    invoiceDialog: boolean = false;
    currentUserId: number = 0;
    currentUserName: string = '';

    constructor(
        private transactionService: TransactionService,
        private userService: UserService,
        private loginService: LoginService,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getCurrentUserId();
    }

    /**
     * Get the current user ID from available services
     */
    getCurrentUserId() {
        console.log('Getting current user ID...');

        // Try from LoginService first
        const currentUser = this.loginService.getCurrentUser();
        console.log('Current user from login service:', currentUser);

        if (currentUser && currentUser.id > 0) {
            this.currentUserId = currentUser.id;
            console.log('User ID set from login service to:', this.currentUserId);
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
                        this.currentUserId = matchedUser.id;
                        this.currentUserName = matchedUser.fullName;
                        console.log('User ID set from username match to:', this.currentUserId);

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

                        this.loadTransactions();
                    } else {
                        this.setDefaultUser();
                    }
                },
                error: (error) => {
                    console.error('Error getting users:', error);
                    this.setDefaultUser();
                }
            });
        } else {
            this.setDefaultUser();
        }
    }

    /**
     * Load user data based on the current user ID
     */
    loadUserData() {
        this.userService.getUserById(this.currentUserId).subscribe({
            next: (user) => {
                if (user) {
                    this.currentUserName = user.fullName;
                    this.loadTransactions();
                } else {
                    this.setDefaultUser();
                }
            },
            error: (error) => {
                console.error('Error loading user data:', error);
                this.setDefaultUser();
            }
        });
    }

    private setDefaultUser() {
        console.log('No user found in any service, setting default ID for testing');
        this.currentUserId = 2; // Default ID for testing - using employee ID from logs
        console.log('User ID set to default:', this.currentUserId);

        // Show error message
        this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Se ha establecido un ID de usuario por defecto para pruebas.'
        });

        this.userService.getUserById(this.currentUserId).subscribe(user => {
            if (user) {
                this.currentUserName = user.fullName;
                this.loadTransactions();
            }
        });
    }

    loadTransactions() {
        this.transactionService.findAllTransactions().subscribe(transactions => {
            // Filter transactions for the current employee
            this.transactions = transactions.filter(t =>
                t.employeeName === this.currentUserName
            );
        });
    }

    printInvoice(transaction: Transaction) {
        this.selectedTransaction = transaction;
        this.invoiceDialog = true;
    }

    hideInvoiceDialog() {
        this.invoiceDialog = false;
    }

    printDocument() {
        // Use browser's print functionality
        window.print();

        this.messageService.add({
            severity: 'success',
            summary: 'Impresión',
            detail: 'La factura se ha enviado a imprimir',
            life: 3000
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        const table = document.querySelector('p-table');
        if (table) {
            const tableRef = (table as any).dt;
            if (tableRef) {
                tableRef.filterGlobal(filterValue, 'contains');
            }
        }
    }
}
