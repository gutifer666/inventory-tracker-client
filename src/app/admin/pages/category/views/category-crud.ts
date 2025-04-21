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
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Category, CategoryService } from '../services/category.service';

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
    selector: 'app-category-crud',
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
        TextareaModule,
        DialogModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="Nueva" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Borrar" icon="pi pi-trash" outlined (onClick)="deleteSelectedCategories()" [disabled]="!selectedCategories || !selectedCategories.length" />
            </ng-template>

            <ng-template #end>
                <p-button label="CSV" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="categories()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['name', 'description']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedCategories"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} categorías"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Administrar Categorías</h5>
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
                    <th pSortableColumn="description" style="min-width:16rem">
                        Descripción
                        <p-sortIcon field="description" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-category>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="category" />
                    </td>
                    <td style="min-width: 16rem">{{ category.name }}</td>
                    <td style="min-width: 16rem">{{ category.description }}</td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editCategory(category)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteCategory(category)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="categoryDialog" [style]="{ width: '450px' }" header="Detalles de la Categoría" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">Nombre</label>
                        <input type="text" pInputText id="name" [(ngModel)]="category.name" required autofocus fluid />
                        <small class="p-error" *ngIf="submitted && !category.name">El nombre es requerido.</small>
                    </div>

                    <div>
                        <label for="description" class="block font-bold mb-3">Descripción</label>
                        <textarea id="description" pTextarea [(ngModel)]="category.description" required rows="3" cols="20" fluid></textarea>
                        <small class="p-error" *ngIf="submitted && !category.description">La descripción es requerida.</small>
                    </div>
                </div>
            </ng-template>
            <ng-template #footer>
                <button pButton pRipple label="Cancelar" icon="pi pi-times" class="p-button-text" (click)="hideDialog()"></button>
                <button pButton pRipple label="Guardar" icon="pi pi-check" class="p-button-text" (click)="saveCategory()"></button>
            </ng-template>
        </p-dialog>

        <p-confirmDialog [style]="{ width: '450px' }"></p-confirmDialog>
        <p-toast></p-toast>
    `,
    providers: [MessageService, ConfirmationService]
})
export class CategoryCrud implements OnInit {
    @ViewChild('dt') dt: Table | undefined;

    categories = signal<Category[]>([]);
    category: Category = { id: 0, name: '', description: '' };
    selectedCategories: Category[] = [];
    categoryDialog: boolean = false;
    submitted: boolean = false;
    cols: Column[] = [];
    exportColumns: ExportColumn[] = [];

    constructor(
        private categoryService: CategoryService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadCategories();
        this.initColumns();
    }

    loadCategories() {
        this.categoryService.getCategories().subscribe({
            next: (data) => {
                this.categories.set(data);
            },
            error: (error) => {
                console.error('Error loading categories:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message || 'Error loading categories',
                    life: 5000
                });
            }
        });
    }

    initColumns() {
        this.cols = [
            { field: 'name', header: 'Nombre' },
            { field: 'description', header: 'Descripción' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    openNew() {
        this.category = { id: 0, name: '', description: '' };
        this.submitted = false;
        this.categoryDialog = true;
    }

    deleteSelectedCategories() {
        this.confirmationService.confirm({
            message: '¿Está seguro de que desea eliminar las categorías seleccionadas?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Create an array of promises for deleting all selected categories
                const deletePromises = this.selectedCategories.map(category =>
                    new Promise<boolean>((resolve) => {
                        this.categoryService.deleteCategory(category.id).subscribe({
                            next: (success) => resolve(success),
                            error: (error) => {
                                console.error(`Error deleting category ${category.id}:`, error);
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: `Error al eliminar la categoría ${category.name}: ${error.message || 'Error desconocido'}`,
                                    life: 5000
                                });
                                resolve(false);
                            }
                        });
                    })
                );

                // Wait for all deletions to complete
                Promise.all(deletePromises).then(results => {
                    const successCount = results.filter(result => result).length;

                    if (successCount > 0) {
                        this.loadCategories();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Exitoso',
                            detail: `${successCount} categoría(s) eliminada(s)`,
                            life: 3000
                        });
                    }

                    this.selectedCategories = [];
                });
            }
        });
    }

    editCategory(category: Category) {
        this.category = { ...category };
        this.categoryDialog = true;
    }

    deleteCategory(category: Category) {
        this.confirmationService.confirm({
            message: '¿Está seguro de que desea eliminar la categoría ' + category.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.categoryService.deleteCategory(category.id).subscribe({
                    next: (success) => {
                        if (success) {
                            this.loadCategories();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Exitoso',
                                detail: 'Categoría eliminada',
                                life: 3000
                            });
                        }
                        this.category = { id: 0, name: '', description: '' };
                    },
                    error: (error) => {
                        console.error('Error deleting category:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.message || 'Error al eliminar la categoría',
                            life: 5000
                        });
                    }
                });
            }
        });
    }

    hideDialog() {
        this.categoryDialog = false;
        this.submitted = false;
    }

    saveCategory() {
        this.submitted = true;

        if (this.category.name?.trim()) {
            if (this.category.id) {
                this.categoryService.updateCategory(this.category).subscribe({
                    next: (updatedCategory) => {
                        this.loadCategories();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Exitoso',
                            detail: 'Categoría actualizada',
                            life: 3000
                        });
                        this.categoryDialog = false;
                        this.category = { id: 0, name: '', description: '' };
                    },
                    error: (error) => {
                        console.error('Error updating category:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.message || 'Error al actualizar la categoría',
                            life: 5000
                        });
                    }
                });
            } else {
                this.categoryService.addCategory(this.category).subscribe({
                    next: (newCategory) => {
                        this.loadCategories();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Exitoso',
                            detail: 'Categoría creada',
                            life: 3000
                        });
                        this.categoryDialog = false;
                        this.category = { id: 0, name: '', description: '' };
                    },
                    error: (error) => {
                        console.error('Error creating category:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.message || 'Error al crear la categoría',
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
