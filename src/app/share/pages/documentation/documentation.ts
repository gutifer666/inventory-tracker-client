import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-documentation',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="card">
            <div class="font-semibold text-2xl mb-4">Documentación</div>

            <div class="font-semibold text-xl mb-4">Introducción</div>
            <p class="text-lg mb-4">Inventory Tracker es una aplicación para la gestión de inventario que permite administrar productos, categorías, proveedores y usuarios. Esta documentación le ayudará a entender cómo utilizar la aplicación según su rol.</p>

            <div class="font-semibold text-xl mb-4">Para Administradores</div>
            <p class="text-lg mb-4">Como administrador, tiene acceso a todas las funcionalidades de gestión del sistema:</p>
            <ul class="leading-normal list-disc pl-8 text-lg mb-4">
                <li><span class="text-primary font-medium">Gestión de Usuarios</span>: Crear, editar y eliminar usuarios del sistema.</li>
                <li><span class="text-primary font-medium">Gestión de Productos</span>: Administrar el catálogo de productos.</li>
                <li><span class="text-primary font-medium">Gestión de Categorías</span>: Organizar productos por categorías.</li>
                <li><span class="text-primary font-medium">Gestión de Proveedores</span>: Administrar la información de proveedores.</li>
                <li><span class="text-primary font-medium">Exportar PDF</span>: Generar informes en formato PDF.</li>
            </ul>

            <div class="font-semibold text-xl mb-4">Para Empleados</div>
            <p class="text-lg mb-4">Como empleado, puede realizar las siguientes operaciones:</p>
            <ul class="leading-normal list-disc pl-8 text-lg mb-4">
                <li><span class="text-primary font-medium">Transacciones</span>: Registrar nuevas transacciones de productos.</li>
                <li><span class="text-primary font-medium">Editar Perfil</span>: Actualizar su información personal.</li>
                <li><span class="text-primary font-medium">Imprimir Facturas</span>: Generar e imprimir facturas para los clientes.</li>
            </ul>

            <div class="font-semibold text-xl mb-4">Navegación</div>
            <p class="text-lg mb-4">
                El menú principal se encuentra en la barra lateral izquierda. Dependiendo de su rol, verá diferentes opciones disponibles.
            </p>

            <div class="font-semibold text-xl mb-4">Gestión de Productos (Administradores)</div>
            <p class="text-lg mb-4">
                Para gestionar productos, acceda a la sección "Productos" desde el menú. Podrá:
            </p>
            <ul class="leading-normal list-disc pl-8 text-lg mb-4">
                <li>Agregar nuevos productos usando el botón "Nuevo"</li>
                <li>Editar productos existentes con el botón de edición</li>
                <li>Eliminar productos con el botón de eliminación</li>
                <li>Buscar productos utilizando el campo de búsqueda</li>
            </ul>

            <div class="font-semibold text-xl mb-4">Registro de Transacciones (Empleados)</div>
            <p class="text-lg mb-4">
                Para registrar una nueva transacción:
            </p>
            <ol class="leading-normal list-decimal pl-8 text-lg mb-4">
                <li>Acceda a "Nueva Transacción" desde el menú</li>
                <li>Seleccione los productos a incluir en la transacción</li>
                <li>Indique las cantidades correspondientes</li>
                <li>Complete la información del cliente</li>
                <li>Confirme la transacción</li>
            </ol>

            <div class="font-semibold text-xl mb-4">Soporte Técnico</div>
            <p class="text-lg mb-4">
                Si encuentra algún problema o tiene dudas sobre el funcionamiento de la aplicación, contacte al administrador del sistema o al soporte técnico en <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">gutifer666&#64;gmail.com</span>.
            </p>

            <div class="font-semibold text-xl mb-4">Configuración del Sistema</div>
            <p class="text-lg mb-4">
                La aplicación Inventory Tracker está desarrollada con Angular v19 y PrimeNG v19. Para cambiar entre modo claro y oscuro, utilice el botón de tema en la barra superior.
            </p>
        </div>
    `,
    styles: `
        @media screen and (max-width: 991px) {
            .video-container {
                position: relative;
                width: 100%;
                height: 0;
                padding-bottom: 56.25%;

                iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
            }
        }
    `
})
export class Documentation {}
