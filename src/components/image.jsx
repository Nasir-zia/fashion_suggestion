import React from "react";
import { useState, useRef } from "react";
import axios from "axios";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 text-red-700 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
          <p>Please try again or refresh the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ImageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setData(null);
  };

  const handleAnalyze = async () => {
    if (!imageFile) return alert("Please upload an image");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await axios.post(
        "http://localhost:5000/api/analyze",
        formData
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Image analysis failed");
    }

    setLoading(false);
  };

  const handleReset = () => {
    setImageFile(null);
    setPreview(null);
    setData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopyRecommendations = () => {
    if (!data?.fashion_recommendations?.length) return;
    navigator.clipboard.writeText(data.fashion_recommendations.join("\n"));
    alert("Fashion recommendations copied!");
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <header className="text-center md:text-left mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Fashion Image Analyzer
            </h1>
            <p className="text-gray-600">
              Upload an image to analyze colors, tags, and get fashion
              recommendations
            </p>
          </header>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT - Upload + Fashion Recommendations */}
            <div className="lg:w-2/5 flex flex-col gap-6">
              {/* Upload Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
                {/* Image Preview */}
                <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-4 h-80 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="Uploaded Preview"
                        className="max-h-full max-w-full object-contain rounded-lg"
                      />
                      <button
                        onClick={handleReset}
                        className="absolute top-4 right-4 bg-white text-gray-700 hover:text-red-600 hover:bg-gray-100 p-2 rounded-full shadow-md transition-all"
                        aria-label="Remove image"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-10 h-10 text-purple-500 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-500">No image uploaded</p>
                      <p className="text-gray-400 text-sm">
                        Click "Upload Image" to select an image
                      </p>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  <button
                    className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center gap-2"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Upload Image
                  </button>

                  <button
                    className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAnalyze}
                    disabled={!imageFile || loading}
                  >
                    {loading ? "Analyzing..." : "Analyze Image"}
                  </button>
                </div>

                {/* Fashion Recommendations */}
                {data?.fashion_recommendations?.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-md p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Fashion Recommendations
                      </h3>
                      <button
                        onClick={handleCopyRecommendations}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Copy All
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {data.fashion_recommendations.map((rec, i) => (
                        <li
                          key={i}
                          className="text-gray-700 text-sm flex gap-2 items-start"
                        >
                          <span className="font-bold text-purple-500">
                            {i + 1}.
                          </span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT - Tags & Colors */}
            <div className="lg:w-3/5 flex flex-col gap-6">
              {data?.tags && data?.colors ? (
                <>
                  {/* Tags Card */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Image Tags
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {data.tags.slice(0, 15).map((t, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200 hover:border-blue-300 transition-all"
                        >
                          {t.tag.en}{" "}
                          <span className="ml-2 text-blue-500 text-xs">
                            {Math.round(t.confidence)}%
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Colors Card */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                      Color Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ColorGroup
                        title="Dominant Colors"
                        colors={data.colors.dominant_colors}
                      />
                      <ColorGroup
                        title="Image Colors"
                        colors={data.colors.image_colors}
                      />
                    </div>
                  </div>
                </>
              ) : !loading ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center justify-center text-center h-64">
                  <p className="text-gray-500">
                    Upload an image and click "Analyze Image" to see results.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 flex items-center justify-center text-center h-64">
                  <p className="text-gray-500">Analyzing image...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

// ColorGroup Component
function ColorGroup({ title, colors }) {
  if (!colors?.length) return null;

  return (
    <div>
      <h4 className="font-semibold text-gray-800 mb-4">{title}</h4>
      <div className="flex flex-wrap gap-5">
        {colors.map((c, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            <div
              title={`${c.color_name} (${c.percent}%)`}
              style={{
                backgroundColor: c.html_code,
                width: 56,
                height: 56,
                borderRadius: "16px",
                border: "3px solid white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              className="group-hover:scale-110 transition-transform duration-200"
            />
            <div className="mt-3">
              <p className="font-medium text-gray-800">
                {c.color_name} {getColorEmoji(c.color_name)}
              </p>
              <p className="text-sm text-gray-500 mt-1">{c.percent}%</p>
              <p className="text-xs text-gray-400 font-mono mt-1">
                {c.html_code}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Map color names to emojis
function getColorEmoji(colorName) {
  const map = {
    Red: "🟥",
    Blue: "🟦",
    Green: "🟩",
    Yellow: "🟨",
    Black: "⬛",
    White: "⬜",
    Orange: "🟧",
    Purple: "🟪",
    Pink: "💗",
    Brown: "🟫",
    Gray: "⬜",
  };
  for (const key in map) {
    if (colorName.includes(key)) return map[key];
  }
  return "🎨";
}
