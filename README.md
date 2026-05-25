ALUMNO: Sebastián Javier Andreozzi

DEPLOY: https://tp1sala-juegossebasti-git-fe13d0-sebastian-andreozzi-s-projects.vercel.app?_vercel_share=PYDa7Jq2FluH5zuOCTIMIGxkQUsKoree

TECNOLOGÍAS: BD con SUpabase
             FrontEnd con Angular21
             Deploy con Vercel

Sprint 3

En este sprint agregué  la lógica y diseño de los juegos "ahorcado" (en /components/ahorcado) y "Mayor o menor" (en /components/mayormenor).

La lógica del "ahorcado" elije una palabra al azar de una lista precargada. Mapea esa palabra y compara las letras de la misma con las letras que el usuario va seleccionando. Estas letras se guardan en una lista de seleccionadas que sirva para esta comparación y para desabilitar los botones de las letras ya elegidas. También lleva el conteo de intentos fallidos y actualiza la imágen que ilustra el ahorcado, en este caso reemplacé esa imágen por un árbol que se va talando, según corresponda. Lugo carga el tiempo de partida, la cantidad de letras elegidas, el usuario y el puntaje en la base de datos.

Para el "mayor o menor" hice un modelo de carta que almacena el valor, el palo y el path a la imágen de la carta. Luego hice el mazo de  cartas en data para que el componente lo usara. Desde el componente traigo el mazo, lo mezclo y guardo la primer carta en cartaActual. Luego, a medida que el usuario elige "mayor" o "menor" voy comparando la carta actual con la siguiente y actualizo la carta actual. Al finalizar la partida guarda el nombre de usuario y la cantidad de aciertos como puntaje en la base de datos.

También agregué la funcionalidad de sala de chat en tiempo real al componente sala-chat. Para esto traigo los mensajes iniciales de la base de datos, con su usuario autor y fecha y horario, y destaco los mensajes del usuario activo. 

+

Sprint 2

En este sprint agregué funcionalidad de login al componente /login, agregue funcionalidad de registro al componente /signup con impácto en al base de datos. También agregué rutas a los distintos juegos accesibles desde la pantalla principal pero no modifique los componentes de los juegos.

Agregué guards para asegurar que ciertas rutas y botonoes sean inaccseibles o accesibles teniendo en cuenta si hay o no hay un usuario loggeado.

También agregué botones de inicio rápido con usuarios precargados para agilizar las pruebas.

+

Sprint 1

En este sprint cree los componentes:
 /home (La pantalla principal)
 /about (Donde muestro la información de "quien soy" traida de la api de github y describo brevemente el juego propio que elegí)
 /login (Donde después agregaré la funcionalidad de inicio de sesión)
 /signup (Donde después agregaré la funcionalidad de registro de nuevos usuarios)
 /header (Un componente que funciona como el header compartido entre todas las pantallas)

Además agregue un favicon.ico propio

También le agregué estilo a todos los componentes con contenido.