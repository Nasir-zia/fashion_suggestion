
import { useState, useRef } from "react";
import { analyzePerson, validateImageFile, getDemoAnalysisData } from "../api/ImageUpload";

export default function ImageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [personData, setPersonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisStep, setAnalysisStep] = useState('');
  const [useDemo, setUseDemo] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate the image file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    
    setError(null);
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setPersonData(null);
    setUseDemo(false);
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisStep("🔄 Initializing analysis...");
    
    try {
      setAnalysisStep("📤 Sending image to Face++ API...");
      const data = await analyzePerson(imageFile);
      setAnalysisStep("✅ Analysis complete!");
      setPersonData(data);
      setUseDemo(false);
    } catch (err) {
      console.error("Analysis error:", err);
      const errorMessage = err.message || "Analysis failed";
      
      // Show demo data option if API fails
      setError(`❌ ${errorMessage}`);
      setAnalysisStep("💡 You can try with demo data instead");
      setUseDemo(true);
    }
    
    setTimeout(() => {
      setAnalysisStep('');
      setLoading(false);
    }, 2000);
  };

  const handleUseDemo = () => {
    setPersonData(getDemoAnalysisData());
    setError(null);
    setUseDemo(false);
    setAnalysisStep("🎭 Using demo data for testing");
  };

  return (
    <div className="flex gap-6 bg-white p-6 rounded-xl shadow-md max-w-2xl">

      {/* LEFT SIDE */}
      <div className="w-1/2">

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded mb-4 w-full"
        >
          Upload Image
        </button>


        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            {useDemo && (
              <button
                onClick={handleUseDemo}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Try Demo Data
              </button>
            )}
          </div>
        )}

        {/* Analysis Step Display */}
        {analysisStep && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm">{analysisStep}</p>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading || !imageFile}
          className={`px-4 py-2 rounded w-full ${
            loading || !imageFile
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white`}
        >
          {loading ? "🔄 Analyzing..." : "🧠 Analyze Image"}
        </button>

        {/* Enhanced Face Data Display */}
        {personData && (
          <div className="mt-4 space-y-2">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="font-semibold text-green-800 mb-2">👤 Analysis Results</h4>
              
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium">{personData.gender?.value || 'Unknown'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">{personData.age?.value || 'Unknown'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Ethnicity:</span>
                  <span className="font-medium">{personData.ethnicity?.value || 'Unknown'}</span>
                </div>
                


                <div className="flex justify-between">
                  <span className="text-gray-600">Skin Status:</span>
                  <span className="font-medium">{personData.skinstatus?.status || 'Unknown'}</span>
                </div>
                
                {personData.hair?.color && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hair Color:</span>
                    <span className="font-medium">
                      {Object.entries(personData.hair.color)
                        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown'}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Face Quality:</span>
                  <span className="font-medium">
                    {personData.facequality?.value > 0.8 ? 'Excellent' : 
                     personData.facequality?.value > 0.6 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
                
                {personData.emotion && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dominant Emotion:</span>
                    <span className="font-medium">
                      {Object.entries(personData.emotion)
                        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown'}
                    </span>
                  </div>
                )}
                
                {personData.beauty && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Beauty Score:</span>
                    <span className="font-medium">
                      {personData.beauty.male_score || personData.beauty.female_score || 'N/A'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>


      {/* RIGHT SIDE */}
      <div className="w-1/2 flex flex-col items-center justify-center border rounded-lg p-4">
        {preview ? (
          <div className="w-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 rounded-lg object-contain"
            />
            <div className="mt-2 text-xs text-gray-500 text-center">
              {imageFile.name} • {(imageFile.size / 1024).toFixed(1)} KB
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-gray-400 text-sm">Image preview will appear here</p>
            <p className="text-gray-300 text-xs mt-1">JPG, PNG, or BMP • Max 2MB</p>
          </div>
        )}
        
        {/* Additional Information */}
        <div className="mt-4 text-xs text-gray-500 text-center max-w-full">
          <p>🔒 Your images are processed securely</p>
          <p>🌍 Optimized for Pakistani users</p>
        </div>
      </div>

    </div>
  );
}
