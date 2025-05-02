import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

// Services
import { Product, ProductService } from '../../../../share/services/product/product.service';
import { TransactionService } from '../../../../share/services/transaction/transaction.service';
import { TransactionDTO } from '../../../../share/interfaces/transaction.interface';
import { LoginService } from '../../../../share/services/login/login.service';
import { AuthService } from '../../../../share/services/auth/auth.service';

@Component({
    selector: 'app-transaction-form',
    standalone: true,
    imports: [CommonModule, InputTextModule, FluidModule, ButtonModule, FormsModule, TextareaModule, AutoCompleteModule, ProgressSpinnerModule, ToastModule],
    providers: [MessageService, ProductService, TransactionService, LoginService, AuthService],
    template: `<p-fluid>
        <div class="flex mt-8">
            <div class="card flex flex-col gap-6 w-full">
                <div class="font-semibold text-xl">Nueva Transacción</div>
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="customer">Cliente</label>
                        <input pInputText id="customer" type="text" [(ngModel)]="clientName" />
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="product">Producto</label>
                        <p-autocomplete
                            id="product"
                            [(ngModel)]="selectedProduct"
                            [suggestions]="filteredProducts"
                            (completeMethod)="filterProducts($event)"
                            (onSelect)="onProductSelect()"
                            [dropdown]="true"
                            [forceSelection]="true"
                            optionLabel="name"
                            [showEmptyMessage]="true"
                            emptyMessage="No se encontraron productos"
                            placeholder="Buscar producto por nombre o código"
                            class="w-full">
                            <ng-template pTemplate="loadingicon">
                                <div class="flex align-items-center justify-content-center">
                                    <p-progressSpinner [style]="{width: '20px', height: '20px'}" *ngIf="loading"></p-progressSpinner>
                                </div>
                            </ng-template>
                            <ng-template let-product pTemplate="item">
                                <div class="flex justify-between w-full">
                                    <div>
                                        <span class="font-bold">{{ product.name }}</span>
                                    </div>
                                    <div class="flex gap-4">
                                        <span>Código: {{ product.code }}</span>
                                        <span>Precio: €{{ product.retailPrice }}</span>
                                        <span [ngClass]="{'text-green-500': product.quantity > 10, 'text-yellow-500': product.quantity > 0 && product.quantity <= 10, 'text-red-500': product.quantity === 0}">
                                            Stock: {{ product.quantity }}
                                        </span>
                                    </div>
                                </div>
                            </ng-template>
                        </p-autocomplete>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="quantity">Cantidad</label>
                        <input pInputText id="quantity" type="number"
                            [(ngModel)]="quantity"
                            [min]="1"
                            [max]="selectedProduct?.quantity || 1"
                            [disabled]="!selectedProduct"
                            step="1" />
                        <small *ngIf="selectedProduct" class="block mt-1" [ngClass]="{'text-red-500': selectedProduct.quantity === 0}">
                            Stock disponible: {{ selectedProduct.quantity }}
                        </small>
                    </div>
                </div>

                <div class="flex gap-2">
                    <p-button label="Añadir" [fluid]="false" (click)="createTransaction()" [disabled]="!canCreateTransaction()"></p-button>
                    <p-button label="Recargar Usuario" [fluid]="false" (click)="getCurrentUserId()" severity="secondary" *ngIf="!userId"></p-button>
                </div>
            </div>
        </div>
        <p-toast></p-toast>
    </p-fluid>`
})
export class TransactionForm implements OnInit {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    selectedProduct: Product | null = null;
    loading: boolean = false;
    quantity: number = 1;

    clientName: string = '';
    userId: number | null = null;
    submitting: boolean = false;

    constructor(
        private productService: ProductService,
        private transactionService: TransactionService,
        private loginService: LoginService,
        private authService: AuthService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadProducts();
        this.getCurrentUserId();
    }

    /**
     * Load all products from the service
     */
    loadProducts() {
        this.loading = true;
        this.productService.getProducts().subscribe({
            next: (products: Product[]) => {
                this.products = products;
                this.loading = false;
            },
            error: (error: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los productos. ' + error.message
                });
                this.loading = false;
            }
        });
    }

    /**
     * Filter products based on user input
     * @param event AutoComplete event containing the query
     */
    filterProducts(event: any) {
        const query = event.query.toLowerCase();
        this.loading = true;

        // Use setTimeout to simulate network delay and avoid UI freezing
        setTimeout(() => {
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.code.toLowerCase().includes(query) ||
                (product.description && product.description.toLowerCase().includes(query))
            );
            this.loading = false;
        }, 200);
    }

    /**
     * Handle product selection
     * Reset quantity to 1 or max stock if stock is less than 1
     */
    onProductSelect() {
        if (this.selectedProduct) {
            // Reset quantity to 1 or max available if stock is less than 1
            this.quantity = this.selectedProduct.quantity > 0 ? 1 : 0;
        } else {
            this.quantity = 1;
        }
    }

    /**
     * Get the current user ID from the login service
     */
    getCurrentUserId() {
        console.log('Getting current user ID...');

        // Try from LoginService first
        const currentUser = this.loginService.getCurrentUser();
        console.log('Current user from login service:', currentUser);

        if (currentUser && currentUser.id) {
            this.userId = currentUser.id;
            console.log('User ID set to:', this.userId);
            return;
        }

        // If not found, try from AuthService
        console.log('Trying to get user from AuthService...');
        const authUser = this.authService.currentUserValue;
        console.log('Current user from auth service:', authUser);

        if (authUser && authUser.id) {
            this.userId = authUser.id;
            console.log('User ID set from AuthService to:', this.userId);
            return;
        }

        // If still not found, set a default ID for testing (remove in production)
        console.log('No user found in any service, setting default ID for testing');
        this.userId = 1; // Default ID for testing
        console.log('User ID set to default:', this.userId);

        // Show error message
        this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'Se ha establecido un ID de usuario por defecto para pruebas.'
        });
    }

    /**
     * Check if a transaction can be created
     * @returns true if all required fields are filled and valid
     */
    canCreateTransaction(): boolean {
        // Log all conditions for debugging
        console.log('Debugging canCreateTransaction conditions:');
        console.log('- !submitting:', !this.submitting);
        console.log('- !!selectedProduct:', !!this.selectedProduct);
        console.log('- selectedProduct?.quantity > 0:', this.selectedProduct ? this.selectedProduct.quantity > 0 : false);
        console.log('- quantity > 0:', this.quantity > 0);
        console.log('- quantity <= selectedProduct.quantity:', this.selectedProduct ? this.quantity <= this.selectedProduct.quantity : false);
        console.log('- !!clientName:', !!this.clientName);
        console.log('- clientName.trim().length > 0:', this.clientName ? this.clientName.trim().length > 0 : false);
        console.log('- !!userId:', !!this.userId);
        console.log('- userId value:', this.userId);

        // Check each condition separately for easier debugging
        const notSubmitting = !this.submitting;
        const hasProduct = !!this.selectedProduct;
        const productHasStock = hasProduct && this.selectedProduct !== null && this.selectedProduct.quantity > 0;
        const quantityIsPositive = this.quantity > 0;
        const quantityIsValid = hasProduct && this.selectedProduct !== null && this.quantity <= this.selectedProduct.quantity;
        const hasClientName = !!this.clientName && this.clientName.trim().length > 0;
        const hasUserId = !!this.userId;

        const canCreate = notSubmitting && hasProduct && productHasStock &&
                         quantityIsPositive && quantityIsValid &&
                         hasClientName && hasUserId;

        console.log('Final result:', canCreate);
        return canCreate;
    }

    /**
     * Create a new transaction
     */
    createTransaction() {
        if (!this.canCreateTransaction()) {
            return;
        }

        this.submitting = true;

        // Ensure all values are valid before creating the DTO
        if (!this.userId || !this.selectedProduct || !this.clientName) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Faltan datos requeridos para crear la transacción.'
            });
            this.submitting = false;
            return;
        }

        const transactionDTO: TransactionDTO = {
            userId: this.userId,
            clientName: this.clientName.trim(),
            productId: this.selectedProduct.id,
            quantity: this.quantity
        };

        console.log('Creating transaction with data:', transactionDTO);

        this.transactionService.createTransaction(transactionDTO).subscribe({
            next: (transaction) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Transacción creada correctamente. Precio total: €${transaction.transactionPrice}`
                });

                // Reset form
                this.resetForm();
                this.submitting = false;
            },
            error: (error: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo crear la transacción. ' + error.message
                });
                this.submitting = false;
            }
        });
    }

    /**
     * Reset the form after a successful transaction
     */
    resetForm() {
        this.selectedProduct = null;
        this.quantity = 1;
        this.clientName = '';

        // Reload products to get updated stock
        this.loadProducts();
    }
}
