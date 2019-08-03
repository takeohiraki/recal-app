const proxy = require('http-proxy-middleware');

module.exports = function(app) {
   app.use(proxy(['/auth/google'], { target: 'http://localhost:5000' }));
   app.use(proxy(['/api/*'], { target: 'http://localhost:5000' }));
   app.use(proxy(['/api/google/cal/*'], { target: 'http://localhost:5000' }));
   app.use(proxy(['/api/seed/*'], { target: 'http://localhost:5000' }));
   app.use(proxy(['/test'], { target: 'http://localhost:5000' }));
}