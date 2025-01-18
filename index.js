import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const App = () => {
  const [tab, setTab] = useState("all");
  const [cats, setCats] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favoriteCats")) || [];
  });
  const [loading, setLoading] = useState(false);

  const fetchCats = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.thecatapi.com/v1/images/search?limit=10", {
        headers: { "x-api-key": "live_GSZBZtHpvKTMTMdn7zkYOJpad7e6hNMJUsfIYrdnL2zQO3aSCdw3041uQP0Baswh" },
      });
      const data = await response.json();
      setCats((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Ошибка загрузки котиков", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "all") fetchCats();
  }, [tab]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (!loading && tab === "all") fetchCats();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, tab]);

  const toggleFavorite = (cat) => {
    const isFavorite = favorites.some((fav) => fav.id === cat.id);
    const updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav.id !== cat.id)
      : [...favorites, cat];
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteCats", JSON.stringify(updatedFavorites));
  

  const heartIcon = document.querySelector(`.heart-icon[data-id="${cat.id}"]`);
  if (heartIcon) {
    if (isFavorite) {
      heartIcon.classList.remove("favorited");
    } else {
      heartIcon.classList.add("favorited");
    }
  }
};

  return (
    <div className="app">
      <header>
        <nav>
          <button onClick={() => setTab("all")} className={tab === "all" ? "active" : ""}>
            Все котики
          </button>
          <button onClick={() => setTab("favorites")} className={tab === "favorites" ? "active" : ""}>
            Любимые котики
          </button>
        </nav>
      </header>
      <main>
        {tab === "all" && (
          <div className="gallery">
            {cats.map((cat) => (
              <div key={cat.id} className="card">
                <img src={cat.url} alt="Cat" />
                <svg
                  data-id={cat.id}
                  onClick={() => toggleFavorite(cat)}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={favorites.some((fav) => fav.id === cat.id) ? "#FF3A00" : "none"}
                  stroke="currentColor"
                  className={`heart-icon ${favorites.some((fav) => fav.id === cat.id) ? "favorited" : ""}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </div>
            ))}
          </div>
        )}
        {tab === "favorites" && (
          <div className="gallery">
            {favorites.length > 0 ? (
              favorites.map((cat) => (
                <div key={cat.id} className="card">
                  <img src={cat.url} alt="Cat" />
                  <svg
                    data-id={cat.id}
                    onClick={() => toggleFavorite(cat)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={favorites.some((fav) => fav.id === cat.id) ? "#FF3A00" : "none"}
                    stroke="currentColor"
                    className={`heart-icon ${favorites.some((fav) => fav.id === cat.id) ? "favorited" : ""}`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                </div>
              ))
            ) : (
              <p>Нет избранных котиков</p>
            )}
          </div>
        )}
      </main>
      {tab === "all" && loading && (
        <footer>
          <p>... загружаем еще котиков ...</p>
        </footer>
      )}
    </div>
  );
};

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);
