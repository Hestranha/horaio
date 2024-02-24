const colorInput = document.getElementById('color');
colorInput.value = '#ffffff';

function agregarCurso() {
    // Obtener los valores del formulario
    const nombreCurso = document.getElementById('nombre-curso').value;
    const diasSeleccionados = obtenerDiasSeleccionados();
    const horaInicio = obtenerHora(document.getElementById('hora-inicio').value);
    const horaFin = obtenerHora(document.getElementById('hora-fin').value);
    var colorSeleccionado = document.getElementById('color').value;

    // Validaciones
    if (nombreCurso == '') {
        Swal.fire({
            title: 'Advertencia',
            text: 'Complete el nombre del Curso',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (diasSeleccionados.length == 0) {
        Swal.fire({
            title: 'Advertencia',
            text: 'Seleccione al menos un día',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (horaInicio == '') {
        Swal.fire({
            title: 'Advertencia',
            text: 'Especifique la hora de Inicio',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (horaFin == '') {
        Swal.fire({
            title: 'Advertencia',
            text: 'Especifique la hora de Fin',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    console.log(horaInicio, horaFin);
    const minutosInicio = parseInt(horaInicio.split(':')[0], 10) * 60 + parseInt(horaInicio.split(':')[1], 10);
    const minutosFin = parseInt(horaFin.split(':')[0], 10) * 60 + parseInt(horaFin.split(':')[1], 10);
    if (minutosFin < minutosInicio) {
        Swal.fire({
            title: 'Advertencia',
            text: 'La hora Fin es menor que hora Inicio',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
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
