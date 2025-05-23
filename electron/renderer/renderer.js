// electron/renderer/renderer.js  (ES-Modules o <script type="module">)

// 1. Referencias DOM explícitas
const inicioInput  = document.getElementById('inicio');
const finInput     = document.getElementById('fin');
const generarBtn   = document.getElementById('generar');
const spinner      = document.getElementById('spinner'); // opcional

// 2. Manejador seguro
generarBtn.addEventListener('click', async () => {
  try {
    const ini = inicioInput.value;
    const fin = finInput.value;

    // Validaciones
    if (!ini || !fin || fin < ini) {
      alert('Rango de fechas inválido');
      return;
    }

    generarBtn.disabled = true;
    spinner?.classList.remove('hidden');        // muestra cargando

    // Llamada IPC → proceso principal
    const rutaPdf = await window.api.generar(ini, fin);

    alert(`PDF generado:\n${rutaPdf}`);          // feedback al usuario

  } catch (err) {
    console.error(err);
    alert(`❌ Error al generar PDF:\n${err.message}`);
  } finally {
    generarBtn.disabled = false;
    spinner?.classList.add('hidden');
  }
});
