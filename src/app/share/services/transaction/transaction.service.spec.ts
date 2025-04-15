import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionService, TransactionDTO, Transaction } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionService]
    });
    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all transactions', () => {
    const mockTransactions: Transaction[] = [
      {
        id: 1,
        employee_name: 'Test Employee',
        client_name: 'Test Client',
        product_code: 'TEST001',
        product_name: 'Test Product',
        quantity: 2,
        transaction_price: 100,
        created_at: '2023-01-01 10:00:00'
      }
    ];

    service.findAllTransactions().subscribe(transactions => {
      expect(transactions.length).toBe(1);
      expect(transactions).toEqual(mockTransactions);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/transactions');
    expect(req.request.method).toBe('GET');
    req.flush(mockTransactions);
  });

  it('should create a transaction', () => {
    const mockTransactionDTO: TransactionDTO = {
      userId: 1,
      clientName: 'Test Client',
      productId: 1,
      quantity: 2
    };

    const mockResponse: Transaction = {
      id: 1,
      employee_name: 'Test Employee',
      client_name: 'Test Client',
      product_code: 'TEST001',
      product_name: 'Test Product',
      quantity: 2,
      transaction_price: 100,
      created_at: '2023-01-01 10:00:00'
    };

    service.createTransaction(mockTransactionDTO).subscribe(transaction => {
      expect(transaction).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/transactions');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockTransactionDTO);
    req.flush(mockResponse);
  });
});
