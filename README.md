# Descripción

Proyecto de configuración de los servicios de firebase (Functions y Firestore)

# Instalación del proyecto

### Requisitos

- [Node.js](https://nodejs.org/en/download)
- [Firebase CLI](https://firebase.google.com/docs/cli?hl=es-419#install-cli-windows)

### Procedimiento

Instalación de Firebase CLI. Puede que requiera permisos de administrador.

```bash
npm i -g firebase-tools
```

Instalación de paquetes del proyecto

```bash
npm i
```

A continuación, inicia sesión con un usuario que tenga acceso al proyecto.

```bash
firebase login
```

Finalmente, puedes correr localmente la función con el siguiente comando:

```bash
firebase serve --only functions
```

### Despliegue

```bash
firebase deploy --only functions
```
