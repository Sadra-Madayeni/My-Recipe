import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [image, setImage] = useState(null)
  const [category, setCategory] = useState('')
  const [ingredientsList, setIngredientsList] = useState([{ ingredient: '', quantity: '' }])
  
  const [availableCategories, setAvailableCategories] = useState([])
  const [availableIngredients, setAvailableIngredients] = useState([])
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

  useEffect(() => {
    api.get('recipes/categories/').then(res => setAvailableCategories(res.data.results || res.data))
    api.get('recipes/ingredients/').then(res => setAvailableIngredients(res.data.results || res.data))
  }, [])

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredientsList]
    newIngredients[index][field] = value
    setIngredientsList(newIngredients)
  }

  const addIngredientRow = () => {
    setIngredientsList([...ingredientsList, { ingredient: '', quantity: '' }])
  }

  const removeIngredientRow = (index) => {
    const newIngredients = ingredientsList.filter((_, i) => i !== index)
    setIngredientsList(newIngredients)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('cook_time', cookTime)
    
    if (category) {
        formData.append('category', category)
    }
    
    if (image) {
      formData.append('image', image)
    } else {
      setError('An image is required for your recipe!')
      return
    }

    const validIngredients = ingredientsList.filter(item => item.ingredient !== '' && item.quantity !== '')
    formData.append('ingredients', JSON.stringify(validIngredients))

    try {
      await api.post('recipes/recipes/', formData)
      navigate('/')
    } catch (err) {
      if (err.response && err.response.data) {
        const firstErrorKey = Object.keys(err.response.data)[0]
        setError(`Error with ${firstErrorKey}: ${err.response.data[firstErrorKey]}`)
      } else {
        setError('Failed to create recipe. Make sure all fields are filled correctly.')
      }
    }
  }

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create a New Recipe</h2>
        
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Recipe Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a Category</option>
                {availableCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 text-sm font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 h-24"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Cook Time (minutes)</label>
              <input
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-semibold">Recipe Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full text-gray-600 mt-1"
                required
              />
            </div>
        </div>

        <div className="mb-6 p-4 border border-gray-200 rounded bg-gray-50">
            <div className="flex justify-between items-center mb-4">
                <label className="block text-gray-700 text-sm font-semibold">Ingredients</label>
                <button type="button" onClick={addIngredientRow} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition">
                    + Add Ingredient
                </button>
            </div>
            
            {ingredientsList.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                    <select
                        value={item.ingredient}
                        onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                        className="flex-1 border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 text-sm"
                        required
                    >
                        <option value="">Select Ingredient</option>
                        {availableIngredients.map(ing => (
                            <option key={ing.id} value={ing.id}>{ing.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Quantity (e.g. 200g)"
                        value={item.quantity}
                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                        className="flex-1 border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 text-sm"
                        required
                    />
                    {ingredientsList.length > 1 && (
                        <button type="button" onClick={() => removeIngredientRow(index)} className="text-red-500 px-2 hover:text-red-700 font-bold">
                            X
                        </button>
                    )}
                </div>
            ))}
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 transition">
          Post Recipe
        </button>
      </form>
    </div>
  )
}

export default CreateRecipe