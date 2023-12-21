const { DateTime } = luxon;

let provinciaSeleccionada = null;
let temperaturaCelsius = null;
let generarListadoEjecutado = false;

const obtenerClimaBtn = document.getElementById("obtenerClimaBtn");
const reiniciarBtn = document.getElementById("reiniciarBtn");

reiniciarBtn.addEventListener("click", obtenerProvincias);

function primeraMayuscula(texto) {
    if (texto == null) {
        return null;
    }
    const palabras = texto.split(" ");
    const palabrasCapitalizadas = palabras.map(palabra => {
        if (palabra.length === 0) {
            return palabra;
        }
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    });

    return palabrasCapitalizadas.join(" ");
}

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

function obtenerProvincias() {
    const apiUrl = "https://apis.datos.gob.ar/georef/api/provincias";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            provincias = data.provincias.map
                (provincia => provincia.nombre);
            verificarProvincia();
        })
        .catch(error => {
            console.error("Error al obtener datos de la API:", error);
        });
}

function verificarProvincia() {
    let provinciaElegida = ""
    let provinciaCorrect = "";

    provinciaCorrect = primeraMayuscula(provinciaElegida);
    if (provinciaCorrect) {
        provinciaCorrect = corregirTildes(provinciaCorrect.trim());
    }

    obtenerLatLonDeProvincia(provinciaCorrect);

    if (provinciaCorrect) {
        const resultadoElement = document.getElementById("resultado");
        resultadoElement.innerHTML = `<div class="text-center"> <h2> ${provinciaCorrect} </h2> </div>`

    } else {
        const resultadoElement = document.getElementById("resultado");
        resultadoElement.textContent = "Provincia elegida: " + "Ninguna";
        const climaInfo = document.getElementById('climaInfo');
        climaInfo.innerHTML = `<p></p>`;
    }
    if (!generarListadoEjecutado) {
        generarListado();
        generarListadoEjecutado = true; 
    }
}

function obtenerLatLonDeProvincia(provincia) {
    const apiUrl = `https://apis.datos.gob.ar/georef/api/provincias?nombre=${provincia}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const provinciaData = data.provincias[0];
            if (provinciaData) {
                const nombre = provinciaData.nombre
                const lat = provinciaData.centroide.lat;
                const lon = provinciaData.centroide.lon;
                obtenerClima(lat, lon);
                localStorage.setItem('provincia', nombre);
            } 
        })
        .catch(error => {
            console.error("Error al obtener datos de la API de provincias:", error);
        });
}

function obtenerClima(lat, lon) {
    const apiKey = '7149f0bf67b3a56c905a9609f8dbbeb8';
    const latitud = lat.toFixed(2);
    const longitud = lon.toFixed(2);
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitud}&lon=${longitud}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            temperaturaCelsius = data.current.temp.toFixed(2); 
            const climaInfo = document.getElementById('climaInfo');
            let icono = "";
            let mensaje = "";
            if (temperaturaCelsius < 5) {
                icono = "❄️❄️";
                mensaje = "Hace muuucho frío!";
            } else if (temperaturaCelsius >= 5 && temperaturaCelsius <= 15) {
                icono = "❄️";
                mensaje = "Esta fresco!";
            }
            else if (temperaturaCelsius >= 15 && temperaturaCelsius <= 27) {
                icono = "🌡️";
                mensaje = "Temperatura agradable!";
            }
            else {
                icono = "☀️";
                mensaje = "Hace calor!";
            }

            localStorage.setItem('temperaturaCelsius', temperaturaCelsius);

            const obtenerFechaActual = () => {
                const fechaActual = DateTime.now().toFormat('dd/LL/yyyy');
                const horario = DateTime.now().toFormat('HH:mm');

                localStorage.setItem('horario', horario);

                climaInfo.innerHTML = `<div class="text-center">
                <div class="container mt-4">
                <div class="card">
                    <div class="card-body">
                        <p class="card-title">${icono}</p>
                        <p class="card-text">${mensaje}</p>
                        <p class="card-text">Temperatura el día ${fechaActual} a las ${horario}: <br> ${temperaturaCelsius}°C</p>
                    </div>
                </div>
            </div>`;

                return fechaActual;
            };
            const fechaActual = obtenerFechaActual();
            localStorage.setItem('fechaActual', fechaActual);
        })
        .catch(error => {
            console.error('Error al obtener datos del clima', error);
        });
}

obtenerProvincias();

function generarListado() {
    const listado = document.getElementById("listado");
    const selectElement = document.createElement("select");
    selectElement.id = "provinciaSelect";
    selectElement.name = "provinciaSelect";

    const provinciasList = ["Selecciona acá!", ...provincias];

    provinciasList.forEach(provincia => {
        const optionElement = document.createElement("option");
        optionElement.value = provincia;
        optionElement.textContent = provincia;
        selectElement.appendChild(optionElement);
    });

    selectElement.addEventListener("change", () => {
        provinciaSeleccionada = selectElement.value;
    });

    listado.appendChild(selectElement);

    obtenerClimaBtn.addEventListener("click", obtenerClimaSeleccionada);
}

function obtenerClimaSeleccionada(provincia) {
    if (provinciaSeleccionada) {
        obtenerLatLonDeProvincia(provinciaSeleccionada);
        const resultadoElement = document.getElementById("resultado");
        resultadoElement.innerHTML = `<div class="text-center"> <h2> ${provinciaSeleccionada} </h2> </div>`
    }
}

function recuperarAnterior() {
    const resultadoAnteriorElement = document.getElementById("resultadoAnterior");
    const temp = localStorage.getItem("temperaturaCelsius");
    const horario = localStorage.getItem("horario")
    const nombre = localStorage.getItem("provincia");
    const dia = localStorage.getItem("fechaActual");

    resultadoAnteriorElement.innerHTML = `<div class="text-justify"> <p> El dia ${dia} a la hora ${horario} para la provincia de ${nombre} y hacian ${temp} °C </p> </div>`;
}

recuperarAnterior();