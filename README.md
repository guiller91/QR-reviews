# QR-reviews

Herramientas para facilitar que los pacientes de la clínica Dr. Javier Sola dejen su reseña en Google.

## QR de reseñas

`tools/make_qr.py` genera un QR con estilo que abre directamente el formulario de reseña de Google de la clínica.

```bash
pip install segno cairosvg
python3 tools/make_qr.py tools/logo-clinica.png
```

Salidas en `tools/out/`:

- `qr-resenas.svg` / `.png`: solo el código
- `tarjeta-resenas-a6.pdf` / `.png` / `.svg`: tarjeta imprimible A6 (105×148 mm)

Destino: `https://search.google.com/local/writereview?placeid=ChIJXzx4KLMSRw0R9agcX3SkseQ`

La tarjeta usa la tipografía Lato; instálala en el sistema antes de generar.
