import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Supplier, SupplierService } from '../services/supplier.service';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-supplier-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        DialogModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="Nuevo" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Borrar" icon="pi pi-trash" outlined (onClick)="deleteSelectedSuppliers()" [disabled]="!selectedSuppliers || !selectedSuppliers.length" />
            </ng-template>

            <ng-template #end>
                <p-button label="CSV" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="suppliers()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['name']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedSuppliers"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} proveedores"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Administrar Proveedores</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Buscar..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th pSortableColumn="name" style="min-width:16rem">
                        Nombre
                        <p-sortIcon field="name" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-supplier>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="supplier" />
                    </td>
                    <td style="min-width: 16rem">{{ supplier.name }}</td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editSupplier(supplier)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteSupplier(supplier)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="supplierDialog" [style]="{ width: '450px' }" header="Detalles del Proveedor" [modal]="true" [closable]="false">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">Nombre <span class="text-red-500">*</span></label>
                        <input type="text" pInputText id="name" [(ngModel)]="supplier.name" required autofocus fluid
                               [ngClass]="{'ng-invalid ng-dirty': submitted && !supplier.name?.trim()}" />
                        <small class="p-error" *ngIf="submitted && !supplier.name?.trim()">El nombre es requerido.</small>
                    </div>
                </div>
            </ng-template>
            <ng-template #footer>
                <button pButton pRipple label="Cancelar" icon="pi pi-times" class="p-button-text" (click)="hideDialog()"></button>
                <button pButton pRipple label="Guardar" icon="pi pi-check" class="p-button-text" [disabled]="submitted && !supplier.name?.trim()" (click)="saveSupplier()"></button>
            </ng-template>
        </p-dialog>

        <p-confirmDialog [style]="{ width: '450px' }"></p-confirmDialog>
        <p-toast></p-toast>
    `,
    providers: [MessageService, ConfirmationService]
})
export class SupplierCrud implements OnInit {
    @ViewChild('dt') dt: Table | undefined;

    suppliers = signal<Supplier[]>([]);
    supplier: Supplier = { id: 0, name: '' };
    selectedSuppliers: Supplier[] = [];
    supplierDialog: boolean = false;
    submitted: boolean = false;
    cols: Column[] = [];
    exportColumns: ExportColumn[] = [];

    constructor(
        private supplierService: SupplierService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadSuppliers();
        this.initColumns();
    }

    loadSuppliers() {
        // Show loading indicator or disable UI if needed
        this.supplierService.getSuppliers().subscribe({
            next: (data) => {
                this.suppliers.set(data);
                console.log('SupplierCrud - Successfully loaded suppliers:', data.length);
            },
            error: (error) => {
                console.error('SupplierCrud - Error loading suppliers:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message || 'Error al cargar los proveedores',
                    life: 5000
                });
            }
        });
    }

    initColumns() {
        this.cols = [
            { field: 'name', header: 'Nombre' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    openNew() {
        this.supplier = { id: 0, name: '' };
        this.submitted = false;
        this.supplierDialog = true;
    }

    deleteSelectedSuppliers() {
        this.confirmationService.confirm({
            message: '¿Está seguro de que desea eliminar los proveedores seleccionados?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                console.log(`SupplierCrud - Attempting to delete ${this.selectedSuppliers.length} suppliers`);

                // Create an array of promises for deleting all selected suppliers
                const deletePromises = this.selectedSuppliers.map(supplier =>
                    new Promise<{success: boolean, name: string, error?: any}>((resolve) => {
                        this.supplierService.deleteSupplier(supplier.id).subscribe({
                            next: (success) => resolve({success, name: supplier.name}),
                            error: (error) => {
                                console.error(`SupplierCrud - Error deleting supplier ${supplier.id}:`, error);
                                resolve({success: false, name: supplier.name, error});
                            }
                        });
                    })
                );

                // Wait for all deletions to complete
                Promise.all(deletePromises).then(results => {
                    const successCount = results.filter(result => result.success).length;
                    const failedCount = results.length - successCount;

                    // Group errors by type for better reporting
                    const failedItems = results.filter(result => !result.success);
                    const conflictItems = failedItems.filter(item => item.error?.status === 409);
                    const permissionItems = failedItems.filter(item => item.error?.status === 403);
                    const otherErrors = failedItems.filter(item =>
                        item.error?.status !== 409 && item.error?.status !== 403);

                    if (successCount > 0) {
                        this.loadSuppliers();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Exitoso',
                            detail: `${successCount} proveedor(es) eliminado(s)`,
                            life: 3000
                        });
                    }

                    // Show specific error messages for different error types
                    if (conflictItems.length > 0) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: `${conflictItems.length} proveedor(es) no se pudieron eliminar porque están siendo utilizados por otros registros`,
                            life: 5000
                        });
                    }

                    if (permissionItems.length > 0) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No tiene permisos para eliminar algunos proveedores',
                            life: 5000
                        });
                    }

                    if (otherErrors.length > 0) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: `${otherErrors.length} proveedor(es) no se pudieron eliminar debido a errores desconocidos`,
                            life: 5000
                        });
                    }

                    this.selectedSuppliers = [];
                });
            }
        });
    }

    editSupplier(supplier: Supplier) {
        this.supplier = { ...supplier };
        this.supplierDialog = true;
    }

    deleteSupplier(supplier: Supplier) {
        this.confirmationService.confirm({
            message: '¿Está seguro de que desea eliminar el proveedor ' + supplier.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                console.log(`SupplierCrud - Attempting to delete supplier with ID: ${supplier.id}`);

                this.supplierService.deleteSupplier(supplier.id).subscribe({
                    next: (success) => {
                        if (success) {
                            this.loadSuppliers();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Exitoso',
                                detail: 'Proveedor eliminado',
                                life: 3000
                            });
                        } else {
                            // Handle case where API returns success=false
                            console.warn(`SupplierCrud - API returned false for delete operation on supplier ID: ${supplier.id}`);
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Advertencia',
                                detail: 'No se pudo eliminar el proveedor. Puede que esté siendo utilizado por otros registros.',
                                life: 5000
                            });
                        }
                        this.supplier = { id: 0, name: '' };
                    },
                    error: (error) => {
                        console.error(`SupplierCrud - Error deleting supplier ID ${supplier.id}:`, error);

                        // Check for specific error types
                        let errorMessage = 'Error al eliminar el proveedor';

                        if (error.status === 409) {
                            errorMessage = 'No se puede eliminar el proveedor porque está siendo utilizado por productos u otros registros';
                        } else if (error.status === 403) {
                            errorMessage = 'No tiene permisos para eliminar proveedores';
                        }

                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.message || errorMessage,
                            life: 5000
                        });
                    }
                });
            }
        });
    }

    hideDialog() {
        this.supplierDialog = false;
        this.submitted = false;
    }

    saveSupplier() {
        this.submitted = true;

        if (this.supplier.name?.trim()) {
            // Log detallado del objeto supplier antes de enviarlo
            console.log('SupplierCrud - Supplier object before saving:', JSON.stringify(this.supplier));

            if (this.supplier.id) {
                this.supplierService.updateSupplier(this.supplier).subscribe({
                    next: (updatedSupplier) => {
                        this.loadSuppliers();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Exitoso',
                            detail: 'Proveedor actualizado',
                            life: 3000
                        });
                        this.supplierDialog = false;
                        this.supplier = { id: 0, name: '' };
                    },
                    error: (error) => {
                        console.error('Error updating supplier:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.message || 'Error al actualizar el proveedor',
                            life: 5000
                        });
                    }
                });
            } else {
                // Crear un objeto limpio para enviar al backend
                const supplierToCreate = {
                    name: this.supplier.name.trim()
                };

                console.log('SupplierCrud - Clean supplier object to create:', supplierToCreate);

                this.supplierService.addSupplier(supplierToCreate as Supplier).subscribe({
                    next: (newSupplier) => {
                        this.loadSuppliers();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Exitoso',
                            detail: 'Proveedor creado',
                            life: 3000
                        });
                        this.supplierDialog = false;
                        this.supplier = { id: 0, name: '' };
                    },
                    error: (error) => {
                        console.error('SupplierCrud - Error creating supplier:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.message || 'Error al crear el proveedor',
                            life: 5000
                        });
                    }
                });
            }
        }
    }

    onGlobalFilter(table: Table | undefined, event: Event) {
        table?.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    exportCSV() {
        this.dt?.exportCSV();
    }
}
