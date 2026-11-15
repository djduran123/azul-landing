# AZUL Cronógrafo — landing de portfolio

Landing de producto para **AZUL**, una marca de relojes **ficticia** creada por Velsora Digital como pieza de portfolio. El producto no existe ni está a la venta.

- **Imágenes y video:** generados con IA (GPT Image 2 y Wan 3.0 vía Higgsfield) a partir de un diseño de producto original.
- **Stack:** HTML + CSS + JS estático, sin build ni dependencias.
- **Efectos:** hero con foto animada en CSS (órbita lenta, respiración y haz de luz), galería con Ken Burns, entradas y salidas con desenfoque al hacer scroll (`animation-timeline: view()` con fallback) y respeto de `prefers-reduced-motion`.

## Ver en local

```bash
python -m http.server 8080
```

Y abrir `http://localhost:8080`.

## Deploy

Sitio estático: en Vercel se importa el repo y se despliega sin configuración (sin framework, sin comando de build, directorio raíz `/`).
