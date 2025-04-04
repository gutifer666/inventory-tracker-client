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
import { Product, ProductService } from '../services/product.service';

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
        ConfirmDialogModule
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
                    <td>{{ product.category_id }}</td>
                    <td>{{ product.supplier_id }}</td>
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

        <p-dialog [(visible)]="productDialog" [style]="{ width: '450px' }" header="Detalles del Producto" [modal]="true">
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
                        <span class="block font-bold mb-4">Categoría</span>
                        <div class="grid grid-cols-12 gap-4">
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category1" name="category" value="Accessories" [(ngModel)]="product.category_id" />
                                <label for="category1">Accessories</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category2" name="category" value="Clothing" [(ngModel)]="product.category_id" />
                                <label for="category2">Clothing</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category3" name="category" value="Electronics" [(ngModel)]="product.category_id" />
                                <label for="category3">Electronics</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category4" name="category" value="Fitness" [(ngModel)]="product.category_id" />
                                <label for="category4">Fitness</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label for="supplier" class="block font-bold mb-3">Proveedor</label>
                        <input type="text" pInputText id="supplier" [(ngModel)]="product.supplier_id" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !product.name">Proveedor requerido.</small>
                    </div>

                    <div>
                        <label for="quantity" class="block font-bold mb-3">Cantidad</label>
                        <input type="text" pInputText id="quantity" [(ngModel)]="product.quantity" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !product.name">Cantidad requerida.</small>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-6">
                            <label for="totalPrice" class="block font-bold mb-3">Precio de costo</label>
                            <p-inputnumber id="totalPrice" [(ngModel)]="product.cost_price" mode="currency" currency="EUR" locale="en-US" fluid />
                        </div>
                        <div class="col-span-6">
                            <label for="retailPrice" class="block font-bold mb-3">Precio de Venta</label>
                            <p-inputnumber id="retailPrice" [(ngModel)]="product.retail_price" mode="currency" currency="EUR" locale="en-US" fluid />
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Añadir" icon="pi pi-check" (click)="saveProduct()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ProductService, ConfirmationService]
})
export class ProductCrud implements OnInit {
    productDialog: boolean = false;

    products = signal<Product[]>([]);

    product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private productService: ProductService,
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

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'category_id', header: 'Category' },
            { field: 'supplier_id', header: 'Supplier' },
            { field: 'cost_price', header: 'Cost Price' },
            { field: 'retail_price', header: 'Retail Price' },
            { field: 'quantity', header: 'Quantity' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
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
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedProducts?.forEach(prod => {
                    this.productService.deleteProduct(prod.id).subscribe();
                });
                this.loadDemoData();
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productService.deleteProduct(product.id).subscribe((success) => {
                    if (success) {
                        this.loadDemoData();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Deleted',
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

    saveProduct() {
        this.submitted = true;
        let _products = this.products();
        if (this.product.name?.trim()) {
            if (this.product.id) {
                this.productService.updateProduct(this.product).subscribe((updatedProduct) => {
                    this.loadDemoData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Updated',
                        life: 3000
                    });
                });
            } else {
                this.productService.addProduct(this.product).subscribe((newProduct) => {
                    this.loadDemoData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Product Created',
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
