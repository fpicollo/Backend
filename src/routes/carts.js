const express = require('express');
const fs = require('fs');
const router = express.Router();


const getCarts = () => {
  try {
    const data = fs.readFileSync('public/carritos.json');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};


const setCarts = (carts) => {
  fs.writeFileSync('public/carritos.json', JSON.stringify(carts));
};


router.get('/:cid', (req, res) => {
  const carts = getCarts();
  const cart = carts.find(cart => cart.id === req.params.cid);
  res.json(cart);
});


router.post('/:cid/product/:pid', (req, res) => {
  const carts = getCarts();
  const cart = carts.find(cart => cart.id === req.params.cid);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const productIndex = cart.products.findIndex(p => p.product   
 === req.params.pid);

  if (productIndex !== -1) {
    
    cart.products[productIndex].quantity++;
  } else {
   
    cart.products.push({
      product: req.params.pid,
      quantity: 1
    });
  }

  setCarts(carts);
  res.json(cart);
});

module.exports = router;
