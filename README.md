# **Nexus Finance \- Web Portal 💻**

**Interfaz administrativa moderna y reactiva para la plataforma Nexus Finance. Construida con los últimos estándares de Angular 19 (Standalone Components & Signals).**

## **🏗️ Arquitectura del Proyecto**

El proyecto sigue una estructura de **Monolito Modular** organizada por dominios de negocio (Bounded Contexts). Se prioriza la agrupación por funcionalidad (iam, client, loan) sobre la agrupación por tipo técnico.

### **Estructura de Carpetas (Estado Actual)**

src/app/    
├── client/         \# Contexto: Gestión de Clientes    
│   ├── components/ \# Formularios (ClientCreateForm)    
│   ├── pages/      \# Vistas (Profile, Management)    
│   └── services/   \# ClientsService    
│    
├── iam/            \# Contexto: Identidad y Seguridad    
│   ├── component/  \# Componentes visuales de Auth    
│   ├── model/      \# DTOs (SignInRequest, etc.)    
│   ├── pages/      \# Vistas (Sign In, Sign Up)    
│   └── services/   \# Lógica de Seguridad (AuthService, Guards, Interceptors)    
│    
├── loan/           \# Contexto: Gestión de Préstamos    
│   └── ... (Componentes, Modelos, Páginas, Servicios)    
│    
├── public/         \# Estructura Pública y Layout    
│   ├── component/  \# Componentes visuales globales (Navbar)    
│   └── pages/      \# Vistas estáticas (Home, About, 404\)    
│    
└── shared/         \# Utilidades Base Reutilizables    
    ├── components/ \# Clases base (BaseFormComponent)    
    └── services/   \# Lógica HTTP genérica (BaseService)

### **Patrones de Diseño Implementados**

* **Bounded Context Packaging:** Cada módulo (iam, client, loan) es autocontenido y posee sus propios servicios y modelos.  
* **Smart vs Dumb Components:** Separación entre páginas que gestionan datos y componentes de presentación pura.  
* **BaseService Generics:** Abstracción en shared para reducir la repetición de código HTTP en los servicios de dominio.  
* **Reactive Forms:** Uso extensivo de formularios reactivos tipados.  
* **Guard Pattern:** Lógica de protección de rutas centralizada en el módulo iam.

## **🛠️ Stack Tecnológico**

| Tecnología | Versión | Propósito |
| :---- | :---- | :---- |
| **Angular** | **19.x** | Framework Core (Sin NgModules, 100% Standalone). |
| **Angular Material** | 19.x | Componentes UI Enterprise (Tablas, Cards, Inputs, Dialogs). |
| **SCSS (Sass)** | Nativo | **Estilado modular y nativo.** Uso de CSS Grid/Flexbox sin dependencias de terceros (No Tailwind). |
| **RxJS** | 7.x | Manejo avanzado de flujos asíncronos HTTP. |
| **Node.js** | 22.x LTS | Entorno de ejecución requerido. |

## **✨ Módulos Funcionales**

### **🔐 IAM (Seguridad Avanzada)**

* **Ubicación:** src/app/iam  
* **Autenticación:** Login y Registro con JWT.  
* **Interceptores:** Inyección automática de tokens en las peticiones HTTP.  
* **Guards:**  
  * authentication.guard: Verifica sesión activa.  
  * onboarding.guard: Fuerza el completado de perfil.  
  * role-check.guard: Restringe acceso por roles (ADMIN/CLIENT).

### **👥 Gestión de Clientes**

* **Ubicación:** src/app/client  
* **Perfil 360:** Vista detallada con datos personales e historial financiero.  
* **Edición Modal:** Formulario reutilizable para creación y edición.

### **💰 Motor de Préstamos**

* **Ubicación:** src/app/loan  
* **Solicitud:** Formulario con inyección de identidad segura.  
* **Evaluación:** Panel administrativo para aprobación de créditos.  
* **Detalle:** Visualización de cronogramas de pago.

### **🌐 Público & Layout**

* **Ubicación:** src/app/public  
* **Navbar:** Barra de navegación inteligente que adapta sus opciones según el rol del usuario y el estado de su perfil.

## **🚀 Instalación y Ejecución**

### **Prerrequisitos**

Asegúrate de tener el Backend (nexus-backend) corriendo en el puerto 8080\.

### **Pasos**

1. **Instalar dependencias:**  
   npm install

2. **Iniciar Servidor de Desarrollo:**  
   ng serve

3. Acceder:  
   Navega a http://localhost:4200/.

### **Configuración de Entornos**

El archivo src/environments/environment.ts conecta con la API local:

export const environment \= {    
  production: false,    
  serverBasePath: 'http://localhost:8080/api/v1'    
};

## **👤 Autor**

**Angel Antonio Cancho Corilla** \- *Full Stack Engineer*
