import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem('access')

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md p-4 mb-8">
      <div className="container mx-auto flex justify-between items-center">  
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
          My Recipe
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>
  
          {isAuthenticated ? (
            <>
              <Link to="/create-recipe" className="text-gray-700 hover:text-blue-600 transition">
                Create Recipe
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition">
                My Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar