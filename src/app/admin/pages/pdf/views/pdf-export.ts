import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

// Services
import { TransactionService, Transaction } from '../../../../share/services/transaction/transaction.service';

// PDF Libraries
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-pdf-export',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        ToastModule,
        CardModule,
        ToolbarModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule
    ],
    providers: [MessageService],
    styleUrls: ['./pdf-export-styles.css'],
    template: `
        <div class="p-4 md:p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-semibold">Exportar Transacciones a PDF</h1>
            </div>

            <div class="card shadow-md p-4">
                <p-toolbar styleClass="mb-4">
                    <ng-template pTemplate="start">
                        <div class="font-bold text-xl">Últimas 10 Transacciones</div>
                    </ng-template>
                    <ng-template pTemplate="end">
                        <button
                            pButton
                            pRipple
                            label="Exportar PDF"
                            icon="pi pi-file-pdf"
                            class="p-button-danger mr-2"
                            (click)="exportPDF()"
                        ></button>
                    </ng-template>
                </p-toolbar>

                <div #pdfContent class="pdf-container">
                    <div class="pdf-header">
                        <h2 class="text-2xl font-bold">Inventory Tracker</h2>
                        <p>Reporte de Transacciones</p>
                        <p>Fecha: {{ currentDate | date: 'dd/MM/yyyy' }}</p>
                    </div>

                    <p-table
                        [value]="recentTransactions"
                        [tableStyle]="{ 'min-width': '50rem' }"
                        styleClass="p-datatable-sm pdf-table"
                    >
                        <ng-template pTemplate="header">
                            <tr>
                                <th>ID</th>
                                <th>Empleado</th>
                                <th>Cliente</th>
                                <th>Producto</th>
                                <th>Código</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Fecha</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-transaction>
                            <tr>
                                <td>{{ transaction.id }}</td>
                                <td>{{ transaction.employeeName }}</td>
                                <td>{{ transaction.clientName }}</td>
                                <td>{{ transaction.productName }}</td>
                                <td>{{ transaction.productCode }}</td>
                                <td>{{ transaction.quantity }}</td>
                                <td>€{{ transaction.transactionPrice }}</td>
                                <td>{{ transaction.createdAt | date: 'dd/MM/yyyy' }}</td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="footer">
                            <tr class="total-row">
                                <td colspan="6" class="text-right font-bold">Total:</td>
                                <td colspan="2" class="font-bold">€{{ calculateTotal() }}</td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage">
                            <tr>
                                <td colspan="8" class="text-center">No se encontraron transacciones.</td>
                            </tr>
                        </ng-template>
                    </p-table>

                    <div class="pdf-footer">
                        <p>© {{ currentDate | date: 'yyyy' }} Inventory Tracker - Todos los derechos reservados</p>
                    </div>
                </div>
            </div>
        </div>

        <p-toast></p-toast>
    `
})
export class PdfExport implements OnInit {
    recentTransactions: Transaction[] = [];
    currentDate: Date = new Date();

    @ViewChild('pdfContent') pdfContent!: ElementRef;

    constructor(
        private transactionService: TransactionService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadRecentTransactions();
    }

    loadRecentTransactions() {
        this.transactionService.findAllTransactions().subscribe(transactions => {
            // Sort transactions by date (newest first) and take the 10 most recent
            this.recentTransactions = transactions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 10);
        });
    }

    calculateTotal(): number {
        return this.recentTransactions.reduce((sum, transaction) => sum + transaction.transactionPrice, 0);
    }

    exportPDF() {
        const content = this.pdfContent.nativeElement;
        const doc = new jsPDF('p', 'mm', 'a4');
        const options = {
            background: 'white',
            scale: 3
        };

        html2canvas(content, options).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add new pages if content doesn't fit on one page
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            doc.save('transacciones-recientes.pdf');

            this.messageService.add({
                severity: 'success',
                summary: 'Exportación Exitosa',
                detail: 'El PDF se ha generado correctamente',
                life: 3000
            });
        });
    }
}
