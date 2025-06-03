// proxy.conf.js
module.exports = [
  // 1) API / Sanctum: siempre proxear
  {
    context: ['/sanctum', '/api', '/logout', '/login'],  // incluyo POST /login y /logout aquí
    target: 'http://127.0.0.1:8000',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    // bypass solo cuando sea navegación de página (Accept: text/html)
    bypass: (req, res) => {
      const accept = req.headers.accept || '';
      if (req.method === 'GET' && accept.includes('text/html')) {
        // Esto es un click en el navegador → sirve index.html
        return '/index.html';
      }
      // Para cualquier otra petición (XHR JSON) → proxy normal
    }
  }
];
