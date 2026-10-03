import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

// Shared frame for routed pages. Pages own their width because most of them
// open with a full bleed blue band, then drop into the standard Container.
export default function Layout() {
  const { pathname } = useLocation()

  // Start each page at the top, as a full page load would.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
