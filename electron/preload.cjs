// Pre-load: se ejecuta ANTES de que la página renderer (index.html)
// tenga acceso al DOM.  Aquí definimos la *única* puerta de entrada
// que la UI tendrá hacia Node/Electron.
//
// ⚠️  REGLAS DE SEGURIDAD
// -   contextIsolation:  true     (aislamos los contextos JS)
// -   nodeIntegration:   false    (no Node global en el renderer)
// -   sandbox:           true     (opcional, más aislamiento)
//
// En el main, al crear la ventana:
// new BrowserWindow({ webPreferences: {
//     preload: path.join(__dirname,'preload.js'),
//     contextIsolation: true,
//     nodeIntegration: false,
//     sandbox: true
// }})
//

const { contextBridge, ipcRenderer } = require('electron');

/**
 * Lista blanca de canales; impedimos que el renderer invoque
 * cualquier otro canal arbitrario.
 */
const INVOKE_CHANNELS = ['generar', 'open-pdf'];
const ON_CHANNELS     = ['generar:progress', 'error'];

/**
 * Empaquetamos toda la API disponible para la página web
 * dentro de `window.api`.
 */
contextBridge.exposeInMainWorld('api', {
  /**
   * Genera el PDF.
   * @param {string} inicio  - ISO date (YYYY-MM-DD)
   * @param {string} fin     - ISO date (YYYY-MM-DD)
   * @param {string|null} out Optional: ruta de destino
   * @returns {Promise<string>} Ruta absoluta del PDF generado
   */
  generar(inicio, fin, out = null) {
    return ipcRenderer.invoke('generar', { inicio, fin, out });
  },

  /**
   * Abre un PDF ya existente con el visor predeterminado.
   * @param {string} ruta
   */
  abrirPdf(ruta) {
    return ipcRenderer.invoke('open-pdf', ruta);
  },

  /**
   * Suscripción a los eventos de progreso que emite el proceso
   * principal mientras se crea el documento.
   * @param {(porcentaje:number) => void} callback
   * @returns {() => void} función para desuscribirse
   */
  onProgreso(callback) {
    const channel = 'generar:progress';
    if (!ON_CHANNELS.includes(channel)) return () => {};
    const listener = (_e, pct) => callback(pct);
    ipcRenderer.on(channel, listener);
    // devolvemos una función para quitar el listener
    return () => ipcRenderer.removeListener(channel, listener);
  }
});
