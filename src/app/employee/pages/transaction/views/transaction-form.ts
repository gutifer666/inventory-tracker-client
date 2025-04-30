import { Component } from '@angular/core';


@Component({
    selector: 'app-transaction-form',
    standalone: true,
    template: `
        <div class="p-4 md:p-6">
            <h1> Formulario de Transacción</h1>
        </div>
    `
})
export class TransactionForm {
    constructor() {}
}
