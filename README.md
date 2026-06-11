# My Recipe: Full-Stack Recipe Social Network

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django REST](https://img.shields.io/badge/Django_REST-ff1709?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

My Recipe is a containerized, production-ready full-stack web application that allows users to discover, share, and interact with culinary recipes. Built with a Django REST Framework (DRF) backend and a modern React (Vite) frontend, it features robust relational databases, secure JWT authentication, and a full suite of social interactions. 

The entire application is fully dockerized, utilizing a multi-stage Nginx build for the frontend and a Gunicorn WSGI server for the backend, demonstrating modern DevOps best practices.

---

 **Live Site Available!**

You can explore the fully deployed application right now at: **[my-recipe-orpin.vercel.app](https://my-recipe-orpin.vercel.app/)**

This full-stack project leverages a modern, decoupled cloud architecture:
* **Frontend:** Deployed on **Vercel** using a custom Dockerfile.
* **Backend:** Containerized with **Docker** and hosted on **Back4App**.
* **Database:** Powered by serverless PostgreSQL via **Neon Tech**.

---

## Key Features

* **Secure Authentication:** JSON Web Token (JWT) based login and registration system.
* **Social Graph:** Users can follow/unfollow other chefs. Profiles dynamically calculate and display follower/following metrics.
* **Rich Interactions:** Authenticated users can leave 1-5 star ratings, write reviews, and bookmark their favorite recipes to their personal dashboard.
* **Dynamic Frontend Search:** Lightning-fast, client-side filtering allows users to instantly search recipes by title or specific ingredients.
* **Media Handling:** Full support for `multipart/form-data` uploads, allowing users to upload recipe images and custom profile avatars directly to cloud storage.
* **Decoupled Architecture:** Clean separation of concerns between the API backend and the Single Page Application (SPA) frontend.


## Architecture & Infrastructure

This project was built with production scalability, data integrity, and rapid deployment in mind.

### Database & Application Design
* **Centralized Taxonomy:** `Categories` and `Ingredients` are restricted to Admin-creation only. This prevents database bloat and duplicate entries (e.g., "egg", "Eggs", "large eggs"), ensuring that relational queries and ingredient-based filtering remain lightning-fast and 100% accurate.
* **Complex Relationships:** Utilizes Django's `related_name` attributes and custom `UniqueConstraints` to handle many-to-many relationships, such as the User Follower network and Recipe Bookmarks, preventing duplicate interactions.

### DevOps & Containerization
* **Multi-Stage Frontend Build:** The React application does not run a heavy Node.js development server in production. Docker compiles the Vite source code into static HTML/JS/CSS assets, which are then served via an ultra-lightweight Nginx container.
* **Nginx Client-Side Routing:** Custom Nginx configuration (`try_files`) ensures that React Router's client-side history API functions perfectly without throwing 404 errors on manual page refreshes.
* **Production-Grade Backend:** Replaced the default Django development server with **Gunicorn**, a robust Python WSGI HTTP Server, paired with **WhiteNoise** for highly optimized static file delivery.
* **Automated Bootstrapping:** The `docker-compose.yml` is configured to automatically run database migrations (`python manage.py migrate`) and gather static files (`python manage.py collectstatic`) upon container initialization.

---

## Technical Implementation

### Frontend Engineering (React / Vite)
* **API Interception & Security:** Configured an Axios interceptor to automatically intercept outgoing HTTP requests and attach JWT access tokens to the `Authorization` header, ensuring a seamless and secure user session without manual token handling in every component.
* **Client-Side Search Optimization:** Implemented a real-time, non-blocking search feature on the homepage. By filtering the recipe state directly on the client side using JavaScript's `filter()` and `some()` methods, the application provides instant feedback without hitting the database for every keystroke.
* **Form Data & Media Handling:** Built dynamic form components capable of handling complex payloads, specifically packaging text data alongside image files using JavaScript's native `FormData` API to correctly construct `multipart/form-data` requests.
* **State Management & Routing:** Utilized React Hooks (`useState`, `useEffect`) for localized state management and lifecycle handling, paired with `react-router-dom` for a fluid, Single Page Application (SPA) routing experience.

### Backend Engineering (Django REST Framework)
* **Stateless Authentication:** Implemented `djangorestframework-simplejwt` to issue secure, time-limited access and refresh tokens, ensuring the API remains completely stateless and scalable.
* **Complex Data Serialization:** Designed custom DRF Serializers to parse complex incoming JSON arrays (like dynamic ingredient lists) and simultaneously handle nested relational queries. The serializers safely extract, validate, and write multi-model data in a single POST request.
* **Robust Database Constraints:** Enforced data integrity at the database layer. Implemented `UniqueConstraint` on the Follows model to prevent duplicate network relationships, and utilized `related_name` attributes extensively for highly efficient reverse-lookups.
* **RESTful Routing:** Leveraged DRF `DefaultRouter` and `ModelViewSets` to automatically generate highly predictable, standard RESTful endpoints for CRUD operations across Users, Recipes, and Interactions.

---

## ☁️ Tech Stack & Deployment Strategy

This project is architected for a decoupled, serverless-friendly cloud deployment. *(Note: The live cloud deployment is currently in progress. Live URLs will be updated here shortly).*

* **Frontend:** React 18, Vite, Tailwind CSS -> *Configured for global CDN distribution via **Vercel**.*
* **Backend:** Python 3.11, Django 5.x, DRF -> *Dockerized and prepped for deployment on **Back4App** web services.*
* **Database:** PostgreSQL -> *Configured to utilize **Neon.tech** (Serverless DB).* (Used sqlite for local production)
* **Media Storage:** Cloudinary -> *User uploads are routed securely via `django-cloudinary-storage` to prevent data loss on ephemeral cloud file systems.*
* **DevOps:** Docker, Docker Compose, Nginx.

---

## Local Setup & Installation

Because this project is fully dockerized, you do not need to install Python, Node.js, or any database software directly on your machine. **You only need Docker.**

### 1. Clone the Repository
```bash
git clone https://github.com/Sadra-Madayeni/My-Recipe.git
cd My-Recipe
```

### 2. Configure Environment Variables
Create a .env file in the backend/ directory to store your local secrets.
```bash
SECRET_KEY=django-insecure-your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost,[http://127.0.0.1](http://127.0.0.1)
DATABASE_URL=sqlite:///db.sqlite3
CLOUDINARY_URL=  # Leave blank for local dev, or add your Cloudinary URL
```

### 3. Spin up the Containers
Use Docker Compose to build the images, compile the frontend, and start the servers.
```bash
docker compose up --build
```

### 4. Access the Application
Once the terminal logs indicate the Gunicorn worker has booted and Nginx is running, you can access the application:

Frontend App: http://localhost

Backend API / Admin Panel: http://localhost:8000/admin
