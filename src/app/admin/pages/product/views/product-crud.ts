import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { Product, ProductService } from '../../../../share/services/product/product.service';
import { Category, CategoryService } from '../../category/services/category.service';
import { Supplier, SupplierService } from '../../supplier/services/supplier.service';

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
    selector: 'app-product-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        DropdownModule
    ],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="Nuevo" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Borrar" icon="pi pi-trash" outlined (onClick)="deleteSelectedProducts()" [disabled]="!selectedProducts || !selectedProducts.length" />
            </ng-template>

            <ng-template #end>
                <p-button label="CSV" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="products()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['code', 'name', 'category', 'supplier', 'costPrice' , 'retailPrice', 'quantity']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedProducts"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Administrar Productos</h5>
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
                    <th style="min-width: 16rem">Código</th>
                    <th pSortableColumn="name" style="min-width:16rem">
                        Nombre
                        <p-sortIcon field="name" />
                    </th>
                    <th pSortableColumn="category" style="min-width:10rem">
                        Categoría
                        <p-sortIcon field="category" />
                    </th>
                    <th pSortableColumn="supplier" style="min-width:10rem">
                        Proveedor
                        <p-sortIcon field="supplier" />
                    </th>
                    <th pSortableColumn="costPrice" style="min-width: 8rem">
                        Precio de Costo
                        <p-sortIcon field="costPrice" />
                    </th>
                    <th pSortableColumn="retailPrice" style="min-width: 8rem">
                        Precio de Venta
                        <p-sortIcon field="retailPrice" />
                    </th>
                    <th pSortableColumn="quantity" style="min-width: 12rem">
                        Cantidad
                        <p-sortIcon field="quantity" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-product>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="product" />
                    </td>
                    <td style="min-width: 12rem">{{ product.code }}</td>
                    <td style="min-width: 16rem">{{ product.name }}</td>
                    <td>{{ getCategoryName(product.category_id) }}</td>
                    <td>{{ getSupplierName(product.supplier_id) }}</td>
                    <td>{{ product.cost_price | currency: 'EUR' }}</td>
                    <td>{{ product.retail_price | currency: 'EUR' }}</td>
                    <td>{{ product.quantity}}</td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editProduct(product)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteProduct(product)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="productDialog" [style]="{ width: '550px' }" header="Detalles del Producto" [modal]="true" styleClass="p-fluid">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="code" class="block font-bold mb-3">Código</label>
                        <input type="text" pInputText id="code" [(ngModel)]="product.code" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !product.code">Código requerido.</small>
                    </div>
                    <div>
                        <label for="name" class="block font-bold mb-3">Nombre</label>
                        <input type="text" pInputText id="name" [(ngModel)]="product.name" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !product.name">Nombre requerido.</small>
                    </div>
                    <div>
                        <label for="description" class="block font-bold mb-3">Descripción</label>
                        <textarea id="description" pTextarea [(ngModel)]="product.description" required rows="3" cols="20" fluid></textarea>
                    </div>

                    <div>
                        <label for="category" class="block font-bold mb-3">Categoría</label>
                        <p-dropdown id="category" [options]="categories()" [(ngModel)]="product.category_id" optionLabel="name" optionValue="id" placeholder="Seleccione una categoría" [filter]="true" filterBy="name" [showClear]="true" styleClass="w-full" [style]="{'width':'100%'}">
                            <ng-template pTemplate="selectedItem">
                                <div class="flex align-items-center gap-2" *ngIf="product.category_id">
                                    <div>{{ getCategoryName(product.category_id) }}</div>
                                </div>
                            </ng-template>
                            <ng-template let-category pTemplate="item">
                                <div class="flex align-items-center gap-2">
                                    <div>{{ category.name }}</div>
                                </div>
                            </ng-template>
                        </p-dropdown>
                        <small class="text-red-500" *ngIf="submitted && !product.category_id">Categoría requerida.</small>
                    </div>

                    <div>
                        <label for="supplier" class="block font-bold mb-3">Proveedor</label>
                        <p-dropdown id="supplier" [options]="suppliers()" [(ngModel)]="product.supplier_id" optionLabel="name" optionValue="id" placeholder="Seleccione un proveedor" [filter]="true" filterBy="name" [showClear]="true" styleClass="w-full" [style]="{'width':'100%'}">
                            <ng-template pTemplate="selectedItem">
                                <div class="flex align-items-center gap-2" *ngIf="product.supplier_id">
                                    <div>{{ getSupplierName(product.supplier_id) }}</div>
                                </div>
                            </ng-template>
                            <ng-template let-supplier pTemplate="item">
                                <div class="flex align-items-center gap-2">
                                    <div>{{ supplier.name }}</div>
                                </div>
                            </ng-template>
                        </p-dropdown>
                        <small class="text-red-500" *ngIf="submitted && !product.supplier_id">Proveedor requerido.</small>
                    </div>

                    <div>
                        <label for="quantity" class="block font-bold mb-3">Cantidad</label>
                        <p-inputnumber id="quantity" [(ngModel)]="product.quantity" [showButtons]="true" buttonLayout="horizontal" spinnerMode="horizontal"
                            decrementButtonClass="p-button-danger" incrementButtonClass="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" [min]="0" [step]="1" styleClass="w-full" />
                        <small class="text-red-500" *ngIf="submitted && !product.quantity">Cantidad requerida.</small>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-6">
                            <label for="totalPrice" class="block font-bold mb-3">Precio de costo</label>
                            <p-inputnumber id="totalPrice" [(ngModel)]="product.cost_price" mode="currency" currency="EUR" locale="es-ES" [minFractionDigits]="2" styleClass="w-full" />
                        </div>
                        <div class="col-span-6">
                            <label for="retailPrice" class="block font-bold mb-3">Precio de Venta</label>
                            <p-inputnumber id="retailPrice" [(ngModel)]="product.retail_price" mode="currency" currency="EUR" locale="es-ES" [minFractionDigits]="2" styleClass="w-full" />
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button [label]="product.id ? 'Actualizar' : 'Añadir'" icon="pi pi-check" (click)="saveProduct()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ProductService, CategoryService, SupplierService, ConfirmationService]
})
export class ProductCrud implements OnInit {
    productDialog: boolean = false;

    products = signal<Product[]>([]);
    categories = signal<Category[]>([]);
    suppliers = signal<Supplier[]>([]);

    product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private supplierService: SupplierService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.productService.getProducts().subscribe((data) => {
            this.products.set(data);
        });

        this.loadCategoriesAndSuppliers();

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'code', header: 'Código', customExportHeader: 'Código de Producto' },
            { field: 'name', header: 'Nombre' },
            { field: 'category_id', header: 'Categoría' },
            { field: 'supplier_id', header: 'Proveedor' },
            { field: 'cost_price', header: 'Precio de Costo' },
            { field: 'retail_price', header: 'Precio de Venta' },
            { field: 'quantity', header: 'Cantidad' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    loadCategoriesAndSuppliers() {
        // Cargar categorías actualizadas
        this.categoryService.getCategories().subscribe((data) => {
            this.categories.set(data);
        });

        // Cargar proveedores actualizados
        this.supplierService.getSuppliers().subscribe((data) => {
            this.suppliers.set(data);
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        // Recargar categorías y proveedores para tener los datos actualizados
        this.loadCategoriesAndSuppliers();

        this.product = {
            id: 0,
            code: "",
            cost_price: 0,
            description: "",
            name: "",
            quantity: 0,
            retail_price: 0,
            category_id: 0,
            supplier_id: 0
        };
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        // Recargar categorías y proveedores para tener los datos actualizados
        this.loadCategoriesAndSuppliers();

        this.product = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: '¿Está seguro de que desea eliminar los productos seleccionados?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Crear un array de promesas para eliminar todos los productos seleccionados
                const deletePromises = this.selectedProducts?.map(prod =>
                    this.productService.deleteProduct(prod.id)
                );

                // Esperar a que todas las eliminaciones se completen
                if (deletePromises && deletePromises.length > 0) {
                    // Usar forkJoin para esperar a que todas las operaciones se completen
                    import('rxjs').then(({ forkJoin }) => {
                        forkJoin(deletePromises).subscribe(() => {
                            // Recargar todos los datos para asegurar que todo esté actualizado
                            this.loadDemoData();
                            this.selectedProducts = null;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Exitoso',
                                detail: 'Productos Eliminados',
                                life: 3000
                            });
                        });
                    });
                }
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: '¿Está seguro de que desea eliminar ' + product.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productService.deleteProduct(product.id).subscribe((success) => {
                    if (success) {
                        // Recargar todos los datos para asegurar que todo esté actualizado
                        this.loadDemoData();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Exitoso',
                            detail: 'Producto Eliminado',
                            life: 3000
                        });
                    }
                });
                this.product = {
                    id: 0,
                    code: "",
                    cost_price: 0,
                    description: "",
                    name: "",
                    quantity: 0,
                    retail_price: 0,
                    category_id: 0,
                    supplier_id: 0
                };
            }
        });
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    getCategoryName(categoryId: number): string {
        const category = this.categories().find(c => c.id === categoryId);
        return category ? category.name : 'No asignada';
    }

    getSupplierName(supplierId: number): string {
        const supplier = this.suppliers().find(s => s.id === supplierId);
        return supplier ? supplier.name : 'No asignado';
    }

    saveProduct() {
        this.submitted = true;
        let _products = this.products();
        if (this.product.name?.trim()) {
            if (this.product.id) {
                this.productService.updateProduct(this.product).subscribe((updatedProduct) => {
                    // Recargar todos los datos para asegurar que todo esté actualizado
                    this.loadDemoData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Exitoso',
                        detail: 'Producto Actualizado',
                        life: 3000
                    });
                });
            } else {
                this.productService.addProduct(this.product).subscribe((newProduct) => {
                    // Recargar todos los datos para asegurar que todo esté actualizado
                    this.loadDemoData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Exitoso',
                        detail: 'Producto Creado',
                        life: 3000
                    });
                });
            }
            this.productDialog = false;
            this.product = {
                id: 0,
                code: "",
                cost_price: 0,
                description: "",
                name: "",
                quantity: 0,
                retail_price: 0,
                category_id: 0,
                supplier_id: 0
            };
        }
    }
}
