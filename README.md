# coder-js
Proyecto en JavaScript para consultar el clima de la ciudad, tomamos dos APIs, https://apis.datos.gob.ar/georef/api/provincias https://openweathermap.org/api,
de la primera sacamos el nombre, la latitud y longitud de la provincia, y la pasamos como parametros a la segunda api, que nos devuelve el clima actual.
El usuario ingresa el nombre de la provincia por un prompt que es corregido por funciones, capitalizando, sacando espacios vacios, corrigiendo tildes asi consumimos y pasamos correctamente los datos entre apis.

Primera entrega: 23/10/2023
repo: https://github.com/alvarosopena/coder-js
deploy at: https://alvarosopenafigueroa-coder-js.netlify.app/

Segunda entrega: 07/11/2023
Se agrega el listado de provincias para elegir en el front y conseguir los datos a través de la API

Tercera entrega: 23/11/2023
Se agrega bootstrap para el diseño, luxor para fecha y hora, se arregla la función que duplicaba el listado con el array de provincias, y se agrega la opcion "selecciona aca!", también se agrega localstorage para guardar la ultima busqueda.
