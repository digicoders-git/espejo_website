import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showInfo } from "./CustomLoader";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://glassadminpanelapi.onrender.com/api";
const SLIDER_API = `${API_BASE_URL}/sliders`;

// fallback
const fallbackSlides = [
  {
    title: "Discover",
    subtitleLine1: "INDIA MOST",
    subtitleLine2: "INTELLIGENT MIRRORS",
    highlight: "75000+ HAPPY CLIENT",
    image:
      "https://cdn.shopify.com/s/files/1/0685/2034/5908/files/Untitled_10.001-1_686eaaf9-f851-428e-b2a2-1d0156dc61fc.webp?v=1739714271",
    buttonText: "Explore",
    linkUrl: "/bestseller",
  },
];

const Slider = ({ onOrderNow }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [slides, setSlides] = useState(fallbackSlides);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch(SLIDER_API);
        const data = await res.json();

        if (data?.sliders && data.sliders.length > 0) {
          const activeSliders = data.sliders.filter((s) => s.isActive);
          const allSlides = [];
          activeSliders.forEach((s) => {
            // Priority to current image field
            if (s.image?.url) {
              allSlides.push({
                title: s.title || "Discover",
                subtitleLine1: s.subtitle || "INDIA MOST",
                subtitleLine2: "INTELLIGENT MIRRORS",
                highlight: "75000+ HAPPY CLIENT",
                image: s.image.url,
                buttonText: s.buttonText || "Shop Now",
                linkUrl: s.linkUrl || "/bestseller",
              });
            } else if (s.images && s.images.length > 0) {
              // Fallback for any records created during the multi-image test
              s.images.forEach((img) => {
                allSlides.push({
                  title: s.title || "Discover",
                  subtitleLine1: s.subtitle || "INDIA MOST",
                  subtitleLine2: "INTELLIGENT MIRRORS",
                  highlight: "75000+ HAPPY CLIENT",
                  image: img.url,
                  buttonText: s.buttonText || "Shop Now",
                  linkUrl: s.linkUrl || "/bestseller",
                });
              });
            }
          });

          if (allSlides.length > 0) {
            setSlides(allSlides);
          } else {
            setSlides(fallbackSlides);
          }
        }
      } catch (error) {
        console.error("Slider fetch error:", error);
      }
    };

    fetchSliders();
  }, []);

  const nextSlide = useCallback(() => {
    setFade(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
      setFade(true);
    }, 500); // fade out time
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(nextSlide, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [nextSlide, slides.length]);

  const currentSlide = slides[currentIdx] || fallbackSlides[0];

  const handleOrderNow = () => {
    if (isLoggedIn) {
      navigate(currentSlide.linkUrl);
      showSuccess("Browse our best selling mirrors!");
    } else {
      if (onOrderNow) {
        onOrderNow();
      } else {
        navigate(currentSlide.linkUrl);
        showInfo("Check out our amazing mirror collection!");
      }
    }
  };

  return (
    <div className="company relative w-full h-screen md:h-[700px] overflow-hidden bg-black">
      <img
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
        src={currentSlide.image}
        alt={currentSlide.title}
      />

      {/* Text Content */}
      <div className={`text absolute top-[44%] md:top-[40%] left-[5%] space-y-2 md:space-y-4 transition-all duration-1000 ${
          fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
        <h2 className="text-white font-bold text-lg md:text-2xl">
          {currentSlide.title}
        </h2>

        <p className="text-white font-bold text-3xl md:text-5xl leading-tight">
          {currentSlide.subtitleLine1}
        </p>

        <p className="text-white font-bold text-3xl md:text-5xl leading-tight">
          {currentSlide.subtitleLine2}
        </p>

        <p
          className="font-bold text-xl md:text-3xl"
          style={{ color: "#862b2a" }}
        >
          {currentSlide.highlight}
        </p>

        <button
          onClick={handleOrderNow}
          className="mt-4 bg-[#862b2a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#a03b3a] transition-colors"
        >
          {currentSlide.buttonText}
        </button>
      </div>

      {/* Dots navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setFade(false);
                setTimeout(() => {
                  setCurrentIdx(i);
                  setFade(true);
                }, 500);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIdx ? "bg-white scale-125" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;

