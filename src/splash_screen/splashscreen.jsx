import image1 from "../assets/Teal and White Modern Fashion Poster.png";

export default function SplashScreen() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[2fr_3fr]">
      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center px-12  text-[#1f3d36]">
        <h1 className="text-5xl font-bold mb-5">AI Fashion Stylist</h1>

        <p className="text-lg">
          <span className="text-red-600 font-bold">Discover outfits powered by AI </span> <br /> That understand your taste, recommend
          trendy styles, and help you look confident every day with perfectly
          matched fashion choices.
        </p>

        <button className="w-fit bg-[#1f3d36] text-white font-semibold px-10 py-3 mt-4 rounded-full hover:opacity-90 transition">
          Get Started
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center ">
        <div className="w-[620px] h-[800px] flex items-center justify-center">
          <img
            src={image1}
            alt="AI Fashion"
            className="w-full h-full object-cover rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
