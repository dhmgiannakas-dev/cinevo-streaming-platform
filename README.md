# 🎬 CINEVO

CINEVO is a modern and responsive movie and TV series streaming-platform interface built with React.

The application uses real data from the TMDB API and allows users to discover movies and series, search for content, explore detailed information, watch trailers, manage a personal watchlist, and customize their viewing preferences.

The project was built with a focus on reusable components, responsive design, API integration, state management, and a polished streaming-platform user experience.

---

## ✨ Features

- Browse popular movies and TV series
- Explore top-rated and upcoming movies
- Filter movies and series by genre
- Sort content by popularity, rating, and release date
- Pagination for movie and series discovery
- Search across movies and TV series
- Debounced search requests
- Detailed movie and series pages
- Cast, director, and creator information
- YouTube trailer playback
- Recommended content
- Personal **My List** watchlist
- Persistent watchlist using Local Storage
- User settings with persistent preferences
- Trailer autoplay preference
- Reduced motion accessibility option
- Adult content preference
- Loading, error, and empty states
- Custom 404 page
- Responsive navigation
- Fully responsive desktop, tablet, and mobile layouts

---

## 🛠️ Tech Stack

- **React**
- **JavaScript**
- **Vite**
- **React Router**
- **Material UI**
- **CSS**
- **TMDB API**
- **Context API**
- **Local Storage**

---

## 🧠 What I Learned

Building CINEVO helped me improve my understanding of:

- Structuring a larger React application
- Creating reusable React components
- Working with multiple API endpoints
- Handling asynchronous requests with `async/await`
- Managing loading and error states
- Cancelling requests with `AbortController`
- Fetching multiple resources with `Promise.all`
- Building reusable API utilities
- Managing global state with React Context
- Persisting application state with Local Storage
- Creating controlled settings and UI preferences
- Implementing debounced search
- Dynamic routing with React Router
- Conditional rendering
- Responsive layouts for multiple screen sizes
- Building modal interactions and keyboard controls
- Improving accessibility and reduced-motion support
- Organizing data into consistent structures across movies and TV series

---

## 📱 Responsive Design

CINEVO is designed to work across different screen sizes.

### Desktop
A full sidebar navigation and multi-column content layouts.

### Tablet
A compact sidebar with responsive grids and horizontally scrollable filters.

### Mobile
A bottom navigation bar, two-column content grids, touch-friendly controls, and layouts optimized for smaller screens.

---

## ⚙️ Settings

CINEVO includes persistent user preferences through the Settings page.

Users can control:

- **Autoplay Trailers**
- **Reduced Motion**
- **Include Adult Content**

Settings are stored locally in the browser and remain available after refreshing the application.

---

## ❤️ My List

Users can add movies and TV series to their personal watchlist.

The list is managed globally using React Context and persisted with Local Storage.

Movies and series are uniquely identified using both their ID and media type, allowing different content types to be managed consistently.

---

## 🔎 Search

CINEVO includes a search experience powered by the TMDB multi-search API.

The search system includes:

- Debounced requests
- Request cancellation with `AbortController`
- Movie and TV series results
- Loading states
- Error handling
- Empty search states
- Responsive result layouts

---

## 🎥 Movie & Series Details

Each movie or series has a dedicated details page containing relevant information such as:

- Overview
- Rating
- Release or first-air date
- Genres
- Cast
- Director or creators
- Trailer
- Recommendations
- My List controls

Trailer data is loaded on demand from TMDB and displayed through YouTube.

---

## 🌐 API

CINEVO uses the **TMDB API** to retrieve movie and TV series data.

API requests are handled through a reusable `tmdbFetch` utility.

The TMDB access token is stored in an environment variable and is not included in the repository.

Create a `.env` file in the project root:

```env
VITE_TMDB_TOKEN=your_tmdb_token
```

> This product uses the TMDB API but is not endorsed or certified by TMDB.

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project directory:

```bash
cd cinevo
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add your TMDB token:

```env
VITE_TMDB_TOKEN=your_tmdb_token
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

---

## 📦 Main Dependencies

```text
React
React Router
Material UI
Emotion
MUI Icons
```

---

## 🔗 Live Demo

**Live Website:** YOUR_VERCEL_URL

**GitHub Repository:** YOUR_GITHUB_REPOSITORY_URL

---

## 📸 Screenshots

### Home
Add your Home page screenshot here.

### Movies
Add your Movies page screenshot here.

### Details
Add your Movie Details page screenshot here.

### Mobile
Add your mobile screenshot here.

---

## 👨‍💻 Author

Built as a frontend portfolio project.

CINEVO demonstrates practical experience with React, REST APIs, routing, global state, persistent browser storage, responsive design, and reusable component architecture.