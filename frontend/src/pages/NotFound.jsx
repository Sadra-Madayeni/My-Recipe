import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-9xl mb-8">
        👨‍🍳💨
      </div>
      
      <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-700 mb-6">Oops! The kitchen is empty.</h2>
      
      <p className="text-lg text-gray-500 mb-10 max-w-md">
        We can't seem to find the page you're looking for. It might have been moved, deleted, or perhaps the recipe burned in the oven!
      </p>
      
      <Link 
        to="/" 
        className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition shadow-lg transform hover:-translate-y-1"
      >
        Take Me Back Home
      </Link>
    </div>
  )
}

export default NotFound