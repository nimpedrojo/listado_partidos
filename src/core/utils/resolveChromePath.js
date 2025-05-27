import fs from 'fs';

export default function resolveChromePath() {
  const shim = process.env.GOOGLE_CHROME_SHIM;
  if (shim && fs.existsSync(shim)) return shim;

  // rutas de fallback
  const cands = ['/usr/bin/chromium-browser', '/usr/bin/google-chrome'];
  for (const p of cands) if (fs.existsSync(p)) return p;

  throw new Error('Chromium no encontrado');
}
