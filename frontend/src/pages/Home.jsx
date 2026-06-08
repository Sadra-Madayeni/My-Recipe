import { useState, useEffect } from 'react'
import api from '../api'
import RecipeCard from '../components/RecipeCard'

function Home() {
  const [recipes, setRecipes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  const [activeTab, setActiveTab] = useState('all')
  const [followingIds, setFollowingIds] = useState([])

  useEffect(() => {
    api.get('recipes/recipes/')
      .then(res => {
        setRecipes(res.data.results || res.data)
        setIsLoading(false)
      })
      .catch(err => {
          console.error(err)
          setIsLoading(false)
      })

    const token = localStorage.getItem('access')
    if (token) {
      api.get('users/follows/?type=following')
        .then(res => {
          const follows = res.data.results || res.data
          const ids = follows.map(f => f.following)
          setFollowingIds(ids)
        })
        .catch(err => console.error(err))
    }
  }, [])

  const filteredRecipes = recipes.filter(recipe => {
    const query = searchQuery.toLowerCase()
    const matchTitle = recipe.title.toLowerCase().includes(query)
    const matchIngredient = recipe.ingredients && recipe.ingredients.some(ing => 
      ing.ingredient_name.toLowerCase().includes(query)
    )
    
    const matchTab = activeTab === 'all' || followingIds.includes(recipe.author_id)

    return (matchTitle || matchIngredient) && matchTab
  })

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-24 px-4 sm:px-6 lg:px-8 font-sans">
      
      <div className="max-w-4xl mx-auto text-center mb-10 space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 pb-2">
          What are you craving?
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-light">
          Discover beautiful recipes from chefs around the world, or find the perfect meal based on what's already in your fridge.
        </p>
            
        <div className="max-w-2xl mx-auto relative mt-8 group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search 'Pasta' or 'Garlic'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow duration-300"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-8 flex justify-center space-x-4">
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 rounded-full font-semibold transition-all ${
            activeTab === 'all' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Explore All
        </button>
        <button 
          onClick={() => setActiveTab('feed')}
          className={`px-6 py-2 rounded-full font-semibold transition-all ${
            activeTab === 'feed' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white text-slate-600 hover:bg-blue-50'
          }`}
        >
          My Feed
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {isLoading ? (
            <div className="text-center py-20 text-slate-400 animate-pulse text-lg font-medium">
                Warming up the ovens...
            </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-white rounded-3xl shadow-sm border border-slate-100">
            <div className="text-6xl mb-6">🍋</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No recipes found</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              We couldn't find anything matching your search or filters.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
              className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-md"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

    </div>
  )
}

export default Home