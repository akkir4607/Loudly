import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createContext, useState, useEffect } from 'react'

import WishlistSidebar from './components/WishlistSidebar'
import Footer from './components/Footer'
import Preloader from './components/Preloader'

import Front from './pages/Front'
import ProductDetail from './pages/ProductDetail'
import Women from './pages/Women'
import Discover from './pages/Discover'
import Support from './pages/Support'
import Men from './pages/Men'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Order from './pages/Order'
import FAQ from './pages/Faq'
import Term from './pages/term'

export const WishlistContext = createContext()
export const CartContext = createContext()

function App() {
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])

  // Check if preloader has already been shown
  const [isLoading, setIsLoading] = useState(() => {
    return sessionStorage.getItem('preloaderShown') !== 'true'
  })

  useEffect(() => {
    if (isLoading) {
      document.body.classList.add('preloader-active')
    } else {
      document.body.classList.remove('preloader-active')
    }

    return () => {
      document.body.classList.remove('preloader-active')
    }
  }, [isLoading])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    sessionStorage.setItem('preloaderShown', 'true')
  }

  // ==========================
  // Wishlist Functions
  // ==========================

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id)

      if (exists) {
        return prev.filter((item) => item.id !== product.id)
      }

      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlist((prev) =>
      prev.filter((item) => item.id !== productId)
    )
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId)
  }

  // ==========================
  // Cart Functions
  // ==========================

  const addToCart = (product, size) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === size
      )

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id &&
          item.selectedSize === size
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...prev,
        {
          ...product,
          selectedSize: size,
          quantity: 1,
        },
      ]
    })
  }

  const removeFromCart = (productId, size) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === productId &&
            item.selectedSize === size
          )
      )
    )
  }

  const updateQuantity = (
    productId,
    size,
    newQuantity
  ) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size)
      return
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === productId &&
        item.selectedSize === size
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(
        item.price
          .replace('₹', '')
          .replace(/,/g, '')
      )

      return total + price * item.quantity
    }, 0)
  }

  const getCartCount = () => {
    return cart.reduce(
      (total, item) => total + item.quantity,
      0
    )
  }

  return (
    <>
      {isLoading && (
        <Preloader
          onLoadingComplete={handleLoadingComplete}
        />
      )}

      {!isLoading && (
        <WishlistContext.Provider
          value={{
            wishlist,
            toggleWishlist,
            removeFromWishlist,
            clearWishlist,
            isInWishlist,
          }}
        >
          <CartContext.Provider
            value={{
              cart,
              addToCart,
              removeFromCart,
              updateQuantity,
              clearCart,
              getCartTotal,
              getCartCount,
            }}
          >
            <Router>
              <div className="app">
                <WishlistSidebar />

                <Routes>
                  <Route path="/" element={<Front />} />

                  <Route
                    path="/product/:id"
                    element={<ProductDetail />}
                  />

                  <Route
                    path="/women"
                    element={<Women />}
                  />

                  <Route
                    path="/support"
                    element={<Support />}
                  />

                  <Route
                    path="/discover"
                    element={<Discover />}
                  />

                  <Route
                    path="/men"
                    element={<Men />}
                  />

                  <Route
                    path="/login"
                    element={<Login />}
                  />

                  <Route
                    path="/contact"
                    element={<Contact />}
                  />

                  <Route
                    path="/order"
                    element={<Order />}
                  />

                  <Route
                    path="/faq"
                    element={<FAQ />}
                  />

                  <Route
                    path="/term"
                    element={<Term />}
                  />
                </Routes>

                <Footer />
              </div>
            </Router>
          </CartContext.Provider>
        </WishlistContext.Provider>
      )}
    </>
  )
}

export default App