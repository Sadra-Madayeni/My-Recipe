import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' 
import api from '../api'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [bookmarks, setBookmarks] = useState([]) 
  const [myRecipes, setMyRecipes] = useState([])
  
  const [bio, setBio] = useState('')
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchProfile()
    fetchBookmarks() 
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('users/profiles/me/')
      setProfile(response.data)
      setBio(response.data.bio || '')
      fetchMyRecipes(response.data.id)
    } catch (err) {
      setError("Could not load profile data.")
    }
  }

  const fetchMyRecipes = async (userId) => {
    try {
      const response = await api.get('recipes/recipes/')
      const allRecipes = response.data.results || response.data
      const userRecipes = allRecipes.filter(r => r.author_id === userId)
      setMyRecipes(userRecipes)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchBookmarks = async () => {
    try {
      const response = await api.get('interactions/bookmarks/')
      setBookmarks(response.data.results || response.data)
    } catch (err) {
      console.error("Could not load bookmarks")
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('bio', bio)
    if (image) {
      formData.append('profile_picture', image)
    }

    try {
      const response = await api.patch(`users/profiles/${profile.id}/`, formData)
      setProfile(response.data)
      setIsEditing(false)
      setSuccess("Profile updated successfully!")
    } catch (err) {
      setError("Failed to update profile.")
    }
  }

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this recipe? This cannot be undone.")) return;
    
    try {
      await api.delete(`recipes/recipes/${recipeId}/`)
      setMyRecipes(myRecipes.filter(r => r.id !== recipeId))
    } catch (err) {
      alert("Failed to delete recipe.")
    }
  }

  if (!profile) return <div className="text-center mt-20">Loading profile...</div>

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 mb-8">
        
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-blue-500 flex-shrink-0">
            {profile.profile_picture ? (
              <img src={profile.profile_picture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-2xl">
                {profile.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">@{profile.username}</h1>
            <p className="text-gray-600 mt-1 mb-3">{profile.email}</p>
            
            <div className="flex space-x-6 text-sm">
              <div className="text-center">
                <span className="block font-bold text-xl text-gray-800">{profile.followers_count || 0}</span>
                <span className="text-gray-500 font-semibold">Followers</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-xl text-gray-800">{profile.following_count || 0}</span>
                <span className="text-gray-500 font-semibold">Following</span>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4 font-semibold">{success}</p>}

        {!isEditing ? (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">About Me</h3>
            <p className="text-gray-700 whitespace-pre-wrap mb-6">
              {profile.bio || "This user hasn't written a bio yet."}
            </p>
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 h-24"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">New Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full text-gray-600"
              />
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                Save Changes
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
    
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">👨‍🍳 My Uploads</h3>
          {myRecipes.length > 0 ? (
            <div className="space-y-4">
              {myRecipes.map(recipe => (
                <div key={recipe.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                  
                  <Link to={`/recipe/${recipe.id}`} className="font-semibold text-blue-600 hover:underline truncate mr-4">
                    {recipe.title}
                  </Link>
                  
                  <div className="flex space-x-2">
                    <Link 
                      to={`/edit-recipe/${recipe.id}`}
                      className="text-blue-500 hover:text-blue-700 text-sm font-bold bg-white px-3 py-1 rounded shadow-sm border border-gray-200 hover:bg-blue-50 transition"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-bold bg-white px-3 py-1 rounded shadow-sm border border-gray-200 hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">You haven't uploaded any recipes yet.</p>
          )}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">🔖 Saved Recipes</h3>
          {bookmarks.length > 0 ? (
            <div className="space-y-4">
              {bookmarks.map(bookmark => (
                <Link 
                  key={bookmark.id} 
                  to={`/recipe/${bookmark.recipe}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-800">{bookmark.recipe_title}</h4>
                    <span className="text-blue-500 font-bold">→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">You haven't saved any recipes yet.</p>
          )}
        </div>

      </div>
    </div>
  )
}

export default Profile