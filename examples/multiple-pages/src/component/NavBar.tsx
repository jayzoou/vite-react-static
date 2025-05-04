import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <header className="flex justify-between items-center text-white">
      <nav className='nav'>
        <div className='flex gap-4 mr-4'>
          <Link to="/a">a</Link>
          <Link to="/b">b</Link>
          <Link to="/c">c</Link>
        </div>
      </nav>
    </header>
  )
}

export default NavBar
