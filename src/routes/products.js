const express = require('express');
const fs = require('fs');
const uuid = require('uuid');

const router = express.Router();

const getProducts = () => {
    try {
        const data = fs.readFileSync('public/productos.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo de productos:', error);
        return [];
    }
};

const setProducts = (products) => {
    fs.writeFileSync('public/productos.json', JSON.stringify(products));
};

router.get('/', (req, res) => {
    const products = getProducts();
    res.json(products);
});

router.get('/:pid', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);   

});

router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails = [] } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Faltan campos obligatorios'   
 });
    }

    const newProduct = {
        id: uuid.v4(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails,
    };

    const products = getProducts();
    products.push(newProduct);
    setProducts(products);

    res.status(201).json(newProduct);
});

module.exports = router;