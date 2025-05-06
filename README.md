# Guía de Instalación y Ejecución - Inventory Tracker

Esta guía explica paso a paso cómo instalar y ejecutar la aplicación Inventory Tracker (basada en Angular 19) a partir de un archivo ZIP.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: Versión 20.x o superior
    - [Descargar Node.js](https://nodejs.org/)
    - Verifica la instalación: `node --version`

- **npm**: Versión 10.x o superior (incluido con Node.js)
    - Verifica la instalación: `npm --version`

- **Angular CLI**: Versión 19.0.x
    - Instalar globalmente: `npm install -g @angular/cli@19.0.6`
    - Verifica la instalación: `ng version`

## Pasos de Instalación

### 1. Descomprimir el Archivo

```bash
# Descomprime el archivo ZIP en tu directorio preferido
unzip inventory-tracker.zip -d inventory-tracker
# O usa tu herramienta de descompresión preferida
```

### 2. Navegar al Directorio del Proyecto

```bash
cd inventory-tracker
```

### 3. Instalar Dependencias

```bash
npm install
```

Este comando instalará todas las dependencias definidas en el archivo `package.json`, incluyendo:
- Angular 19.0.0
- PrimeNG 19.0.8
- PrimeIcons 7.0.0
- Chart.js 4.4.2
- Tailwind CSS 3.4.17
- BCrypt.js 3.0.2
- jsPDF 3.0.1
- html2canvas 1.4.1

### 4. Iniciar el Servidor de Desarrollo

```bash
npm start
# O alternativamente:
ng serve
```

La aplicación estará disponible en: [http://localhost:4200/](http://localhost:4200/)

## Acceso a la Aplicación

Una vez que la aplicación esté en ejecución, puedes acceder con las siguientes credenciales de prueba:

- **Administrador**:
    - Usuario: admin@example.com
    - Contraseña: admin123

- **Empleado**:
    - Usuario: employee@example.com
    - Contraseña: employee123

## Solución de Problemas Comunes

### Error: Cannot find module '@angular/compiler-cli'

```bash
npm install --save-dev @angular/compiler-cli@19.0.0
```

### Error: Port 4200 is already in use

```bash
# Usar un puerto diferente
ng serve --port 4201
```

### Error: Node.js version is not compatible

Asegúrate de usar Node.js versión 20.x o superior, ya que Angular 19 requiere esta versión como mínimo.

```bash
# Verificar versión de Node.js
node --version

# Si necesitas actualizar, considera usar nvm (Node Version Manager)
# Para instalar nvm: https://github.com/nvm-sh/nvm
```

## Comandos Útiles

```bash
# Compilar para producción
npm run build

# Ejecutar pruebas unitarias
npm test

# Formatear código
npm run format
```

## Estructura del Proyecto

- `/src/app/admin` - Módulos y componentes para administradores
- `/src/app/employee` - Módulos y componentes para empleados
- `/src/app/share` - Componentes, servicios e interfaces compartidas

## Recursos Adicionales

- [Documentación de Angular](https://angular.dev/)
- [Documentación de PrimeNG](https://primeng.org/documentation)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)

## Soporte

Si encuentras problemas durante la instalación o ejecución, por favor contacta al equipo de desarrollo o crea un issue en el repositorio del proyecto.

