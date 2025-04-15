import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Define the Transaction interface
export interface Transaction {
    id: number;
    employee_name: string;
    client_name: string;
    product_code: string;
    product_name: string;
    quantity: number;
    transaction_price: number;
    created_at: string;
}

// Define the Transaction DTO interface
export interface TransactionDTO {
    userId: number;
    clientName: string;
    productId: number;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private baseUrl = 'http://localhost:8080/api';
    private apiUrl = `${this.baseUrl}/transactions`;

    constructor(private http: HttpClient) {}

    /**
     * Get all transactions from the API
     * @returns Observable with an array of transactions
     */
    findAllTransactions(): Observable<Transaction[]> {
        console.log('TransactionService - Fetching all transactions');
        return this.http.get<Transaction[]>(this.apiUrl).pipe(
            map(transactions => {
                console.log('TransactionService - Successfully fetched transactions:', transactions.length);
                return transactions;
            }),
            catchError(error => {
                console.error('TransactionService - Error fetching transactions:', error);
                return this.handleError(error);
            })
        );
    }

    /**
     * Create a new transaction
     * @param transactionDTO The transaction data to create
     * @returns Observable with the created transaction
     */
    createTransaction(transactionDTO: TransactionDTO): Observable<Transaction> {
        console.log('TransactionService - Creating new transaction:', transactionDTO);
        return this.http.post<Transaction>(this.apiUrl, transactionDTO).pipe(
            map(transaction => {
                console.log('TransactionService - Successfully created transaction:', transaction);
                return transaction;
            }),
            catchError(error => {
                console.error('TransactionService - Error creating transaction:', error);
                return this.handleError(error);
            })
        );
    }

    /**
     * Handle HTTP errors
     * @param error The HTTP error response
     * @returns An observable with the error message
     */
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

            // Add more specific error handling for authentication issues
            if (error.status === 401 || error.status === 403) {
                errorMessage = 'Authentication error: Please log in again';
                console.error('TransactionService - Authentication error:', error.status, error.message);
            }
        }

        console.error('TransactionService - Error details:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
