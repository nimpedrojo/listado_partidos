#!/usr/bin/env node
/**
 * CLI oficial de listado-partidos
 * Uso: node index.js <YYYY-MM-DD> <YYYY-MM-DD> [--out ruta.pdf]
 */
import path from 'path';
import generarListado from './src/core/generarListado.js';

// --- parsing muy simple --------------------------------------
const argv = process.argv.slice(2);
if (argv.length < 2) {
  console.error('❌  Uso: node index.js <fechaInicio> <fechaFin> [--out ruta.pdf]');
  process.exit(1);
}
const [fechaInicio, fechaFin, maybeFlag, maybeOut] = argv;
const outPath = (maybeFlag === '--out') ? maybeOut : null;

// --- invocamos el core ---------------------------------------
(async () => {
  try {
    const pdf = await generarListado(fechaInicio, fechaFin, outPath);
    console.log(`✅  PDF generado en: ${pdf}`);
  } catch (err) {
    console.error('💥  Error:', err.message);
    process.exit(1);
  }
})();
