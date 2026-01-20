# 🌐 NS - Red Social Blog

Una red social híbrida entre Instagram y Medium, centrada en contenido visual y texto largo. Permite a los usuarios crear publicaciones estilo blog con imágenes, seguir a otros usuarios, comentar, dar me gusta y más.

---

## 📋 **Tabla de Contenidos**

1. [Características](#características)
2. [Tecnologías](#tecnologías)
3. [Requisitos Previos](#requisitos-previos)
4. [Instalación](#instalación)
5. [Configuración](#configuración)
6. [Base de Datos](#base-de-datos)
7. [Ejecución](#ejecución)
8. [Estructura del Proyecto](#estructura-del-proyecto)
9. [API Endpoints](#api-endpoints)
10. [Uso](#uso)
11. [Solución de Problemas](#solución-de-problemas)
12. [Contribución](#contribución)
13. [Licencia](#licencia)

---

## ✨ **Características**

### 🔐 **Autenticación y Usuarios**
- ✅ Registro e inicio de sesión con JWT
- ✅ Perfiles de usuario personalizables
- ✅ Subida de avatar
- ✅ Biografía y enlaces personales
- ✅ Cambio de contraseña

### 📝 **Publicaciones**
- ✅ Crear publicaciones con texto largo (Markdown)
- ✅ Subir hasta 10 imágenes por publicación
- ✅ Etiquetas/hashtags
- ✅ Borradores
- ✅ Editar y eliminar publicaciones
- ✅ Feed personalizado
- ✅ Feed global
- ✅ Trending/Explorar
- ✅ Búsqueda de publicaciones

### ❤️ **Interacción Social**
- ✅ Me gusta en publicaciones
- ✅ Comentarios
- ✅ Guardar publicaciones favoritas
- ✅ Seguir/dejar de seguir usuarios
- ✅ Ver seguidores y seguidos

---

## 🛠️ **Tecnologías**

### **Backend**
- Node.js v16+
- Express.js
- MySQL (con Sequelize ORM)
- JWT (autenticación)
- Bcrypt.js (encriptación)
- Multer (subida de archivos)

### **Frontend**
- React.js 18
- React Router DOM
- Axios
- Tailwind CSS
- React Markdown
- Lucide React (iconos)

---

## 📦 **Requisitos Previos**

Antes de instalar, asegúrate de tener instalado:

- **Node.js** v16 o superior → [Descargar](https://nodejs.org/)
- **npm** v7 o superior (viene con Node.js)
- **MySQL** v5.7 o superior
  - XAMPP → [Descargar](https://www.apachefriends.org/)
  - WAMP → [Descargar](https://www.wampserver.com/)
  - MAMP → [Descargar](https://www.mamp.info/)
- **Git** (opcional) → [Descargar](https://git-scm.com/)

### **Verificar instalaciones:**
```bash
