import { Outlet } from 'react-router-dom'
import NavBar from './NavBar.tsx'

const Layout = () => {
  return (
    <div>
      <NavBar />
      <main className='px-7 py-10'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
