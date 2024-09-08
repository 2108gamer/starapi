const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const twilio = require('twilio');
const moongose = require('./moongose');
const ACCOUNTT_SID = ""
const AUTH_TOKEN = ""
const serviceid = ""



moongose()

const app = express();
const PORT = 3002;

const transcriptsDir = path.join(__dirname, 'transcripts');
if (!fs.existsSync(transcriptsDir)) {
    fs.mkdirSync(transcriptsDir);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, transcriptsDir);
    },
    filename: (req, file, cb) => {
        const id = uuidv4();
        const pre = id.replace(/[^0-9]/g, '');
        const name = pre.slice(0, 10)
        cb(null, `${name}.html`);
    }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo');
    }
    const fileUrl = `https://storage.ricadev.fun/transcript/${req.file.filename}`;
    res.send(`${fileUrl}`);
});

 
app.post('/verify/:phoneNumber', async (req, res) => {
    try {
        const phoneNumber = req.params.phoneNumber;
        const { status } = await twilioClient.verify.v2.services(serviceid).verifications.create({
            to: phoneNumber,
            channel: 'whatsapp'
        });

        res.json({ status });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al verificar el número de teléfono');
    }
});

app.post('/info/:user', async (req, res) => {
    try {
        const transcript = require("./models/utils")
        const user = req.params.user
        const data = await transcript.find({ user: user })

        if (data === null) {
            res.status(404).json({
                response: "invalid data"
            });
        } else {
            res.status(200).json(data); 
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('internal server error');
    }
});



app.post('/check/:phoneNumber/:code', async (req, res) => {
try {
    const {phoneNumber, code} = req.params;
    const { status } = await twilioClient.verify.v2.services(serviceid).verificationChecks.create({
        to: phoneNumber,
        code
    });

    if (status === 'approved') {
       
        res.json({ status });
    }
    

} catch (error) {
    console.error(error);
    
    
}

});








app.get('/transcript/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(transcriptsDir, filename);

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
