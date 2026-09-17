const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/products/crud', productController.crud);
router.get('/products', productController.getProducts);
router.get('/productsWarning', productController.getProductsWarning);
router.patch('/products/updateStock/:id', productController.updateStock);
router.delete('/products/delete/:id', productController.deleteProduct);
router.put('/products/update/:id', productController.updateProduct);

module.exports = router;