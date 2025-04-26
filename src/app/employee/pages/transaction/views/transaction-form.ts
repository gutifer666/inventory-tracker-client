import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services
import { ProductService, Product } from '../../../../share/services/product/product.service';
import { TransactionService} from '../../../../share/services/transaction/transaction.service';
import { LoginService } from '../../../../share/services/login/login.service';

// Interfaces
import { TransactionDTO } from '../../../../share/interfaces/transaction.interface';

@Component({
    selector: 'app-transaction-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        DropdownModule,
        CardModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <div class="p-4 md:p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-semibold">Nueva Transacción</h1>
            </div>

            <div class="card shadow-md p-4">
                <form (ngSubmit)="saveTransaction()" #transactionForm="ngForm">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Cliente -->
                        <div class="field col-span-1">
                            <label for="clientName" class="block text-lg font-medium mb-2">Cliente</label>
                            <input
                                pInputText
                                id="clientName"
                                [(ngModel)]="transaction.clientName"
                                name="clientName"
                                required
                                class="w-full p-inputtext-lg"
                                placeholder="Nombre del cliente"
                            />
                            <small *ngIf="submitted && !transaction.clientName" class="p-error">El nombre del cliente es requerido.</small>
                        </div>

                        <!-- Producto -->
                        <div class="field col-span-1">
                            <label for="productId" class="block text-lg font-medium mb-2">Producto</label>
                            <p-dropdown
                                id="productId"
                                [options]="products"
                                [(ngModel)]="transaction.productId"
                                name="productId"
                                optionLabel="name"
                                optionValue="id"
                                [filter]="true"
                                filterBy="name"
                                placeholder="Selecciona un producto"
                                [showClear]="true"
                                required
                                class="w-full"
                                (onChange)="onProductChange($event)"
                            ></p-dropdown>
                            <small *ngIf="submitted && !transaction.productId" class="p-error">El producto es requerido.</small>
                        </div>

                        <!-- Cantidad -->
                        <div class="field col-span-1">
                            <label for="quantity" class="block text-lg font-medium mb-2">Cantidad</label>
                            <p-inputNumber
                                id="quantity"
                                [(ngModel)]="transaction.quantity"
                                name="quantity"
                                [min]="1"
                                [max]="selectedProduct?.quantity || 100"
                                required
                                class="w-full"
                            ></p-inputNumber>
                            <small *ngIf="submitted && !transaction.quantity" class="p-error">La cantidad es requerida.</small>
                            <small *ngIf="selectedProduct" class="text-gray-500">Disponible: {{ selectedProduct.quantity }}</small>
                        </div>

                        <!-- Precio -->
                        <div class="field col-span-1" *ngIf="selectedProduct">
                            <label class="block text-lg font-medium mb-2">Precio</label>
                            <div class="text-xl font-bold">{{ selectedProduct.retailPrice | currency:'EUR' }}</div>
                            <small class="text-gray-500">Precio unitario</small>
                        </div>

                        <!-- Total -->
                        <div class="field col-span-1 md:col-span-2" *ngIf="selectedProduct && transaction.quantity">
                            <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <div class="flex justify-between items-center">
                                    <span class="text-lg font-medium">Total:</span>
                                    <span class="text-xl font-bold">{{ selectedProduct.retailPrice * transaction.quantity | currency:'EUR' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end mt-6 gap-2">
                        <p-button
                            label="Cancelar"
                            icon="pi pi-times"
                            (onClick)="cancel()"
                            styleClass="p-button-outlined p-button-secondary"
                        ></p-button>
                        <p-button
                            type="submit"
                            label="Guardar"
                            icon="pi pi-check"
                            [disabled]="!transactionForm.valid || !canSubmit()"
                        ></p-button>
                    </div>
                </form>
            </div>
        </div>

        <p-toast></p-toast>
    `
})
export class TransactionForm implements OnInit {
    transaction: TransactionDTO = {
        userId: 0,
        clientName: '',
        productId: 0,
        quantity: 1
    };

    products: Product[] = [];
    selectedProduct: Product | null = null;
    submitted: boolean = false;

    constructor(
        private productService: ProductService,
        private transactionService: TransactionService,
        private loginService: LoginService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        // Cargar productos
        this.productService.getProducts().subscribe(products => {
            this.products = products.filter(p => p.quantity > 0); // Solo mostrar productos con stock
        });

        // Obtener el ID del usuario logueado
        const currentUser = this.loginService.getCurrentUser();
        if (currentUser) {
            this.transaction.userId = currentUser.id;
        } else {
            // Si no hay usuario logueado, redirigir al login
            this.router.navigate(['/']);
        }
    }

    onProductChange(event: any) {
        const productId = event.value;
        if (productId) {
            this.productService.getProductById(productId).subscribe(product => {
                this.selectedProduct = product || null;

                // Resetear la cantidad si es mayor que el stock disponible
                if (this.selectedProduct && this.transaction.quantity > this.selectedProduct.quantity) {
                    this.transaction.quantity = 1;
                }
            });
        } else {
            this.selectedProduct = null;
        }
    }

    canSubmit(): boolean {
        return !!(
            this.transaction.clientName &&
            this.transaction.productId &&
            this.transaction.quantity &&
            this.selectedProduct &&
            this.transaction.quantity <= this.selectedProduct.quantity
        );
    }

    saveTransaction() {
        this.submitted = true;

        if (this.canSubmit()) {
            this.transactionService.createTransaction(this.transaction).subscribe(
                (response) => {
                    console.log('Transaction created successfully:', response);

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Transacción Exitosa',
                        detail: 'La transacción se ha registrado correctamente',
                        life: 3000
                    });

                    // Update product stock if needed
                    if (this.selectedProduct) {
                        this.selectedProduct.quantity -= this.transaction.quantity;
                    }

                    // Resetear el formulario después de 1 segundo
                    setTimeout(() => {
                        this.transaction = {
                            userId: this.transaction.userId,
                            clientName: '',
                            productId: 0,
                            quantity: 1
                        };
                        this.selectedProduct = null;
                        this.submitted = false;
                    }, 1000);
                },
                (error) => {
                    console.error('Error creating transaction:', error);

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo registrar la transacción. ' + error.message,
                        life: 5000
                    });

                    this.submitted = false;
                }
            );
        }
    }

    cancel() {
        this.router.navigate(['/employee']);
    }
}
