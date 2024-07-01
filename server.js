const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Extracting the URL path
    const url = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(__dirname, 'public', url);

    // Check if the requested file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // If file does not exist, send a 404 Not Found response
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }

        // Read the file and send it as response
        fs.readFile(filePath, (err, data) => {
            if (err) {
                // If error reading file, send a 500 Internal Server Error response
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 Internal Server Error</h1>');
                return;
            }

            // Determine the content type based on file extension
            let contentType = 'text/html';
            if (filePath.endsWith('.css')) {
                contentType = 'text/css';
            } else if (filePath.endsWith('.js')) {
                contentType = 'text/javascript';
            }

            // Send the appropriate Content-Type header
            res.writeHead(200, { 'Content-Type': contentType });

            // Send the file content
            res.end(data);
        });
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
