import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showInfo } from "./CustomLoader";

const SLIDER_API = "https://glassadminpanelapi.onrender.com/api/sliders";

// fallback (agar API fail ho)
const fallbackSlider = {
  title: "Discover",
  subtitleLine1: "INDIA MOST",
  subtitleLine2: "INTELLIGENT MIRRORS",
  highlight: "75000+ HAPPY CLIENT",
  image:
    "https://cdn.shopify.com/s/files/1/0685/2034/5908/files/Untitled_10.001-1_686eaaf9-f851-428e-b2a2-1d0156dc61fc.webp?v=1739714271",
  buttonText: "Explore",
  linkUrl: "/bestseller",
};

const Slider = ({ onOrderNow }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [slider, setSlider] = useState(fallbackSlider);

  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const res = await fetch(SLIDER_API);
        const data = await res.json();

        const activeSlider = data?.sliders?.find(
          (s) => s.isActive === true
        );

        if (activeSlider) {
          setSlider({
            title: activeSlider.title || "Discover",
            subtitleLine1: activeSlider.subtitle || "INDIA MOST",
            subtitleLine2: "INTELLIGENT MIRRORS",
            highlight: "75000+ HAPPY CLIENT",
            image:
              activeSlider.image?.url || fallbackSlider.image,
            buttonText: activeSlider.buttonText || "Shop Now",
            linkUrl: activeSlider.linkUrl || "/bestseller",
          });
        }
      } catch (error) {
        console.error("Slider fetch error:", error);
      }
    };

    fetchSlider();
  }, []);

  const handleOrderNow = () => {
    if (isLoggedIn) {
      navigate(slider.linkUrl);
      showSuccess("Browse our best selling mirrors!");
    } else {
      if (onOrderNow) {
        onOrderNow();
      } else {
        navigate(slider.linkUrl);
        showInfo("Check out our amazing mirror collection!");
      }
    }
  };

  return (
   <div className="company relative w-full h-[100vh] md:h-[700px] overflow-hidden">
  <img
    className="w-full h-full object-cover"
    src={slider.image}
    alt={slider.title}
  />

      {/* Text Content (SAME UI AS BEFORE) */}
      <div className="text absolute left-18  top-[44%] md:top-[40%] left-[5%] space-y-2 md:space-y-4">
        <h2 className="text-white font-bold text-lg md:text-2xl">
          {slider.title}
        </h2>

        <p className="text-white font-bold text-3xl md:text-5xl leading-tight">
          {slider.subtitleLine1}
        </p>

        <p className="text-white font-bold text-3xl md:text-5xl leading-tight">
          {slider.subtitleLine2}
        </p>

        <p
          className="font-bold text-xl md:text-3xl"
          style={{ color: "#862b2a" }}
        >
          {slider.highlight}
        </p>

        {/* Button (optional – agar chaho) */}
        <button
          onClick={handleOrderNow}
          className="mt-4 bg-[#862b2a] text-white px-6 py-3 rounded-lg font-semibold"
        >
          {slider.buttonText}
        </button>
      </div>
    </div>
  );
};

export default Slider;
