import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'

function PublicProfile() {
  const { id } = useParams() 
  const [profile, setProfile] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [error, setError] = useState('')

  const [isFollowing, setIsFollowing] = useState(false)
  const [followId, setFollowId] = useState(null)

  useEffect(() => {
    api.get(`users/profiles/${id}/`)
      .then(res => setProfile(res.data))
      .catch(() => setError("User not found."))
 
    api.get('recipes/recipes/')
      .then(res => {
        const allRecipes = res.data.results || res.data
        const userRecipes = allRecipes.filter(r => String(r.author_id) === String(id))
        setRecipes(userRecipes)
      })
      .catch(err => console.error("Could not fetch recipes", err))
 
    checkIfFollowing()
  }, [id])

  const checkIfFollowing = async () => {
    try {
      const res = await api.get('users/follows/?type=following')
      const follows = res.data.results || res.data
      const existingFollow = follows.find(f => String(f.following) === String(id))
      
      if (existingFollow) {
        setIsFollowing(true)
        setFollowId(existingFollow.id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleFollow = async () => {
    if (isFollowing) return
    try {
      const res = await api.post('users/follows/', { following: id })
      setIsFollowing(true)
      setFollowId(res.data.id)

      setProfile(prev => ({ ...prev, followers_count: prev.followers_count + 1 }))
    } catch (err) {
      console.error(err)
    }
  }

  const handleUnfollow = async () => {
    if (!isFollowing || !followId) return
    try {
      await api.delete(`users/follows/${followId}/`)
      setIsFollowing(false)
      setFollowId(null)
      setProfile(prev => ({ ...prev, followers_count: prev.followers_count - 1 }))
    } catch (err) {
      console.error(err)
    }
  }

  if (error) return <div className="text-center mt-20 text-red-500 font-bold">{error}</div>
  if (!profile) return <div className="text-center mt-20 text-gray-500">Loading profile...</div>

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
 
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-blue-500 flex-shrink-0">
              {profile.profile_picture ? (
                <img src={profile.profile_picture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-3xl">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">@{profile.username}</h1>
              
              <div className="flex space-x-6 text-sm mt-3">
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
 
          <div className="flex flex-col items-end">
            <button 
              onClick={!isFollowing ? handleFollow : undefined}
              onDoubleClick={isFollowing ? handleUnfollow : undefined}
              title={isFollowing ? "Double-click to unfollow" : "Click to follow"}
              className={`px-6 py-2 rounded-full text-sm font-bold transition shadow-md text-white ${
                isFollowing 
                  ? "bg-gray-500 hover:bg-red-500" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isFollowing ? "Following" : "+ Follow"}
            </button>
            {isFollowing && <span className="text-xs text-gray-400 mt-2">Double-click to unfollow</span>}
          </div>
        </div>

        {profile.bio && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
          </div>
        )}
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-6">Recipes by @{profile.username}</h3>
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <Link 
              key={recipe.id} 
              to={`/recipe/${recipe.id}`}
              className="block bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition transform hover:-translate-y-1"
            >
              {recipe.image && (
                <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover rounded-md mb-4" />
              )}
              <h4 className="text-lg font-bold text-gray-800">{recipe.title}</h4>
              <p className="text-sm text-gray-500 mt-1">⏱️ {recipe.cook_time} mins</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic bg-white p-6 rounded-lg border border-gray-200 text-center">
          This user hasn't posted any recipes yet.
        </p>
      )}
    </div>
  )
}

export default PublicProfile