# coder-js
Proyecto en JavaScript para consultar el clima de la ciudad, tomamos dos APIs, https://apis.datos.gob.ar/georef/api/provincias https://openweathermap.org/api,
de la primera sacamos el nombre, la latitud y longitud de la provincia, y la pasamos como parametros a la segunda api, que nos devuelve el clima actual.
El usuario ingresa el nombre de la provincia por un prompt que es corregido por funciones, capitalizando, sacando espacios vacios, corrigiendo tildes asi consumimos y pasamos correctamente los datos entre apis.

Primera entrega: 23/10/2023
repo: https://github.com/alvarosopena/coder-js
deploy at: https://alvarosopenafigueroa-coder-js.netlify.app/
Errores al 23/10 : Errores en pase de lat y long en provincias compuestas(aparece Córdoba si pasamos por ej Santa Cruz o Santa Fe), error al pasar Santiago del Estero (se pasa "del" capitalizada).
