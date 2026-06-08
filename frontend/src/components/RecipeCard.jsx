import { Link } from 'react-router-dom'

function RecipeCard({ recipe }) {
  const formattedDate = new Date(recipe.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Link 
      to={`/recipe/${recipe.id}`} 
      className="block bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-1"
    >
    
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover rounded-md mb-4" />
      )}
      
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>
        <span className="text-xs text-gray-400 whitespace-nowrap ml-2 mt-1">{formattedDate}</span>
      </div>
      
      <p className="text-gray-600 mt-2 line-clamp-2">{recipe.description}</p>
      
      <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
        <span className="font-semibold text-blue-600">@{recipe.author}</span>
        <span>{recipe.cook_time} mins</span>
      </div>
    </Link>
  )
}

export default RecipeCard