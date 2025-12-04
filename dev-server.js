const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8000;
const root = path.resolve(__dirname);

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.yml': 'text/yaml; charset=UTF-8',
  '.yaml': 'text/yaml; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Basic auth for admin area
  if (req.url.startsWith('/admin')) {
    const auth = req.headers['authorization'];
    const expected = 'Basic ' + Buffer.from('ekoadmin:pangkalpinang2026').toString('base64');
    if (auth !== expected) {
      res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Admin"' });
      return res.end('Unauthorized');
    }
  }

  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath = path.join(root, urlPath);

    if (!filePath.startsWith(root)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Forbidden');
    }

    const serveFile = targetPath => {
      fs.stat(targetPath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('Not found');
        }
        const ext = path.extname(targetPath).toLowerCase();
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        fs.createReadStream(targetPath).pipe(res);
      });
    };

    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isDirectory()) {
        const indexPath = path.join(filePath, 'index.html');
        return serveFile(indexPath);
      }

      if (err && urlPath.endsWith('/')) {
        const indexPath = path.join(filePath, 'index.html');
        return serveFile(indexPath);
      }

      if (err && !path.extname(filePath)) {
        const htmlPath = `${filePath}.html`;
        return serveFile(htmlPath);
      }

      serveFile(filePath);
    });
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error');
  }
});

server.listen(port, () => {
  console.log(`Dev server running at http://localhost:${port}`);
});
