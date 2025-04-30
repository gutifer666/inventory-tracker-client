# Notas de Depuración

## Errores 403 en Operaciones CRUD

### Problema con Objetos Anidados en Peticiones POST/PUT
- **Fecha:** [Fecha actual]
- **Componentes afectados:** ProductCrud
- **Síntoma:** Error 403 Forbidden al crear/actualizar productos
- **Causa:** Al enviar objetos complejos con relaciones anidadas (como Product con Category y Supplier), la estructura de los objetos enviados al backend no era la esperada.
- **Solución:** Simplificar los objetos anidados incluyendo solo los campos esenciales (id y name):

```typescript
// Correcto
this.product.category = {
    id: category.id,
    name: category.name
};

// Incorrecto - Enviar el objeto completo con posibles campos adicionales
this.product.category = category;
```

- **Lección:** Cuando trabajes con relaciones entre entidades en peticiones REST:
  1. Envía solo los campos necesarios para establecer la relación (generalmente el ID)
  2. Crea objetos limpios antes de enviarlos al backend
  3. Verifica la estructura exacta que espera el backend (usando Postman como referencia)
  4. Añade logs detallados para ver qué se está enviando exactamente...

## Error 500 al Eliminar Producto con Cantidad 1

### Problema con Manejo de Optional en Backend y Actualización en Frontend
- **Fecha:** [Fecha actual]
- **Componentes afectados:** ProductCrud, ProductService, DeleteProductUseCase
- **Síntoma:** Error 500 al eliminar un producto con cantidad 1, aunque se elimina correctamente de la base de datos
- **Causa:** 
  1. **Backend:** El método `deleteProductByIdOrElseThrow` en `DeleteProductUseCase` devolvía un Optional vacío después de eliminar correctamente el producto, pero el controlador esperaba un Optional con valor.
  2. **Frontend:** No manejaba correctamente el error 500 que ocurría en este caso específico.

- **Solución Backend:**
```java
private Optional<Product> deleteProductByIdOrElseThrow(long id) throws IllegalStateException {
    try {
        Optional<Product> product = productRepositoryAdapter.deleteProduct(id);
        log.info("Product with id {} deleted successfully", id);
        return product; // Devolver el producto del repositorio en lugar de Optional vacío
    } catch (Exception e) {
        log.error("Failed to delete product with id {}", id, e);
        throw new IllegalStateException("Failed to delete product: " + id, e);
    }
}
```

- **Solución Frontend:**
  1. Mejorar el manejo de errores en ProductService:
```typescript
deleteProduct(id: number): Observable<boolean> {
  return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(
    map(response => true),
    catchError(error => {
      // Si el error es 500 pero contiene mensaje de que se eliminó correctamente,
      // consideramos que la operación fue exitosa
      if (error.status === 500 && 
          error.error && 
          (error.error.message?.includes('deleted successfully') || 
           error.message?.includes('deleted successfully'))) {
        console.warn(`ProductService - Backend returned error 500 but product appears to be deleted. Treating as success.`);
        return of(true);
      }
      
      return this.handleError(error);
    })
  );
}
```

  2. Mejorar la actualización de datos en ProductCrud:
```typescript
deleteProduct(product: Product) {
    // ...
    this.productService.deleteProduct(product.id).subscribe({
        next: (success) => {
            if (success) {
                // Forzar recarga completa de datos con pequeño retraso
                setTimeout(() => {
                    this.loadDemoData();
                    // Mostrar mensaje de éxito...
                }, 300);
            }
        },
        // Manejo de errores...
    });
    // ...
}
```

- **Lección:** 
  1. Asegúrate de que los métodos del backend devuelvan los valores esperados por los controladores
  2. Implementa un manejo robusto de errores en el frontend que pueda recuperarse de errores del backend
  3. Considera añadir pequeños retrasos antes de recargar datos después de operaciones de eliminación
  4. Usa logs detallados tanto en frontend como en backend para facilitar la depuración
