const Cart = require('../models/Cart');


const getCart = async (req,res) => {
    console.log(req.user)
    const userId = req.user.id;
  try {
      const cart = await Cart.findOne({ user: userId }).select('-__v').populate('items.product');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
  } catch (e) {
      res.status(500).json({ message: e.message });
  }
}

const addToCart = async (req, res) => {
    console.log(req.user)

    const userId = req.user.id;
    try
    {
        const {productId, quantity} = req.body;
        let cart = await Cart.findOne({ user: userId});
        if (!cart){
            cart = new Cart({user: userId, items: []})
        }
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem){
            existingItem.quantity+= quantity
        } else {
            cart.items.push({product:productId, quantity})
        }
        cart.save()
        return res.status(201).json(cart)
    } catch (e){
        res.status(500).json({message:e.message})
    }

}

const updateCart = async (req, res) => {
    const userId = req.user.id;
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({user:userId});
        if (!cart || cart.items.length === 0) {
            return res.status(404).json("cart not found Or empty")
        }
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem){
            if (quantity <= 0){
                cart.items = cart.items.filter(item => item.product.toString() !== productId);
            }
            else {
                existingItem.quantity = quantity;
            }
        }
        return res.status(200).json(cart)
    } catch (e) {
        return  res.status(500).json({message:e.message})
    }

}


const deleteCart =  async (req,res)  => {
    const userId = req.user.id;
    try {
        const cart = await Cart.findOne({user:userId});
        if (!cart) {
            return res.status(404).json("cart not found")
        }
        cart.items = [];
        await cart.save();
        return res.status(200).json(cart)
    } catch (e){
        return res.status(500).json({message:e.message})
    }

}

module.exports = {
    getCart,
    addToCart,
    updateCart,
    deleteCart
}