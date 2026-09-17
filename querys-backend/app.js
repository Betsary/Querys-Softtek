const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const productRoutes = require('./routes/productRoutes');

app.use(express.json());

app.use((req, res, next) => {
    res.header(
        'Access-Control-Allow-Origin',
        process.env.FRONTEND_URL || 'http://localhost:5173'
    );

    res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );

    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type'
    );

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok'
    });
});

app.use(productRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
});