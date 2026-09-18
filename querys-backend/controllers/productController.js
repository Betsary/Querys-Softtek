const pool = require('../db');

const STATES = {
    UPDATE_STOCK: 1,
    DELETE_PRODUCT: 2,
    UPDATE_PRODUCT: 3
};

const ejecutarCrud = async (option, data = {}) => {
    const [resultSets] = await pool.query(
        'CALL CrudProductos(?, ?)',
        [
            option,
            JSON.stringify(data)
        ]
    );

    if (Array.isArray(resultSets) && Array.isArray(resultSets[0])) {
        return resultSets[0];
    }

    return [];
};

const crud = async (req, res) => {
    const option = Number(req.body?.optionMenu);
    const data = req.body?.data ?? {};

    if (
        !Number.isInteger(option) ||
        option < 1 ||
        option > 3 ||
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
};

const getProducts = async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM vw_productos`);

        res.json(rows);
    } catch (error) {
        console.error(
            'Error al obtener productos:',
            error.message
        );

        res.status(500).json({
            error: 'No se pudieron obtener los productos'
        });
    }
};

const getProductsWarning = async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM vw_productos_bajo_stock`);

        res.json(rows);
    } catch (error) {
        console.error(
            'Error al obtener productos con problema de stock:',
            error.message
        );

        res.status(500).json({
            error: 'No se pudieron obtener los productos con problema de stock'
        });
    }
};

const updateStock = async (req, res) => {
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
};

const deleteProduct = async (req, res) => {
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
};

const updateProduct = async (req, res) => {
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
                status: status ? 1 : 0,
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
};

module.exports = {
    crud,
    getProducts,
    getProductsWarning,
    updateStock,
    deleteProduct,
    updateProduct
};