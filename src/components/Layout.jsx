import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
        <Outlet />
      </main>
    </>
  )
}
