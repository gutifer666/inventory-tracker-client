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
  4. Añade logs detallados para ver qué se está enviando exactamente