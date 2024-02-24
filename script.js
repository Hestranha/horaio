const colorInput = document.getElementById('color');
colorInput.value = '#ffffff';

var ultimoValor;
var contieneSeisO7;

function agregarCurso() {
    // Obtener los valores del formulario
    const nombreCurso = document.getElementById('nombre-curso').value;
    const diasSeleccionados = obtenerDiasSeleccionados();
    const horaInicio = obtenerHora(document.getElementById('hora-inicio').value);
    const horaFin = obtenerHora(document.getElementById('hora-fin').value);
    var colorSeleccionado = document.getElementById('color').value;

    if (validacion() == 0) {
        return;
    }


    var filas = document.getElementById('horario-mostrado').getElementsByTagName('tr');
    var idsCumplidos = [];
    for (var i = 1; i < filas.length; i++) {
        // Obtener la hora de inicio de la fila actual (asumiendo que está en el formato hh:mm)
        var horaFilaInicio = filas[i].querySelector('th').innerText.split(' - ')[0];

        // Obtener la hora de fin de la fila actual (asumiendo que está en el formato hh:mm)
        var horaFilaFin = filas[i].querySelector('th').innerText.split(' - ')[1];

        // Verificar si la hora de inicio está dentro del rango
        if (horaFilaInicio >= horaInicio && horaFilaInicio <= horaFin) {
            console.log(filas[i].querySelector('th').id);
            idsCumplidos.push(filas[i].querySelector('th').id);
        } else {
            // Verificar si la hora de fin está dentro del rango
            if (horaFilaFin >= horaInicio && horaFilaFin <= horaFin) {
                console.log(filas[i].querySelector('th').id);
                idsCumplidos.push(filas[i].querySelector('th').id);
            }
        }
    }
    console.log('id maximo: ', idsCumplidos);
    // Crear un array para almacenar los resultados finales
    var resultados = [];

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

    // Imprimir los resultados en la consola
    console.log("Resultados:", resultados);
    // Bucle para iterar sobre los resultados
    for (var i = 0; i < resultados.length; i++) {
        var idResultado = resultados[i];

        // Obtener la celda correspondiente a la combinación de fila y día
        var celda = document.getElementById(idResultado);
        console.log(colorSeleccionado);
        // Verificar si la celda existe antes de actualizar su contenido
        if (celda) {
            // Actualizar el contenido de la celda con el nombre del curso
            celda.innerText = nombreCurso + '\n(' + horaInicio + '-' + horaFin + ')';
            celda.style.backgroundColor = colorSeleccionado;
        }
    }

    var longitudArray = idsCumplidos.length;

    ultimoValor = idsCumplidos[longitudArray - 1].replace('f', ''); // ultima Fila
    console.log(ultimoValor);
    contieneSeisO7 = diasSeleccionados.includes(6) || diasSeleccionados.includes(7); // true o false
    console.log(contieneSeisO7);
}
function validacion() {
    const nombreCurso = document.getElementById('nombre-curso').value;
    const diasSeleccionados = obtenerDiasSeleccionados();
    const horaInicio = obtenerHora(document.getElementById('hora-inicio').value);
    const horaFin = obtenerHora(document.getElementById('hora-fin').value);
    if (nombreCurso == '') {
        Swal.fire({
            title: 'Advertencia',
            text: 'Complete el nombre del Curso',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return 0;
    }
    if (diasSeleccionados.length == 0) {
        Swal.fire({
            title: 'Advertencia',
            text: 'Seleccione al menos un día',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return 0;
    }
    if (horaInicio == '') {
        Swal.fire({
            title: 'Advertencia',
            text: 'Especifique la hora de Inicio',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return 0;
    }
    if (horaFin == '') {
        Swal.fire({
            title: 'Advertencia',
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
    // Obtener todos los elementos checkbox de días
    const checkboxes = document.querySelectorAll('input[name="days"]:checked');
    // Crear un array para almacenar los días seleccionados
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
    if (validacion() == 0) {
        return;
    }
    var numeroUltimoValor = parseInt(ultimoValor, 10);  // 10 es la base numérica
    numeroUltimoValor += 1;
    console.log(typeof numeroUltimoValor);
    for (var i = numeroUltimoValor; i <= 15; i++) {
        var elemento = document.getElementById(i.toString());
        console.log('aaaaaaaaaaaa');
        if (elemento) {
            elemento.style.display = 'none';
        }
    }
    if (!contieneSeisO7) {
        // Ocultar elementos con IDs que contienen 'f6' o 'f7'
        for (var i = 6; i <= 7; i++) {
            for (var j = 1; j <= 15; j++) {
                var elemento = document.getElementById('f' + j + '-' + i);
                if (elemento) {
                    elemento.style.display = 'none';
                }
            }
        }
        var elemento = document.getElementById('s6');
        if (elemento) {
            elemento.style.display = 'none';
        }
        var elemento = document.getElementById('d7');
        if (elemento) {
            elemento.style.display = 'none';
        }
    }
    // Obtener el ancho y alto actual de la tabla
    var anchoTabla = document.getElementById('miHorario').scrollWidth;
    var altoTabla = document.getElementById('miHorario').scrollHeight;

    // Verificar si es un dispositivo móvil (ancho de la ventana menor que 768 píxeles)
    var esDispositivoMovil = window.innerWidth < 768;

    // Configurar las opciones para html2canvas según el dispositivo
    var opcionesHtml2Canvas = {
        width: esDispositivoMovil ? anchoTabla : null, // Si es dispositivo móvil, ajustar el ancho al ancho de la tabla
        height: esDispositivoMovil ? altoTabla : null, // Si es dispositivo móvil, ajustar la altura al alto de la tabla
        scale: 2, // Ajustar la resolución (puedes aumentar o disminuir según sea necesario)
        logging: true, // Habilitar el registro para ver si hay mensajes de error
        allowTaint: true,
        useCORS: true,
        backgroundColor: null, // Puedes establecer un color de fondo si es necesario
        imageTimeout: 0, // Deshabilitar el tiempo de espera para las imágenes
        quality: 2, // Ajustar la calidad de la imagen (puedes ajustar según sea necesario)
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
        enlaceDescarga.download = 'horario_con_estilo.png';

        // Simular un clic en el enlace para iniciar la descarga
        enlaceDescarga.click();
        location.reload();
    });
    
}





