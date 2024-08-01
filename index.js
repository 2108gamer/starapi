const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Configurar multer para manejar la subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'transcripts');
    },
    filename: (req, file, cb) => {
        const id = uuidv4();
        cb(null, `${id}.html`);
    }
});
const upload = multer({ storage: storage });

// Ruta para recibir la transcripción
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo');
    }
    const fileUrl = `http://localhost:${PORT}/transcript/${req.file.filename}`;
    res.send(`Transcripción subida. URL: ${fileUrl}`);
});

// Ruta para servir la transcripción
app.get('/transcript/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'transcripts', filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('Transcripción no encontrada');
        }
        res.send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});