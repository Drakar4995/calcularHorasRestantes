document.addEventListener("DOMContentLoaded", function () {
    // Capturar los elementos del DOM
    const horasTotales = document.getElementById("horasTotales");
    const entrada = document.getElementById("entrada");
    const salidaAlmuerzo = document.getElementById("salida_almuerzo");
    const vueltaAlmuerzo = document.getElementById("vuelta_almuerzo");
    const totalAlmuerzo = document.getElementById("total_almuerzo");

    const salidaComida = document.getElementById("salida_comida");
    const vueltaComida = document.getElementById("vuelta_comida");
    const totalComida = document.getElementById("total_comida");

    const salida = document.getElementById("salida");

    const btn_entrada = document.getElementById("btn_entrada");
    const btn_salida_almuerzo = document.getElementById("btn_salida_almuerzo");
    const btn_vuelta_almuerzo = document.getElementById("btn_vuelta_almuerzo");
    const btn_salida_comida = document.getElementById("btn_salida_comida");
    const btn_vuelta_comida = document.getElementById("btn_vuelta_comida");

    // Función para asignar la hora actual a un input
    function SetNowToInput(id) {
        const now = new Date();
        const horas = now.getHours().toString().padStart(2, "0");
        const minutos = now.getMinutes().toString().padStart(2, "0");
        document.getElementById(id).value = `${horas}:${minutos}`;
        calcularTotal(); // Recalcular todo cuando se actualice un input
    }

    // Asociar eventos a los botones
    btn_salida_almuerzo.addEventListener("click", () => SetNowToInput("salida_almuerzo"));
    btn_vuelta_almuerzo.addEventListener("click", () => SetNowToInput("vuelta_almuerzo"));
    btn_salida_comida.addEventListener("click", () => {SetNowToInput("salida_comida"); setVueltaComida()});
    btn_vuelta_comida.addEventListener("click", () => SetNowToInput("vuelta_comida"));
    btn_entrada.addEventListener("click", () => SetNowToInput("entrada"));

    salidaAlmuerzo.addEventListener("input", calcularTotal);
    vueltaAlmuerzo.addEventListener("input", calcularTotal);
    salidaComida.addEventListener("input", () => {
        setVueltaComida(); // Ajustar la hora automáticamente
        calcularTotal();
    });
    vueltaComida.addEventListener("input", calcularTotal);
    horasTotales.addEventListener("input", calcularHoraSalida);
    entrada.addEventListener("input", calcularHoraSalida);

    // Función para calcular la diferencia de horas
    function calcularDiferencia(horaInicio, horaFin) {
        if (horaInicio && horaFin) {
            const inicio = new Date(`1970-01-01T${horaInicio}:00`);
            const fin = new Date(`1970-01-01T${horaFin}:00`);
            let diferencia = (fin - inicio) / (1000 * 60); // Diferencia en minutos

            if (diferencia < 0) diferencia += 24 * 60; // Ajuste si pasa la medianoche

            const horas = Math.floor(diferencia / 60);
            const minutos = diferencia % 60;
            return `${horas}h ${minutos}m`;
        }
        return "0h 0m";
    }

    // Función para ajustar automáticamente la vuelta de comida
    function setVueltaComida() {
        if (salidaComida.value) {
            let horaSalida = new Date(`1970-01-01T${salidaComida.value}:00`);
            horaSalida.setMinutes(horaSalida.getMinutes() + 45); // Añadir 45 minutos

            let horas = horaSalida.getHours().toString().padStart(2, "0");
            let minutos = horaSalida.getMinutes().toString().padStart(2, "0");
            vueltaComida.value = `${horas}:${minutos}`;
        }
    }

    // Función para calcular el tiempo total de almuerzo y comida
    function calcularTotal() {
        totalAlmuerzo.textContent = calcularDiferencia(salidaAlmuerzo.value, vueltaAlmuerzo.value);
        totalComida.textContent = calcularDiferencia(salidaComida.value, vueltaComida.value);
        calcularHoraSalida();
    }

    // Función para calcular la hora de salida
    function calcularHoraSalida() {
        if (entrada.value && horasTotales.value) {
            let horaEntrada = new Date(`1970-01-01T${entrada.value}:00`);

            // Convertir el input de horasTotales (formato HH:MM) a minutos
            let [horas, minutos] = horasTotales.value.split(":").map(Number);
            let jornada = (horas * 60) + minutos;

            let descansoAlmuerzo = (vueltaAlmuerzo.value && salidaAlmuerzo.value) 
                ? (new Date(`1970-01-01T${vueltaAlmuerzo.value}:00`) - new Date(`1970-01-01T${salidaAlmuerzo.value}:00`)) / (1000 * 60) 
                : 0;
                
            let descansoComida = (vueltaComida.value && salidaComida.value) 
                ? (new Date(`1970-01-01T${vueltaComida.value}:00`) - new Date(`1970-01-01T${salidaComida.value}:00`)) / (1000 * 60) 
                : 0;

            let totalMinutos = jornada + descansoAlmuerzo + descansoComida;
            let horaSalida = new Date(horaEntrada.getTime() + totalMinutos * 60000);
            
            let horasSalida = horaSalida.getHours().toString().padStart(2, "0");
            let minutosSalida = horaSalida.getMinutes().toString().padStart(2, "0");
            salida.textContent = `${horasSalida}:${minutosSalida}`;
        }
    }
});
