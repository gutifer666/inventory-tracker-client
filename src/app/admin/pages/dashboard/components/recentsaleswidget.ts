import { Component, OnInit } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../../share/services/transaction/transaction.service';
import { Transaction } from '../../../../share/interfaces/transaction.interface';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `<div class="card !mb-8 text-center">
        <div class="font-semibold text-xl mb-4">Ventas Recientes</div>
        <p-table [value]="transactions" [paginator]="true" [rows]="3" responsiveLayout="scroll" styleClass="p-datatable-sm p-datatable-striped">
            <ng-template pTemplate="header">
                <tr>
                    <th class="text-center">Empleado</th>
                    <th class="text-center">Cliente</th>
                    <th class="text-center">Código</th>
                    <th class="text-center">Nombre</th>
                    <th class="text-center">Precio</th>
                    <th class="text-center bg-blue-50 dark:bg-blue-900">Cantidad</th>
                    <th class="text-center">Fecha</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-transaction>
                <tr>
                    <td class="text-center">{{ transaction.employeeName }}</td>
                    <td class="text-center">{{ transaction.clientName }}</td>
                    <td class="text-center">{{ transaction.productCode }}</td>
                    <td class="text-center">{{ transaction.productName }}</td>
                    <td class="text-center">{{ transaction.transactionPrice | currency: 'EUR' }}</td>
                    <td class="text-center font-bold bg-blue-50 dark:bg-blue-900">{{ transaction.quantity }} unid.</td>
                    <td class="text-center">{{ transaction.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
                </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
                <tr>
                    <td colspan="7" class="text-center p-4">
                        No hay transacciones disponibles.
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    providers: [TransactionService]
})
export class RecentSalesWidget implements OnInit {
    transactions: Transaction[] = [];

    constructor(private transactionService: TransactionService) {}

    ngOnInit() {
        this.transactionService.findAllTransactions().subscribe(
            transactions => {
                // Ordenar por fecha (más recientes primero) y limitar a 10 transacciones
                this.transactions = transactions
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 10);
                console.log('RecentSalesWidget - Loaded transactions:', this.transactions.length);
            },
            error => {
                console.error('RecentSalesWidget - Error loading transactions:', error);
            }
        );
    }
}
