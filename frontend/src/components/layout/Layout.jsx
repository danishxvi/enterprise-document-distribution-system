import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

// The shared frame for every routed page: sticky nav, a centered content
// column capped at 7xl, and the footer. Individual pages own their padding.
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
