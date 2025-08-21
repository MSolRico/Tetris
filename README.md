# Electron Tetris
Esta es una aplicación de escritorio multiplataforma construida con Electron JS que implementa el clásico juego Tetris. Fue desarrollada como un proyecto para el programa BTS SIO para demostrar la integración de APIs nativas y tecnologías web modernas (HTML, CSS, JS).

## Características
- Juego Completo: La lógica de juego de Tetris está implementada por completo, incluyendo la caída de piezas, rotación, detección de colisiones, eliminación de líneas y puntuación.

- APIs Nativas: El juego utiliza APIs de Electron para ofrecer una experiencia de escritorio completa:

- Menú Nativo: Un menú personalizado que permite reiniciar el juego o salir de la aplicación.

- Notificaciones del Sistema: Alertas nativas para anunciar el fin de la partida.

- Diálogo: Una ventana "Acerca de" que muestra información sobre el proyecto.

- Diseño UX/UI: La interfaz de usuario tiene un estilo retro de 8 bits, con un diseño intuitivo que utiliza Flexbox y CSS personalizado.

- Multiplataforma: La aplicación puede ser empaquetada y distribuida en sistemas operativos como Windows, macOS y Linux.

## Tecnologías Utilizadas
- Electron JS: Framework para construir aplicaciones de escritorio con tecnologías web.

- Node.js: Entorno de ejecución para el código del proceso principal.

- HTML5/CSS3: Estructura de la interfaz de usuario y estilos.

- JavaScript (ES6): Lógica del juego y gestión de eventos.

- Electron-Builder: Herramienta utilizada para empaquetar y generar los instaladores.

## Instalación y Ejecución
Para ejecutar esta aplicación, necesitarás tener Node.js y npm instalados.

1. Clona el repositorio:
```http
git clone https://github.com/MSolRico/Tetris.git
cd Tetris
```
2. Instala las dependencias:

```http
npm install
```
3. Ejecuta la aplicación en modo desarrollo:

```http
npm start
```
## Empaquetado para Distribución
Si quieres crear un ejecutable de la aplicación, utiliza el siguiente comando. Esto generará un instalador para tu sistema operativo en la carpeta dist.

```http
npm run dist
```
## Estructura del Proyecto
- main.js: El proceso principal de la aplicación. Se encarga de la ventana y las APIs nativas.

- index.html: La interfaz gráfica de usuario.

- renderer.js: El proceso de renderizado que contiene toda la lógica del juego.

- style.css: La hoja de estilos para el diseño de la interfaz.

- package.json: Manifiesto del proyecto y configuración de electron-builder.

## Licencia
Este proyecto está bajo la Licencia MIT.