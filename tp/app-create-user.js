const http = require('http');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><form action="/create-user" method="POST"><input type="input" name="username"><button type="submit">Send</button></form></html>');
    return res.end();
  }

  if (url === '/create-user' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split('=')[1];
      console.log(username);

      res.statusCode = 302;
      res.setHeader('Location', '/');
      return res.end();
    });
  }

  if (url === '/users') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><ul><li>Simon</li><li>Julien</li></ul></html>');
    return res.end();
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html><p>Hello from nodejs</p></html>');
  res.end();
});

server.listen(3000);