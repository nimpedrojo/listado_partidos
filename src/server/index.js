import express from 'express';
import generarListadoHtml from '../core/generarListadoHtml.js';

const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');     // <-- clave
  res.setHeader('Access-Control-Allow-Methods', 'GET'); // (opcional)
  next();
});
app.get('/api/listado', async (req, res) => {
  const { inicio, fin } = req.query;       // ISO YYYY-MM-DD

  if (!inicio || !fin)
    return res.status(400)
              .send('Parámetros ?inicio=AAAA-MM-DD&fin=AAAA-MM-DD obligatorios');

  if (fin < inicio)
    return res.status(400).send('La fecha fin debe ser >= inicio');

  try {
    const html = await generarListadoHtml(inicio, fin);
    res.type('html').send(html);           // Content-Type: text/html
  } catch (e) {
    console.error(e);
    res.status(500).send('Error generando el listado');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✔️  API escuchando en http://localhost:${PORT}/api/listado`));
