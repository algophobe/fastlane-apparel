import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import StorePage from '@/pages/StorePage'
import ProductPage from '@/pages/ProductPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrderConfirmPage from '@/pages/OrderConfirmPage'
import AdminPage from '@/pages/AdminPage'
import CartDrawer from '@/components/cart/CartDrawer'

export default function App() {
  return (
    <>
      <CartDrawer />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<StorePage />} />
          <Route path="/shop" element={<StorePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/:id" element={<OrderConfirmPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </>
  )
}
