generarColorPastel();
//***************************************************************
//***************************************************************
//***************************************************************
//***************************************************************
// Obtén la referencia al checkbox "borrarTodos"
var checkboxBorrarTodos = document.getElementById('borrarTodos');
// Agrega un evento de cambio al checkbox "borrarTodos"
checkboxBorrarTodos.addEventListener('change', function () {
    // Obtén todos los checkboxes dentro de .infoCursos
    var checkboxesInfoCursos = document.querySelectorAll('.infoCursos input[type="checkbox"]');

    // Recorre todos los checkboxes y establece su propiedad checked según el estado del checkbox "borrarTodos"
    checkboxesInfoCursos.forEach(function (checkbox) {
        checkbox.checked = checkboxBorrarTodos.checked;
    });
});
//***************************************************************
//***************************************************************
function toggleDetalles() {
    var detallesContent = document.querySelector('.detalles-content');
    detallesContent.style.display = detallesContent.style.display === 'none' ? 'flex' : 'none';
}

//***************************************************************
//***************************************************************
function generarColorPastel() {
    // Generar componentes de color RGB para un color pastel
    var r = Math.floor(Math.random() * 100) + 155; // Rojo en el rango 155-255
    var g = Math.floor(Math.random() * 100) + 155; // Verde en el rango 155-255
    var b = Math.floor(Math.random() * 100) + 155; // Azul en el rango 155-255

    // Convertir componentes RGB a formato hexadecimal
    var colorHex = '#' + r.toString(16) + g.toString(16) + b.toString(16);

    // Establecer el valor en el elemento de entrada de color
    var colorInput = document.getElementById('color');
    colorInput.value = colorHex;

}
var ultimoValor;
var contieneSeisO7;
var idsCumplidos = [];
var cursos = [];
let indice = 1;
var estado = [];
var verificarUltimaHora = '19:30'
function agregarCurso() {
    idsCumplidos.splice(0, idsCumplidos.length);
    // Obtener los valores del formulario
    const nombreCurso = document.getElementById('nombre-curso').value;
    const diasSeleccionados = obtenerDiasSeleccionados();
    const horaInicio = obtenerHora(document.getElementById('hora-inicio').value);
    const horaFin = obtenerHora(document.getElementById('hora-fin').value);
    var colorSeleccionado = document.getElementById('color').value;
    var checkbox = document.getElementById('fusionar-celdas');
    if (horaInicio >= verificarUltimaHora) {
        Swal.fire({
            title: 'Límite superado',
            text: 'La hora inicio es mayor a la hora final',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (nombreCurso == '' && diasSeleccionados.length == 0 && horaInicio == '' && horaFin == '') {
        Swal.fire({
            title: 'Datos incompletos',
            text: 'Debe llenar la información de un curso',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return 0;
    }
    if (validacion() == 0) {
        return;
    }
    generarColorPastel();

    var filas = document.getElementById('horario-mostrado').getElementsByTagName('tr');

    var ultimaHoraMenorInicio = '';
    var ultimaHoraMenorFin = '';

    for (var i = 1; i < filas.length; i++) {
        // Obtener la hora de inicio de la fila actual (asumiendo que está en el formato hh:mm)
        var horaFilaInicio = filas[i].querySelector('th').innerText.split(' - ')[0];
        // Obtener la hora de fin de la fila actual (asumiendo que está en el formato hh:mm)
        var horaFilaFin = filas[i].querySelector('th').innerText.split(' - ')[1];
        // Verificar si la hora de inicio o la hora de fin está dentro del rango

        if (horaFilaFin > horaInicio && horaFilaInicio <= horaFin) {
            //console.log(`horaFilaFin > horaInicio &&  horaFilaInicio <= horaFin`);
            //console.log(` ${horaFilaFin} > ${horaInicio} &&  ${horaFilaInicio} <= ${horaFin}`);
            // Asignar la última hora menor que la hora de inicio y fin proporcionadas
            //console.log('----------', horaFilaInicio);

            if (horaFilaInicio <= horaInicio) {
                ultimaHoraMenorInicio = horaFilaInicio;
                //console.log('Ultima hora MENOR: ', ultimaHoraMenorInicio);
            }
            if (horaFilaFin <= horaFin) {
                ultimaHoraMenorFin = horaFilaFin;
                //console.log('Ultima hora MAYOR:', ultimaHoraMenorFin);
            }

            // Agregar la fila actual al array idsCumplidos
            //console.log(filas[i].querySelector('th').id);
            idsCumplidos.push(filas[i].querySelector('th').id);
            if (horaFilaFin == horaFin) {
                break;
            }
        }
    }
    //console.log('id maximo: ', idsCumplidos);
    // Crear un array para almacenar los resultados finales
    var resultados = [];
    //console.log(resultados);
    // Bucle externo para iterar sobre los IDs cumplidos
    for (var i = 0; i < idsCumplidos.length; i++) {
        var idCumplido = idsCumplidos[i];

        // Bucle interno para iterar sobre los días seleccionados
        for (var j = 0; j < diasSeleccionados.length; j++) {
            var diaSeleccionado = diasSeleccionados[j];

            // Combinar el ID de la fila con el número del día y agregar al array de resultados
            var resultado = idCumplido + '-' + diaSeleccionado;
            resultados.push(resultado);
        }
    }
    var hayDuplicados = false;
    if (cursos.length !== 0) {
        for (var i = 0; i < cursos.length; i++) {
            var cursoExistente = cursos[i];
            var celdasExistente = cursoExistente.celdas;

            for (var j = 0; j < resultados.length; j++) {
                if (celdasExistente.includes(resultados[j])) {
                    hayDuplicados = true;
                    break;
                }
            }

            if (hayDuplicados) {
                //console.log('¡Celdas duplicadas encontradas!');
                Swal.fire({
                    title: 'Error',
                    text: 'El curso interfiere con otro',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                break;
            }
        }
    }
    if (!hayDuplicados) {
        // Imprimir los resultados en la consola
        //console.log("Resultados:", resultados);
        var nuevoCurso = {
            "id": indice,
            "nombre": nombreCurso,
            "celdas": resultados,
            "dias": diasSeleccionados,
            "hora": [horaInicio, horaFin],
        };
        cursos.push(nuevoCurso);
        indice += 1;
        //console.log(nuevoCurso);
        // Bucle para iterar sobre los resultados
        for (var i = 0; i < resultados.length; i++) {
            var idResultado = resultados[i];

            // Obtener la celda correspondiente a la combinación de fila y día
            var celda = document.getElementById(idResultado);
            //console.log(colorSeleccionado);
            // Verificar si la celda existe antes de actualizar su contenido
            if (celda) {
                // Actualizar el contenido de la celda con el nombre del curso
                //console.log(` ${ultimaHoraMenorInicio} == ${horaInicio} &&  ${ultimaHoraMenorFin} == ${horaFin}`);
                if (ultimaHoraMenorInicio == horaInicio && ultimaHoraMenorFin == horaFin) {
                    celda.innerText = nombreCurso;
                } else {
                    celda.innerText = nombreCurso + '\n(' + horaInicio + '-' + horaFin + ')';
                }

                celda.style.backgroundColor = colorSeleccionado;
            }
        }

        if (checkbox.checked) {
            fusionarCeldasAutomaticamente(resultados);
        }

        var longitudArray = idsCumplidos.length;
        //console.log(longitudArray);
        if (ultimoValor == null) {
            ultimoValor = idsCumplidos[longitudArray - 1].replace('f', '');
        } else {
            aaa = idsCumplidos[longitudArray - 1].replace('f', '');
            var numeroUltimoValor = parseFloat(ultimoValor);
            var numeroAaa = parseFloat(aaa);
            //console.log(aaa);
            //console.log(ultimoValor);
            if (numeroAaa > numeroUltimoValor) {
                ultimoValor = aaa;
            }
        }
        //ultimoValor = idsCumplidos[longitudArray - 1].replace('f', '');
        //console.log(ultimoValor);
        //console.log('valor final: ', ultimoValor);
        //console.log(diasSeleccionados);
        contieneSeisO7 = diasSeleccionados.includes('6') || diasSeleccionados.includes('7'); // true o false
        //console.log(contieneSeisO7);


        //resultados.splice(0, resultados.length);
        //limpiar
        //document.getElementById('nombre-curso').value = "";
        Swal.fire({
            title: 'Listo',
            text: 'Se agregó el curso exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });

    }

}
/*
var cursos = {
    curso1: {
        id: 1,
        nombre: "Curso 1",
        celdas: 20,
        dias: [1, 2],
        hora: ["10:00 AM", "12:00 PM"]
    },
    curso2: {
        id: 2,
        nombre: "Curso 2",
        celdas: 15,
        dias: [3, 5],
        hora: ["2:00 PM", "4:00 PM"]
    }
};
*/
function fusionarCeldasAutomaticamente(resultados) {
    // Obtener todas las filas afectadas
    var filasAfectadas = {};
    for (var i = 0; i < resultados.length; i++) {
        var filaDia = resultados[i].split('-');
        var fila = filaDia[0];
        var dia = filaDia[1];
        if (!filasAfectadas[dia]) {
            filasAfectadas[dia] = [];
        }
        filasAfectadas[dia].push(fila);
    }
    //console.log('FUSION: ', filasAfectadas);
    // Fusionar las celdas por día
    for (var dia in filasAfectadas) {
        var filas = filasAfectadas[dia];
        if (filas.length > 1) {
            // Obtener las celdas de la columna para fusionar
            var celdasAFusionar = filas.map(function (fila) {
                return document.getElementById(fila + '-' + dia);
            });
            fusionarCeldas(celdasAFusionar);
        }
    }
}

function fusionarCeldas(celdas) {
    if (celdas.length > 1) {
        // Fusionar las celdas solo si hay más de una
        var primeraCelda = celdas[0];
        for (var i = 1; i < celdas.length; i++) {
            // Configurar el contenido de la primera celda y eliminar las celdas restantes
            primeraCelda.rowSpan += celdas[i].rowSpan;
            celdas[i].parentNode.removeChild(celdas[i]);
        }
    }
}
//borrarCurso();
function borrarCurso() {
    if (cursos.length == 0) {
        Swal.fire({
            title: 'te falla no?',
            text: 'No hay ningún curso',
            icon: 'question',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    let ventanaEmergente = document.getElementById('ventanaEmergente');
    ventanaEmergente.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    let infoCursosContainer = document.getElementById("infoCursos");
    infoCursosContainer.innerHTML = "";
    const nombresDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    for (let key in cursos) {
        let curso = cursos[key];
        if (cursos.hasOwnProperty(key)) {
            // Obtener nombres de días en lugar de números
            let nombresDiasSeleccionados = curso.dias.map(dia => nombresDias[dia - 1]);

            infoCursosContainer.innerHTML += `
            <div class="container-curso">
                <h2 class="m-nombre-curso">- ${curso.nombre}</h2>
                <p>Duración: ${curso.hora[0]} - ${curso.hora[1]}</p>
                <p>Días: ${nombresDiasSeleccionados.join(', ')}</p>
                <div class="xd">
                    <input class="borrar-checkbox" type="checkbox" value="${curso.id}"/>
                </div>
            </div><hr>
            `;
        }
    }
    //infoCursosContainer.innerHTML += `<p>Celdas: ${curso.celdas}</p>`;

    ventanaEmergente.addEventListener('click', function (event) {
        if (event.target === ventanaEmergente) {
            cerrarVentanaEmergente();
        }
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            cerrarVentanaEmergente();
        }
    });
}

function cerrarVentanaEmergente() {
    var ventanaEmergente = document.getElementById('ventanaEmergente');
    ventanaEmergente.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function actualizarCeldas(celdasId) {
    // Iterar sobre el array de celdasId
    celdasId.forEach(function (id) {
        // Extraer información de fila y columna del id
        var fila = id.split('-')[0].substring(1); // Obtener el número de fila
        var columna = id.split('-')[1]; // Obtener el número de columna

        // Encontrar la fila correspondiente en la tabla
        var filaElemento = document.getElementById(fila);

        // Verificar si la fila existe
        if (filaElemento) {
            // Buscar la celda correspondiente en la fila
            var celda = filaElemento.querySelector('#' + id);

            // Verificar si la celda existe
            if (celda) {
                // Si la celda existe, reemplazarla por una nueva celda con el mismo ID
                var nuevaCelda = document.createElement('td');
                nuevaCelda.id = id;
                celda.parentNode.replaceChild(nuevaCelda, celda);
            } else {
                // Si la celda no existe, crear una nueva celda con el ID proporcionado
                var nuevaCelda = document.createElement('td');
                nuevaCelda.id = id;
                filaElemento.appendChild(nuevaCelda);
            }

            // Obtener todas las celdas de la fila y ordenarlas
            var celdas = Array.from(filaElemento.getElementsByTagName('td'));
            celdas.sort(function (a, b) {
                var numeroA = parseInt(a.id.split('-')[1]);
                var numeroB = parseInt(b.id.split('-')[1]);
                return numeroA - numeroB;
            });

            // Volver a agregar las celdas a la fila en el nuevo orden
            celdas.forEach(function (celda) {
                filaElemento.appendChild(celda);
            });
        }
    });
}

function confirmarBorrarCurso() {
    const checkboxes = document.querySelectorAll('.infoCursos input[type="checkbox"]');
    let cursosSeleccionados = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    //console.log(cursosSeleccionados);
    if (cursosSeleccionados.length > 0) {
        for (let i = 0; i < cursosSeleccionados.length; i++) {
            let cursoId = cursosSeleccionados[i];
            let index = cursos.findIndex(curso => curso.id === parseInt(cursoId));

            if (index !== -1) {
                let cursoEncontrado = cursos[index];
                //console.log(`Celdas del curso con ID ${cursoId}:`, cursoEncontrado.celdas);
                // Iterar sobre los IDs de las celdas y borrar su contenido
                //console.log('aaaaaa: ', cursoEncontrado.celdas);
                actualizarCeldas(cursoEncontrado.celdas);
                cursoEncontrado.celdas.forEach(celdaId => {
                    let celda = document.getElementById(celdaId);
                    if (celda) {
                        celda.textContent = '';
                        celda.style.backgroundColor = '#ffffff';
                    }
                });
                // Borrar el curso del array 'cursos'
                cursos.splice(index, 1);
                //console.log(`Curso con ID ${cursoId} eliminado.`);
            } else {
                console.log(`No se encontró el curso con ID ${cursoId}`);
            }
        }
        cerrarVentanaEmergente();
        Swal.fire({
            title: 'Listo',
            text: 'Se borro exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    } else {
        Swal.fire({
            title: '',
            text: 'Debe seleccionar al menos un curso',
            icon: 'info',
            confirmButtonText: 'Aceptar'
        });
    }

}


function validacion() {
    const nombreCurso = document.getElementById('nombre-curso').value;
    const diasSeleccionados = obtenerDiasSeleccionados();
    const horaInicio = obtenerHora(document.getElementById('hora-inicio').value);
    const horaFin = obtenerHora(document.getElementById('hora-fin').value);
    if (nombreCurso == '') {
        Swal.fire({
            title: 'Insuficiente',
            text: 'Complete el nombre del Curso',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return 0;
    }
    if (diasSeleccionados.length == 0) {
        Swal.fire({
            title: 'Insuficiente',
            text: 'Seleccione al menos un día',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return 0;
    }
    if (horaInicio == '') {
        Swal.fire({
            title: 'Insuficiente',
            text: 'Especifique la hora de Inicio',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return 0;
    }
    if (horaFin == '') {
        Swal.fire({
            title: 'Insuficiente',
            text: 'Especifique la hora de Fin',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return 0;
    }
    const minutosInicio = parseInt(horaInicio.split(':')[0], 10) * 60 + parseInt(horaInicio.split(':')[1], 10);
    const minutosFin = parseInt(horaFin.split(':')[0], 10) * 60 + parseInt(horaFin.split(':')[1], 10);
    if (minutosFin < minutosInicio) {
        Swal.fire({
            title: 'Advertencia',
            text: 'La hora Fin es menor que hora Inicio',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return 0;
    }
    return 1;
}
function obtenerDiasSeleccionados() {
    const checkboxes = document.querySelectorAll('input[name="days"]:checked');
    const diasSeleccionados = [];
    // Iterar sobre los checkboxes y agregar los valores al array
    checkboxes.forEach((checkbox) => {
        diasSeleccionados.push(checkbox.value.toLowerCase());
    });
    return diasSeleccionados;
}

function obtenerHora(hora) {
    return hora.trim();
}

function descargarHorario() {
    if (cursos.length === 0) {
        Swal.fire({
            title: 'Error',
            text: 'Ingrese al menos un curso',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    Swal.fire({
        title: 'Advertencia',
        text: 'q tenga buen dia',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (!result.isConfirmed) {
            console.log('Aceptar clicado');
            return;
        }
        var elementosAOcultar = [];
        var numeroUltimoValor = parseInt(ultimoValor, 10);
        numeroUltimoValor += 1;
        for (var i = numeroUltimoValor; i <= 15; i++) {
            var elemento = document.getElementById(i.toString());
            if (elemento) {
                elementosAOcultar.push(elemento);
            }
        }
        if (!contieneSeisO7) {
            // Identificar elementos con IDs que contienen 'f6' o 'f7'
            for (var i = 6; i <= 7; i++) {
                for (var j = 1; j <= 15; j++) {
                    var elemento = document.getElementById('f' + j + '-' + i);
                    if (elemento) {
                        elementosAOcultar.push(elemento);
                    }
                }
            }
            var elementoS6 = document.getElementById('s6');
            var elementoD7 = document.getElementById('d7');
            if (elementoS6) {
                elementosAOcultar.push(elementoS6);
            }
            if (elementoD7) {
                elementosAOcultar.push(elementoD7);
            }
        }
        var estilosOriginales = [];
        elementosAOcultar.forEach(function (elemento) {
            estilosOriginales.push({
                elemento: elemento,
                displayStyle: elemento.style.display
            });
        });
        elementosAOcultar.forEach(function (elemento) {
            elemento.style.display = 'none';
        });

        var anchoTabla = document.getElementById('miHorario').scrollWidth;
        var altoTabla = document.getElementById('miHorario').scrollHeight;

        var esDispositivoMovil = window.innerWidth < 768;

        var opcionesHtml2Canvas = {
            width: esDispositivoMovil ? anchoTabla : null,
            height: esDispositivoMovil ? altoTabla : null,
            scale: 1.5,
            logging: true,
            allowTaint: true,
            useCORS: true,
            backgroundColor: null,
            imageTimeout: 0,
            quality: 2,
        };

        // Utilizar html2canvas con las opciones configuradas
        html2canvas(document.getElementById('miHorario'), opcionesHtml2Canvas).then(function (canvas) {
            // Crear un enlace para la descarga
            var enlaceDescarga = document.createElement('a');

            // Convertir el canvas a una URL de datos (data URL)
            var imagenURL = canvas.toDataURL('image/png');

            // Asignar la URL de la imagen al enlace de descarga
            enlaceDescarga.href = imagenURL;

            // Asignar el nombre del archivo
            enlaceDescarga.download = 'horario.png';

            // Simular un clic en el enlace para iniciar la descarga
            enlaceDescarga.click();

            // Restaurar los estilos originales después de 3 segundos
            setTimeout(function () {
                estilosOriginales.forEach(function (estilo) {
                    estilo.elemento.style.display = estilo.displayStyle;
                });
            }, 2000);
        });
    });

}

function actualizarHorario() {
    const horarioInicioInput = obtenerHora(document.getElementById('horario-inicio').value);
    const horarioIntervaloInput = parseInt(obtenerHora(document.getElementById('horario-intervalo').value));

    // Verificar que los valores sean válidos
    if (horarioInicioInput === '' || isNaN(horarioIntervaloInput)) {
        //console.log('Por favor, ingrese valores válidos para la hora de inicio y el intervalo.');
        Swal.fire({
            title: 'Datos incompletos',
            text: 'Debe especificar el inicio del horario',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Crear un objeto Date con la hora de inicio
    var fechaInicio = new Date('2000-01-01T' + horarioInicioInput + ':00');

    // Inicializar el array de tiempoIntervalo
    var tiempoIntervalo = [];

    // Calcular y agregar intervalos al array
    for (var i = 0; i < 15; i++) {
        // Clonar la fecha de inicio
        var nuevaFecha = new Date(fechaInicio);

        // Sumar el intervalo a los minutos
        nuevaFecha.setMinutes(nuevaFecha.getMinutes() + horarioIntervaloInput * i);

        // Formatear las horas y minutos
        var horaInicio = nuevaFecha.getHours().toString().padStart(2, '0');
        var minutoInicio = nuevaFecha.getMinutes().toString().padStart(2, '0');

        // Calcular los minutos finales y la hora final
        var minutosFinales = nuevaFecha.getMinutes() + horarioIntervaloInput;
        var horaFinal = nuevaFecha.getHours();

        // Ajustar si los minutos superan 60
        if (minutosFinales >= 60) {
            minutosFinales -= 60;
            horaFinal += 1;
        }

        // Formatear la hora y minutos finales
        var horaFinalFormateada = horaFinal.toString().padStart(2, '0');
        var minutosFinalesFormateados = minutosFinales.toString().padStart(2, '0');

        tiempoIntervalo.push(`${horaInicio}:${minutoInicio} - ${horaFinalFormateada}:${minutosFinalesFormateados}`);
    }

    //console.log(tiempoIntervalo);
    //console.log(tiempoIntervalo.length);

    for (var i = 0; i < tiempoIntervalo.length; i++) {
        //console.log('f' + (i + 1));
        var idFila = 'f' + (i + 1);
        var contenidoIntervalo = tiempoIntervalo[i];
        //console.log(contenidoIntervalo);
        var elementoFila = document.getElementById(idFila);
        //console.log(elementoFila);
        if (elementoFila) {
            //console.log(elementoFila);
            elementoFila.innerText = contenidoIntervalo;

        }
    }
    ultimaHoraFila = tiempoIntervalo[tiempoIntervalo.length - 1];
    const partes = ultimaHoraFila.split(' - ');
    verificarUltimaHora = partes[1];
    //console.log(verificarUltimaHora);
    Swal.fire({
        title: 'Listo',
        text: 'Se actualizó el horario exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
}
/*
⠀⠀⠀⠀⠀⠀⠀⢠⣿⣶⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣄⣀⡀⣠⣾⡇⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀ 
⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⢿⣿⣿⡇⠀⠀⠀⠀ 
⣶⣿⣦⣜⣿⣿⣿⡟⠻⣿⣿⣿⣿⣿⣿⣿⡿⢿⡏⣴⣺⣦⣙⣿⣷⣄⠀⠀⠀ 
⣯⡇⣻⣿⣿⣿⣿⣷⣾⣿⣬⣥⣭⣽⣿⣿⣧⣼⡇⣯⣇⣹⣿⣿⣿⣿⣧⠀⠀ 
⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣷
*/

