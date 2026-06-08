import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api'

function RecipeDetail() {
  const { id } = useParams() 
  const navigate = useNavigate()
  
  const [recipe, setRecipe] = useState(null)
  const [error, setError] = useState('')

  const [isFollowing, setIsFollowing] = useState(false)
  const [followId, setFollowId] = useState(null)
  const [interactionMessage, setInteractionMessage] = useState('')

  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewMessage, setReviewMessage] = useState('')
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {

    api.get(`recipes/recipes/${id}/`)
      .then(res => {
        setRecipe(res.data)

        checkIfFollowing(res.data.author_id)
      })
      .catch(err => {
        console.error(err)

        setError("Could not load this recipe.")
      })

    fetchReviews()
  }, [id])

  const checkIfFollowing = async (authorId) => {
    try {

      const res = await api.get('users/follows/?type=following')

      const follows = res.data.results || res.data
 
      const existingFollow = follows.find(f => f.following === authorId)
      
      if (existingFollow) {
        setIsFollowing(true)
        setFollowId(existingFollow.id) 
      }
    } catch (err) {

      console.error("Could not check follow status", err)

    }
  }

  const handleFollow = async () => {
    if (isFollowing) return  

    try {
      const res = await api.post('users/follows/', { following: recipe.author_id })
      setIsFollowing(true)
      setFollowId(res.data.id)  
      setInteractionMessage(`You are now following @${recipe.author}!`)

    } catch (err) {

      if (err.response && err.response.data.detail) {
        setInteractionMessage(err.response.data.detail) 
        
      } else {
        setInteractionMessage("Failed to follow user.")
      }
    }
  }

  const handleUnfollow = async () => {
    if (!isFollowing || !followId) return

    try {
      await api.delete(`users/follows/${followId}/`)
      setIsFollowing(false)
      setFollowId(null)
      setInteractionMessage(`You unfollowed @${recipe.author}.`)
    } catch (err) {
      setInteractionMessage("Failed to unfollow user.")
    }
  }

  const handleBookmark = async () => {
    try {
      await api.post('interactions/bookmarks/', { recipe: id })
      setInteractionMessage("Recipe saved to your profile! 🔖")
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        const errorMsg = Array.isArray(err.response.data.detail) 
          ? err.response.data.detail[0] 
          : err.response.data.detail
        setInteractionMessage(errorMsg)
      } else {
        setInteractionMessage("Failed to save recipe.")
      }
    }
  }

  const fetchReviews = () => {
    api.get(`interactions/reviews/?recipe=${id}`)
      .then(res => setReviews(res.data.results || res.data))
      .catch(err => console.error("Could not load reviews", err))
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setReviewError('')
    setReviewMessage('')

    try {
      await api.post('interactions/reviews/', {
        recipe: id, 
        rating: rating,
        comment: comment
      })
      
      setReviewMessage("Review posted successfully!")
      setComment('') 
      setRating(5) 
      fetchReviews() 
      
    } catch (err) {
      console.error(err)
      setReviewError("Failed to post review. Make sure you are logged in!")
    }
  }

  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>
  if (!recipe) return <div className="text-center mt-20 text-gray-500">Loading recipe...</div>

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
        
        {recipe.image && (
          <img src={recipe.image} alt={recipe.title} className="w-full h-96 object-cover" />
        )}
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{recipe.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {recipe.category_name || "Uncategorized"}
                </span>
                <span>⏱️ {recipe.cook_time} minutes</span>
              </div>
            </div>
            
            <div className="text-right flex flex-col items-end">
              <p className="text-gray-500 text-sm mb-1">Recipe by</p>
              <Link to={`/user/${recipe.author_id}`} className="text-lg font-bold text-blue-600 hover:text-blue-800 hover:underline mb-2 block transition">
                        @{recipe.author}
            </Link>
              
              <div className="flex space-x-2">
                <button 
                  onClick={handleBookmark}
                  className="bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition shadow"
                >
                  🔖 Save
                </button>
                
                <button 
                  onClick={!isFollowing ? handleFollow : undefined}
                  onDoubleClick={isFollowing ? handleUnfollow : undefined}
                  title={isFollowing ? "Double-click to unfollow" : "Click to follow"}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition shadow text-white ${
                    isFollowing 
                      ? "bg-gray-500 hover:bg-red-500" 
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isFollowing ? "Following" : "+ Follow Chef"}
                </button>
              </div>
              
              {interactionMessage && <p className="text-xs mt-2 text-green-600 font-semibold">{interactionMessage}</p>}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b pb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{recipe.description}</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 border-b pb-2">Ingredients</h3>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {recipe.ingredients.map(ing => (
                  <li key={ing.id} className="text-lg">
                    <span className="font-semibold">{ing.quantity}</span> - {ing.ingredient_name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No ingredients listed for this recipe.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Reviews</h3>
        
        <form onSubmit={handleReviewSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Leave a Review</h4>
          
          {reviewError && <p className="text-red-500 mb-2 text-sm">{reviewError}</p>}
          {reviewMessage && <p className="text-green-600 mb-2 text-sm font-semibold">{reviewMessage}</p>}
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Rating (1-5)</label>
            <select 
              value={rating} 
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 w-32"
            >
              <option value={5}>5 Stars ★★★★★</option>
              <option value={4}>4 Stars ★★★★☆</option>
              <option value={3}>3 Stars ★★★☆☆</option>
              <option value={2}>2 Stars ★★☆☆☆</option>
              <option value={1}>1 Star  ★☆☆☆☆</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2 text-sm">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500 h-24"
              placeholder="What did you think of this recipe?"
              required
            />
          </div>
          
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition">
            Submit Review
          </button>
        </form>

        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map(rev => (
              <div key={rev.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-800">@{rev.user}</span>
                  <span className="text-yellow-500 font-bold text-lg">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </span>
                </div>
                <p className="text-gray-700">{rev.comment}</p>
                <span className="text-xs text-gray-400 mt-2 block">
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No reviews yet. Be the first to try it!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetail