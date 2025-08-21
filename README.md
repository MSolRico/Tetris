# Electron Tetris

Esta es una aplicación de escritorio multiplataforma construida con Electron JS que implementa el clásico juego Tetris. Fue desarrollada como un proyecto para el programa BTS SIO para demostrar la integración de APIs nativas y tecnologías web modernas (HTML, CSS, JS) en un entorno de escritorio robusto y completo.

## Características Principales

  * **Juego Completo:** La lógica de juego de Tetris está implementada por completo, incluyendo la caída de piezas, rotación, detección de colisiones, eliminación de líneas y puntuación. El panel lateral muestra la **siguiente pieza**, lo que permite una planificación estratégica.

  * **Flujo de Juego en 3 Pantallas:** La aplicación cuenta con una arquitectura de interfaz de usuario de tres pantallas (`Inicio`, `Juego` y `Fin de la Partida`), que gestionan el flujo del usuario de manera fluida y profesional.

  * **Sistema de Puntuaciones Altas:** Se ha implementado un sistema persistente que guarda las mejores puntuaciones en el almacenamiento local del navegador (`localStorage`), las cuales se muestran en la pantalla de inicio.

  * **Mensajes Personalizados:** Al finalizar la partida, la pantalla de "Fin de la Partida" muestra un mensaje personalizado y con humor, adaptado a la puntuación obtenida por el jugador.

  * **APIs Nativas:** El juego utiliza APIs de Electron para ofrecer una experiencia de escritorio completa:

      * **Menú Nativo:** Un menú personalizado que permite reiniciar el juego o salir de la aplicación.
      * **Notificaciones del Sistema:** Alertas nativas para anunciar el fin de la partida.
      * **Diálogo:** Una ventana "Acerca de" que muestra información sobre el proyecto.

  * **Diseño UX/UI:** La interfaz de usuario tiene un estilo retro de 8 bits, con un diseño intuitivo que utiliza Flexbox y CSS. Los colores y el estilo han sido modificados para dar al juego un toque temático argentino.

  * **Multiplataforma:** La aplicación puede ser empaquetada y distribuida en sistemas operativos como Windows, macOS y Linux.

## Tecnologías Utilizadas

  * **Electron JS:** Framework para construir aplicaciones de escritorio con tecnologías web.
  * **Node.js:** Entorno de ejecución para el código del proceso principal.
  * **HTML5/CSS3:** Estructura de la interfaz de usuario y estilos.
  * **JavaScript (ES6):** Lógica del juego y gestión de eventos.
  * **Electron-Builder:** Herramienta utilizada para empaquetar y generar los instaladores.
  * **`localStorage`:** API web del navegador utilizada para almacenar las puntuaciones altas.

## Instalación y Ejecución

Para ejecutar esta aplicación, necesitarás tener Node.js y npm instalados.

1.  Clona el repositorio:
    ```http
    git clone https://github.com/MSolRico/Tetris.git
    cd Tetris
    ```
2.  Instala las dependencias:
    ```http
    npm install
    ```
3.  Ejecuta la aplicación en modo desarrollo:
    ```http
    npm start
    ```

## Empaquetado para Distribución

Si quieres crear un ejecutable de la aplicación, utiliza el siguiente comando. Esto generará un instalador para tu sistema operativo en la carpeta `dist`.

```http
npm run dist
```

## Estructura del Proyecto

  * **`main.js`:** El proceso principal de la aplicación. Se encarga de la ventana y las APIs nativas.
  * **`index.html`:** La interfaz gráfica de usuario, dividida en tres secciones para el inicio, el juego y la pantalla de fin de partida.
  * **`renderer.js`:** El proceso de renderizado que contiene toda la lógica del juego, la gestión de las pantallas y el sistema de puntuaciones.
  * **`style.css`:** La hoja de estilos que proporciona un diseño temático y retro a la interfaz.
  * **`package.json`:** Manifiesto del proyecto y configuración de electron-builder.

## Licencia

Este proyecto está bajo la Licencia MIT.