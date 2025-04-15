/**
 * Transaction interface representing a completed transaction
 */
export interface Transaction {
    id: number;
    employeeName: string;
    clientName: string;
    productCode: string;
    productName: string;
    quantity: number;
    transactionPrice: number;
    createdAt: string;
}

/**
 * Transaction DTO interface for creating a new transaction
 */
export interface TransactionDTO {
    userId: number;
    clientName: string;
    productId: number;
    quantity: number;
}
