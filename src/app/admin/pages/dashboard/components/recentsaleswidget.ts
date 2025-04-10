import { Component, OnInit } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Transaction, TransactionService } from '../../../../share/services/transaction/transaction.service';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `<div class="card !mb-8 text-center">
        <div class="font-semibold text-xl mb-4">Ventas Recientes</div>
        <p-table [value]="transactions" [paginator]="true" [rows]="3" responsiveLayout="scroll">
            <ng-template pTemplate="header">
                <tr>
                    <th class="text-center">Empleado</th>
                    <th class="text-center">Cliente</th>
                    <th class="text-center">Código</th>
                    <th class="text-center">Nombre</th>
                    <th class="text-center">Precio</th>
                    <th class="text-center">Cantidad</th>
                    <th class="text-center">Fecha</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-transaction>
                <tr>
                    <td class="text-center">{{ transaction.employee_name }}</td>
                    <td class="text-center">{{ transaction.client_name }}</td>
                    <td class="text-center">{{ transaction.product_code }}</td>
                    <td class="text-center">{{ transaction.product_name }}</td>
                    <td class="text-center">{{ transaction.transaction_price | currency: 'EUR' }}</td>
                    <td class="text-center">{{ transaction.quantity }}</td>
                    <td class="text-center">{{ transaction.created_at | date: 'dd/MM/yyyy HH:mm' }}</td>
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
        this.transactionService.findAllTransactions().subscribe(transactions => {
            this.transactions = transactions.reverse();
        });
    }
}
