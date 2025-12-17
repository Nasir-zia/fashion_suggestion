
import axios from "axios";

export const analyzePerson = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const apiKey = import.meta.env.VITE_FACE_KEY;
  const apiSecret = import.meta.env.VITE_FACE_SECRET;
  const debugMode = import.meta.env.VITE_DEBUG_MODE === 'true';

  // Check if API keys are present
  if (!apiKey || !apiSecret) {
    throw new Error("Face++ API credentials are missing. Please check your .env file and ensure you have valid API_KEY and API_SECRET.");
  }

  if (debugMode) {
    console.log("🔍 Debug Mode: API Key exists:", !!apiKey);
    console.log("🔍 Debug Mode: API Secret exists:", !!apiSecret);
  }

  // Use international API endpoint for Pakistani users
  const baseUrl = "https://api-us.faceplusplus.com";
  
  try {
    const response = await axios.post(
      `${baseUrl}/facepp/v3/detect`,
      formData,
      {
        params: {
          api_key: apiKey,
          api_secret: apiSecret,
          return_attributes: "gender,age,ethnicity,skinstatus,headpose,beauty,facequality,emotion,hair,eyestatus",
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 45000, // Increased timeout for better reliability
      }
    );

    console.log("Face++ API Response:", response.data);

    // Check if faces were detected
    if (!response.data.faces || response.data.faces.length === 0) {
      throw new Error("No faces detected in the image. Please upload a clear image with a visible face.");
    }

    // Extract first detected face
    const face = response.data.faces[0]?.attributes || {};
    return face;

  } catch (error) {
    console.error("Face++ API Error Details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers
    });


    // Enhanced error handling for Pakistani users
    if (error.response?.status === 403) {
      const errorMsg = error.response?.data?.error_msg || error.response?.data?.error || '';
      
      if (errorMsg.includes("AUTHORIZATION_ERROR") || errorMsg.includes("permission")) {
        throw new Error("🔑 API Authorization Failed: Please verify your Face++ API credentials are correct and have sufficient permissions.");
      } else if (errorMsg.includes("IMAGE_ERROR_UNSUPPORTED_FORMAT")) {
        throw new Error("📷 Unsupported image format. Please use JPG, PNG, or BMP files only.");
      } else if (errorMsg.includes("NO_FACE") || errorMsg.includes("NO_PERSON")) {
        throw new Error("👤 No face detected. Please upload a clear image with a visible face.");
      } else if (errorMsg.includes("IMAGE_FILE_TOO_LARGE")) {
        throw new Error("📏 Image file too large. Please use an image smaller than 2MB.");
      } else {
        throw new Error(`🚫 API Permission Error (403): ${errorMsg || 'Please check your account status and API limits.'}`);
      }
    } else if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.error_msg || '';
      if (errorMsg.includes("IMAGE_ERROR_INVALID_FACE")) {
        throw new Error("❌ Invalid face detected. Please ensure the image contains a clear, front-facing face.");
      }
      throw new Error(`❌ Invalid Request (400): ${errorMsg || 'Please check your image and try again.'}`);
    } else if (error.response?.status === 429) {
      throw new Error("⏰ API rate limit exceeded. Please wait a moment and try again.");
    } else if (error.response?.status >= 500) {
      throw new Error("🔧 Face++ service temporarily unavailable. Please try again later.");
    } else if (error.code === 'ECONNABORTED') {
      throw new Error("⏱️ Request timeout. The image may be too large or your connection is slow.");
    } else if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      throw new Error("🌐 Network error. Please check your internet connection and try again.");
    } else {
      throw new Error(`⚠️ API Error: ${error.response?.data?.error_msg || error.message}`);
    }
  }
};


// Enhanced test function to verify API credentials
export const testFaceAPIConnection = async () => {
  const apiKey = import.meta.env.VITE_FACE_KEY;
  const apiSecret = import.meta.env.VITE_FACE_SECRET;
  const debugMode = import.meta.env.VITE_DEBUG_MODE === 'true';

  if (!apiKey || !apiSecret) {
    throw new Error("Face++ API credentials are missing. Please check your .env file.");
  }

  try {
    if (debugMode) {
      console.log("🔍 Testing Face++ API connection...");
    }

    // Test API connection
    const response = await axios.get("https://api-us.faceplusplus.com/facepp/v3/get_app", {
      params: {
        api_key: apiKey,
        api_secret: apiSecret
      },
      timeout: 10000
    });
    
    if (debugMode) {
      console.log("✅ Face++ API Connection Test Successful:", response.data);
    }
    
    return {
      success: true,
      data: response.data,
      message: "API connection successful"
    };
  } catch (error) {
    console.error("❌ Face++ API Connection Test Failed:", error);
    
    // Provide specific error messages for common issues
    if (error.response?.status === 403) {
      throw new Error("🔑 API credentials are invalid or lack permissions. Please check your Face++ account.");
    } else if (error.response?.status === 401) {
      throw new Error("🔒 API authentication failed. Please verify your API key and secret.");
    } else if (error.code === 'ECONNABORTED') {
      throw new Error("⏱️ Connection timeout. Please check your internet connection.");
    } else {
      throw new Error(`Connection failed: ${error.message}`);
    }
  }
};

// Image validation utility
export const validateImageFile = (file) => {
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
  
  if (!file) {
    return { valid: false, error: "No file selected" };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: "Unsupported format. Please use JPG, PNG, or BMP files only." 
    };
  }
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: "File too large. Please use an image smaller than 2MB." 
    };
  }
  
  return { valid: true, error: null };
};

// Demo data for when API is unavailable (for development/testing)
export const getDemoAnalysisData = () => {
  return {
    gender: { value: "Male", confidence: 95.2 },
    age: { value: 28, range: { my: 25, My: 32 } },
    ethnicity: { value: "Asian", confidence: 89.7 },
    skinstatus: { 
      status: "Clear",
      health: 85.3,
      stain: 2.1,
      acne: 1.8
    },
    headpose: {
      pitch_angle: { value: -2.3 },
      roll_angle: { value: 1.8 },
      yaw_angle: { value: 0.5 }
    },
    beauty: {
      male_score: 78.9,
      female_score: 0
    },
    facequality: { value: 0.92, threshold: 0.7 },
    emotion: {
      anger: 2.1,
      disgust: 1.5,
      fear: 0.8,
      happiness: 78.3,
      neutral: 15.2,
      sadness: 1.1,
      surprise: 1.0
    },
    hair: {
      bald: 0.1,
      color: { 
        black: 15.2, 
        blonde: 3.1, 
        brown: 78.9, 
        gray: 2.8 
      }
    }}}