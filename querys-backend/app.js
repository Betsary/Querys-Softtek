const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Endpoint health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Endpoint productsWarning tipo GET
app.get('/productsWarning', (req, res) => {
    const products = [
        { productId: 1, name: "Leche", stock: 9},
        { productId: 13, name: "Tortillas", stock: 3}
    ]
    res.json(products)
})

app.listen(port, ()=> {
    console.log(`Servidor corriendo en el puerto: ${port}`);
})