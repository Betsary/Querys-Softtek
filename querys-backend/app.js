const express = require('express');
const pool = require('./db');
const app = express();
const port = process.env.PORT || 3000;


const STATES = {
    SELECT: 1,
    SELECT_WARNING: 2,
    UPDATE_STOCK: 3,
    DELETE_PRODUCT: 4,
    UPDATE_PRODUCT: 5
};


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



const ejecutarCrud = async (option, data = {}) => {


    const [resultSets] = await pool.query(
        'CALL CrudProductos(?, ?)',
        [
            option,
            JSON.stringify(data)
        ]
    );

    // if resultSets es un arreglo and el primer elemento de resultSets también es un arreglo
    // devuelve ese primer arreglo;

    if (Array.isArray(resultSets) && Array.isArray(resultSets[0])) {
        return resultSets[0];
    }

    return [];
};




app.post('/products/crud', async (req, res) => {

    const option = Number(req.body?.optionMenu);
    const data = req.body?.data ?? {};

    if (
        !Number.isInteger(option) ||
        option < 1 ||
        option > 5 ||
        typeof data !== 'object' ||
        data === null ||
        Array.isArray(data)
    ) {
        return res.status(400).json({
            error: 'La opción y los datos CRUD no son válidos'
        });
    }

    try {

        const result = await ejecutarCrud(option, data);

        res.json(result);

    } catch (error) {

        console.error('Error en CRUD:', error);

        res.status(500).json({
            error: error.sqlMessage || 'No se pudo realizar la operación CRUD'
        });
    }
});


// Select todos los productos
app.get('/products', async (req, res) => {
    try {
        const products = await ejecutarCrud(STATES.SELECT);

        res.json(products);

    } catch (error) {
        console.error(
            'Error al obtener productos:',
            error.message
        );

        res.status(500).json({
            error: 'No se pudieron obtener los productos'
        });
    }
});


// Select de productos con poco stock
app.get('/productsWarning', async (req, res) => {

    try {

        const products = await ejecutarCrud(
            STATES.SELECT_WARNING
        );

        res.json(products);

    } catch (error) {

        console.error(
            'Error al obtener productos con poco stock:',
            error.message
        );

        res.status(500).json({
            error: 'No se pudieron obtener los productos con poco stock'
        });
    }
});


//Update stock con el sp ReabastecerProducto

app.patch('/products/updateStock/:id', async (req, res) => {

    const productId = Number.parseInt(req.params.id, 10);
    const stockUpdate = req.body.stock;

    if (
        !Number.isInteger(productId) ||
        !Number.isInteger(stockUpdate) ||
        stockUpdate <= 0
    ) {
        return res.status(400).json({
            error: 'El stock requerido debe ser un entero mayor que cero'
        });
    }

    try {

        const products = await ejecutarCrud(
            STATES.UPDATE_STOCK,
            {
                id_producto: productId,
                stockUpdate: stockUpdate
            }
        );

        if (products.length === 0) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            });
        }

        res.json(products[0]);

    } catch (error) {

        console.error(
            'Error al actualizar stock:',
            error.message
        );

        res.status(500).json({
            error: error.sqlMessage || 'No se pudo actualizar el stock'
        });
    }
});


// Eliminar un producto

app.delete('/products/delete/:id', async (req, res) => {

    const productId = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(productId)) {
        return res.status(400).json({
            error: 'ID de producto inválido'
        });
    }

    try {

        const result = await ejecutarCrud(
            STATES.DELETE_PRODUCT,
            {
                id_producto: productId
            }
        );

        if (result.length === 0) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            });
        }

        res.json(result[0]);

    } catch (error) {

        console.error(
            'Error al eliminar producto:',
            error.message
        );

        res.status(500).json({
            error: error.sqlMessage || 'No se pudo eliminar el producto'
        });
    }
});


//Actualizar producto

app.put('/products/update/:id', async (req, res) => {

    const productId = Number.parseInt(req.params.id, 10);

    const {
        nombre,
        descripcion,
        categoria,
        status,
        precio,
        stock
    } = req.body;

    if (
        !Number.isInteger(productId) ||
        typeof nombre !== 'string' ||
        !nombre.trim() ||
        typeof descripcion !== 'string' ||
        typeof categoria !== 'string' ||
        typeof status !== 'boolean' ||
        typeof precio !== 'number' ||
        precio < 0 ||
        !Number.isInteger(stock) ||
        stock < 0
    ) {
        return res.status(400).json({
            error: 'Los datos del producto no son válidos'
        });
    }

    try {

        const products = await ejecutarCrud(
            STATES.UPDATE_PRODUCT,
            {
                id_producto: productId,
                nombre: nombre.trim(),
                descripcion: descripcion.trim(),
                categoria: categoria.trim(),
                status: status,
                precio: precio,
                stock: stock
            }
        );

        if (products.length === 0) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            });
        }

        res.json(products[0]);

    } catch (error) {

        console.error(
            'Error al actualizar producto:',
            error.message
        );

        res.status(500).json({
            error: error.sqlMessage || 'No se pudo actualizar el producto'
        });
    }
});



app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
});