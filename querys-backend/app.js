const express = require('express');
const pool = require("./db");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Endpoint health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Get products with stock <= 10;
app.get('/products/productsWarning', (req, res) => {
    const products = [
        { productId: 1, name: "Leche", price:25, stock: 9},
        { productId: 13, name: "Tortillas", price:27, stock: 3}
    ]
    res.json(products)
})

// Updating stock
app.patch("/products/updateStock/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    const stockUpdate = req.body.stock;

    // Validación
    if (stockUpdate === undefined || typeof stockUpdate !== "number") {
        res.status(400).json({
            error : "Stock requerido y debe ser número" 
        })
    }

    // Actualizar el stock. Llamar al storeProcedure.

    res.json({
        mensaje: `Stock del producto ${productId} actualizado con éxito.`,
        id: productId,
        stock: stock + stockUpdate
    })
})

// Deleting product
app.delete("/products/delete/:id", (req, res)=> {
    const productId = parseInt(req.params.id);

    // Eliminar el producto. Llamar al storeProcedure.

    res.json({
        mensaje: `Producto con ID ${productId} eliminado correctamente.`
    });
})

// Updating product
app.put("products/update/:id", (req, res) => {
    const productId = parseInt(req.params.id);

    // Actualizar el producto. Llamar al storeProcedure.

    res.json({
        mensaje: `Producto con ID ${productId} actualizado correctamente.`
    });
})

app.listen(port, ()=> {
    console.log(`Servidor corriendo en el puerto: ${port}`);
})