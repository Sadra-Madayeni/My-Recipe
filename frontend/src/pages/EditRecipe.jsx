import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

function EditRecipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [image, setImage] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [category, setCategory] = useState('')
  const [ingredientsList, setIngredientsList] = useState([{ ingredient: '', quantity: '' }])
  
  const [availableCategories, setAvailableCategories] = useState([])
  const [availableIngredients, setAvailableIngredients] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {

    api.get('recipes/categories/').then(res => setAvailableCategories(res.data.results || res.data))
    api.get('recipes/ingredients/').then(res => setAvailableIngredients(res.data.results || res.data))
    
    api.get(`recipes/recipes/${id}/`).then(res => {
      const data = res.data
      setTitle(data.title)
      setDescription(data.description)
      setCookTime(data.cook_time)
      setCategory(data.category || '')
      setExistingImage(data.image)
      
      if (data.ingredients && data.ingredients.length > 0) {
        setIngredientsList(data.ingredients.map(ing => ({
          ingredient: ing.ingredient,
          quantity: ing.quantity
        })))
      }
    }).catch(() => setError("Failed to load recipe."))
  }, [id])

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredientsList]
    newIngredients[index][field] = value
    setIngredientsList(newIngredients)
  }

  const addIngredientRow = () => setIngredientsList([...ingredientsList, { ingredient: '', quantity: '' }])
  
  const removeIngredientRow = (index) => {
    setIngredientsList(ingredientsList.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('cook_time', cookTime)

    if (category) formData.append('category', category)
    
    if (image instanceof File) {
      formData.append('image', image)
    }

    const validIngredients = ingredientsList.filter(item => item.ingredient !== '' && item.quantity !== '')
    formData.append('ingredients', JSON.stringify(validIngredients))

    try {
      await api.patch(`recipes/recipes/${id}/`, formData)  
      navigate(`/recipe/${id}`)  
    } catch (err) {
      setError('Failed to update recipe. Check your inputs.')
    }
  }

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl border border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Edit Recipe</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Recipe Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded focus:outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 rounded focus:outline-none focus:border-blue-500">
                <option value="">Select a Category</option>
                {availableCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
        </div>

        <div className="mb-4">
          <label className="block text-slate-700 font-semibold mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded focus:outline-none focus:border-blue-500 h-24" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Cook Time (mins)</label>
              <input type="number" value={cookTime} onChange={(e) => setCookTime(e.target.value)} className="w-full border p-2 rounded focus:outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Update Image (Optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full mt-1" />
              {existingImage && !image && <p className="text-xs text-slate-500 mt-1">Current image will be kept.</p>}
            </div>
        </div>

        <div className="mb-6 p-4 border rounded bg-slate-50">
            <div className="flex justify-between items-center mb-4">
                <label className="font-semibold text-slate-700">Ingredients</label>
                <button type="button" onClick={addIngredientRow} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">+ Add</button>
            </div>
            {ingredientsList.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                    <select value={item.ingredient} onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)} className="flex-1 border p-2 rounded focus:outline-none focus:border-blue-500 text-sm" required>
                        <option value="">Select Ingredient</option>
                        {availableIngredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name}</option>)}
                    </select>
                    <input type="text" placeholder="Quantity" value={item.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} className="flex-1 border p-2 rounded focus:outline-none focus:border-blue-500 text-sm" required />
                    <button type="button" onClick={() => removeIngredientRow(index)} className="text-red-500 font-bold px-2">X</button>
                </div>
            ))}
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 transition">Save Changes</button>
      </form>
    </div>
  )
}

export default EditRecipe