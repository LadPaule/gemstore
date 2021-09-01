import React, { useState, useEffect } from 'react';
import { Products, Navbar, Cart, Checkout } from './components';
import { commerce } from './lib/commerce'
import { BrowserRouter as Router, Switch,  Route } from 'react-router-dom';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setcart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProducts = async () =>{
    const { data } = await commerce.products.list();
    setProducts(data)
  };

  const fetchCart= async () =>{
    setcart(await commerce.cart.retrieve());
  };

  const handleAddToCart = async ( productId, quantity ) =>{
    const { cart } = await commerce.cart.add(productId, quantity);
    setcart(cart)
  }

  const handleUpdateCartQty = async (productId, quantity) =>{
    const  { cart }= await commerce.cart.update(productId, { quantity });
    setcart(cart)
  };

  const handleRemoveFromCart =async (productId) =>{
    const { cart } = await commerce.cart.remove(productId);
    setcart(cart);
  };

  const emptyCart = async () =>{
    const { cart } = await commerce.cart.empty();
    setcart(cart);
  };


  const refreshcart = async ()=>{
    const newCart = await commerce.cart.refresh();
    setcart(newCart)
  }

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) =>{
    try {
      const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
      setOrder(incomingOrder)
      refreshcart();
    } catch (error) {
        setErrorMessage(error.data.error.message)
    }
  }

  useEffect(()=>{
    fetchProducts();
    fetchCart();
  },[]);



  return (
    <Router>
      <>
        <Navbar totalItems = {cart.total_items} />

        <Switch>
          <Route exact path ="/">
            <Products products={products} onAddToCart = { handleAddToCart }/>
          </Route>

          <Route exact path ="/cart">
            <Cart  cart={cart} handleUpdateCartQty={ handleUpdateCartQty }
              handleRemoveFromCart={ handleRemoveFromCart } emptyCart={emptyCart}
            />
          </Route>
          <Route exact path ="/checkout">
            <Checkout handleCaptureCheckout={ handleCaptureCheckout } cart={cart} order={ order } error={ errorMessage }/>
          </Route>

        </Switch>        
      </>
    </Router>
    
  )
}

export default App;
