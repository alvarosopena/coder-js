/* PROYECTO CLIMA CIUDADES A TRAVÉS DE API https://openweathermap.org/api VALIDANDO EL NOMBRE CORRECTO PARA SACAR LA LAT Y LON DE LAS PROVINCIAS A TRAVES DE API "https://apis.datos.gob.ar/georef/api/provincias"; 
*/

// Variable global para almacenar el valor seleccionado en el listado
let provinciaSeleccionada = null;
let temperaturaCelsius = null;


//botones
const obtenerClimaBtn = document.getElementById("obtenerClimaBtn");
const reiniciarBtn = document.getElementById("reiniciarBtn");
//evento click llamamos a la función de nuevo
reiniciarBtn.addEventListener("click", obtenerProvincias);

// Función para capitalizar la primera letra de cada palabra en una cadena
function primeraMayuscula(texto) {
    if (texto == null) {
        return null;
    }
    // Divide el texto en palabras
    const palabras = texto.split(" ");
    // Capitaliza la primera letra de cada palabra
    const palabrasCapitalizadas = palabras.map(palabra => {
        if (palabra.length === 0) {
            return palabra;  // Maneja palabras vacías
        }
        /* console.log(palabra) */
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);//toma el primer caracter(0), le aplica uppercase y se concatena con la palabra en la posición 1
        //hace un map de las palabras capitaliza a cada palabra y lo devuelve en palabrasCapitalizadas
    });

    // Une las palabras capitalizadas de nuevo en una cadena
    /*  console.log(palabrasCapitalizadas) */
    return palabrasCapitalizadas.join(" ");

}

// Función para corregir tildes en los nombres de las provincias
function corregirTildes(nombreProvincia) {
    switch (nombreProvincia) {
        case "Cordoba":
            return "Córdoba";
        case "Neuquen":
            return "Neuquén";
        case "Entre Rios":
            return "Entre Ríos";
        case "Rio Negro":
            return "Río Negro";
        case "Tucuman":
            return "Tucumán";
        case "Tierra del fuego":
            return "Tierra del Fuego, Antártida e Islas del Atlántico Sur";
        case "Islas Malvinas":
            return "Tierra del Fuego, Antártida e Islas del Atlántico Sur";
        default:
            return nombreProvincia;
    }
}

// Función para obtener las provincias
function obtenerProvincias() {
    const apiUrl = "https://apis.datos.gob.ar/georef/api/provincias";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Almacena los nombres de las provincias en la variable provincias
            provincias = data.provincias.map
                (provincia => provincia.nombre);
            console.log(provincias)
            // Llama a la función para verificar la provincia elegida
            verificarProvincia();
        })
        .catch(error => {
            console.error("Error al obtener datos de la API:", error);
        });


}

// Función para ingresar y verificar la provincia ingresada por prompt
function verificarProvincia() {
    let provinciaElegida = prompt("Ingresa una provincia: ");
    let provinciaCorrect = "";

    //Corregimos el prompt para guardar la provincia elegida corregida
    provinciaCorrect = primeraMayuscula(provinciaElegida);
    // Corrige las tildes en el nombre de la provincia y si no es null le ponemos trim para sacar espacios
    if (provinciaCorrect) {
        provinciaCorrect = corregirTildes(provinciaCorrect.trim());
    }

    // Verifica si la provincia ingresada está en el array de provincias y si no es nula
    while (!provinciaCorrect || !provincias.includes(provinciaCorrect)) {
        provinciaElegida = prompt("Ingresa una provincia válida: ");
        if (provinciaElegida === null) {
            // El usuario presionó "Cancelar", salir del bucle
            break;
        }
        provinciaCorrect = primeraMayuscula(provinciaElegida);
        provinciaCorrect = corregirTildes(provinciaCorrect);
    }

    console.log("Provincia elegida: " + provinciaCorrect);
    // Llama a la función para obtener la latitud y longitud de la provincia
    obtenerLatLonDeProvincia(provinciaCorrect);

    /* PASAMOS LOS DATOS AL FRONT */
    /* lo hacemos adentro de la función por la variable provinciaCorrect */
    if (provinciaCorrect) {
        const resultadoElement = document.getElementById("resultado");
        resultadoElement.textContent = "Provincia elegida: " + provinciaCorrect;
    } else {
        const resultadoElement = document.getElementById("resultado");
        resultadoElement.textContent = "Provincia elegida: " + "Ninguna";
        const climaInfo = document.getElementById('climaInfo');
        climaInfo.innerHTML = `<p></p>`;
    }
    generarListado();



}

// Función para obtener la latitud y longitud de la provincia por el nombre de la provincia
function obtenerLatLonDeProvincia(provincia) {
    //llamado a la api por el nombre en el parametro
    const apiUrl = `https://apis.datos.gob.ar/georef/api/provincias?nombre=${provincia}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            //si la provincia existe en la data
            const provinciaData = data.provincias[0];
            if (provinciaData) {
                const nombre = provinciaData.nombre
                const lat = provinciaData.centroide.lat;
                const lon = provinciaData.centroide.lon;
                console.log(nombre);
                console.log("Latitud: " + lat);
                console.log("Longitud: " + lon);

                // Llama la función obtenerClima() con latitud y longitud como parámetros
                obtenerClima(lat, lon);
                // Guardar en localStorage
                localStorage.setItem('provincia', nombre);
            } else {
                console.log("Provincia no encontrada.");
            }
        })
        .catch(error => {
            console.error("Error al obtener datos de la API de provincias:", error);
        });
}

// Función para obtener el clima
function obtenerClima(lat, lon) {
    const apiKey = '7149f0bf67b3a56c905a9609f8dbbeb8';

    // Redondear la latitud y longitud a dos decimales
    const latitud = lat.toFixed(2);
    const longitud = lon.toFixed(2);

    // API URL para obtener el clima basado en latitud y longitud y en celcius

    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitud}&lon=${longitud}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            temperaturaCelsius = data.current.temp.toFixed(2); // Temperatura con dos decimales
            console.log(temperaturaCelsius);
            const climaInfo = document.getElementById('climaInfo');

            // Define las condiciones y asigna los iconos correspondientes
            let icono = "";
            let mensaje = "";

            if (temperaturaCelsius < 5) {
                icono = "❄️❄️"; // Icono de frío
                mensaje = "Hace muuucho frío!";
            } else if (temperaturaCelsius >= 5 && temperaturaCelsius <= 15) {
                icono = "❄️"; // Icono de templado
                mensaje = "Esta fresco!";
            } 
            else if (temperaturaCelsius >= 15 && temperaturaCelsius <= 27) {
                icono = "🌡️"; // Icono de templado
                mensaje = "Temperatura agradable!";
            }
            else {
                icono = "☀️"; // Icono de calor
                mensaje = "Hace calor!";
            }

            // Genera el HTML dinámicamente con el mensaje y el icono
            climaInfo.innerHTML = `<p>${mensaje} Temperatura actual: ${temperaturaCelsius}°C ${icono}</p>`;

            // Guardar clima en localStorage
            localStorage.setItem('temperaturaCelsius', temperaturaCelsius);

            //Guardar la fecha de busqueda
            const obtenerFechaActual = () => {
                const fechaActual = new Date();

                // Obtener día, mes y año
                const dia = String(fechaActual.getDate()).padStart(2, '0');
                const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // ¡Ojo! Los meses en JavaScript van de 0 a 11
                const anio = fechaActual.getFullYear();

                // Formatear la fecha como "DD/MM/AAAA"
                const fechaFormateada = `${dia}/${mes}/${anio}`;
                return fechaFormateada;

            };

            const fechaActual = obtenerFechaActual();
            localStorage.setItem('fechaActual', fechaActual);

        })
        .catch(error => {
            console.error('Error al obtener datos del clima', error);
        });

}

// Llama a la función para obtener las provincias
obtenerProvincias();


// Función para generar un listado seleccionable de provincias
function generarListado() {
    const listado = document.getElementById("listado");

    // Crea un elemento <select> (lista desplegable)
    const selectElement = document.createElement("select");

    // Agrega un identificador (id) y un nombre (name) al elemento <select>
    selectElement.id = "provinciaSelect";
    selectElement.name = "provinciaSelect";

    // titulo
    /*     listado.innerHTML = `<p>Elegí una Provincia de la lista</p>`; */

    // Crea una opción por cada provincia en el array provincias
    provincias.forEach(provincia => {
        const optionElement = document.createElement("option");
        optionElement.value = provincia;
        optionElement.textContent = provincia;
        //lo agrego al listado
        selectElement.appendChild(optionElement);
    });

    // Agrega un evento para almacenar la provincia seleccionada
    selectElement.addEventListener("change", () => {
        provinciaSeleccionada = selectElement.value;
    });

    // Agrega el elemento <select> al listado
    listado.appendChild(selectElement);

    // Evento para obtener el clima al hacer clic en el botón

    obtenerClimaBtn.addEventListener("click", obtenerClimaSeleccionada);

    // Función para obtener el clima de la provincia seleccionada
    function obtenerClimaSeleccionada() {
        if (provinciaSeleccionada) {
            // Llama a la función para obtener la latitud y longitud de la provincia seleccionada
            obtenerLatLonDeProvincia(provinciaSeleccionada);

            //pasar el nombre al front
            const resultadoElement = document.getElementById("resultado");
            resultadoElement.textContent = "Provincia elegida: " + provinciaSeleccionada;
        }

    }

}

// Función para 
function recuperarAnterior() {
    const resultadoAnteriorElement = document.getElementById("resultadoAnterior");
    const temp = localStorage.getItem("temperaturaCelsius");
    const nombre = localStorage.getItem("provincia");
    const dia = localStorage.getItem("fechaActual");
    resultadoAnteriorElement.textContent = "El día " + dia + " " + "para la provincia de " + nombre + " " + "y hacían: " + temp + "°C";
}

recuperarAnterior();
