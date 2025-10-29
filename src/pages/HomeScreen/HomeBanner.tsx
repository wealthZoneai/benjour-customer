import React, { useEffect, useRef, useState } from "react";

interface BannerData {
  videoUrl?: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
}

const fallbackVideos = [
  "/videos/alcohol1.mp4",
  "/videos/alcohol2.mp4",
];

const fallbackBanner: BannerData = {
  imageUrl:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
  title: "Everything You Crave, Delivered Fast.",
  subtitle:
    "From fresh groceries to fine spirits — shop all your essentials in one place.",
};

const HomeBanner: React.FC = () => {
  const [bannerData, setBannerData] = useState<BannerData[]>([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // ✅ Simulate API fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await new Promise<BannerData[]>((resolve) =>
          setTimeout(
            () =>
              resolve([
                {
                  videoUrl: "", // Empty → fallback videos used
                  imageUrl:
                    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
                  title: "Explore Premium Spirits Near You",
                  subtitle:
                    "Your favorite alcohol brands, now just a tap away. Fast delivery. Best prices.",
                },
              ]),
            800
          )
        );
        setBannerData(response.length ? response : [fallbackBanner]);
      } catch (err) {
        console.error("Error fetching banner data:", err);
        setBannerData([fallbackBanner]);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoReady(true);
    };

    const handlePlay = () => {
      setIsVideoPlaying(true);
    };

    const handleWaiting = () => {
      setIsVideoPlaying(false);
    };

    const handleEnded = () => {
      setIsVideoPlaying(false);
      setIsVideoReady(false);
      setCurrentVideo((prev) => (prev + 1) % fallbackVideos.length);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("play", handlePlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // ✅ Load and play video when index changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsVideoReady(false);
    setIsVideoPlaying(false);

    video.load();
    video
      .play()
      .then(() => {
        setIsVideoReady(true);
        setIsVideoPlaying(true);
      })
      .catch(() => {
        setIsVideoPlaying(false);
      });
  }, [currentVideo]);

  const currentBanner = bannerData[0] || fallbackBanner;
  const videoSrc =
    currentBanner.videoUrl || fallbackVideos[currentVideo % fallbackVideos.length];

  const showImage = !isVideoPlaying || !isVideoReady;

  return (
    <div className="relative w-[98%] h-[50vh] flex overflow-hidden rounded-b-3xl mt-16 mx-auto bg-transparent">
      {/* ✅ Show image until video fully plays */}
      {showImage && currentBanner.imageUrl && (
        <img
          src={currentBanner.imageUrl}
          alt="banner"
          className="absolute top-0 left-0 w-full h-full object-cover object-center rounded-3xl transition-opacity duration-700 ease-in-out z-0"
        />
      )}

      {/* ✅ Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className={`absolute top-0 left-0 w-full h-full object-cover object-center rounded-3xl transition-opacity duration-700 ease-in-out z-10 ${
          isVideoPlaying && isVideoReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* ✅ Gradient Overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-black/80 via-black/40 to-transparent z-20"></div>

      {/* ✅ Text Content */}
      <div className="absolute bottom-8 left-6 sm:left-12 text-white animate-fade-up z-30">
        <h1 className="text-2xl sm:text-4xl font-semibold mb-3 tracking-tight">
          {currentBanner.title}
        </h1>
        <p className="text-sm sm:text-lg font-light opacity-90 mb-5 max-w-lg">
          {currentBanner.subtitle}
        </p>
      </div>

      {/* ✅ Animation */}
      <style>
        {`
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 1.2s ease-in-out;
          }
          video::-webkit-media-controls {
            display: none !important;
          }
        `}
      </style>
    </div>
  );
};

export default HomeBanner;
