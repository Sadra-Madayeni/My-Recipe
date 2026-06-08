import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateRecipe from './pages/CreateRecipe'  
import Profile from './pages/Profile'
import RecipeDetail from './pages/RecipeDetail'
import PublicProfile from './pages/PublicProfile'
import NotFound from './pages/NotFound'
import EditRecipe from './pages/EditRecipe'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-recipe" element={<CreateRecipe />} /> 
          <Route path="/profile" element={<Profile />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/user/:id" element={<PublicProfile />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App