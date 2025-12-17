# Face++ Image Analysis Setup Guide

## 🔧 Configuration Steps

### 1. Get Face++ API Credentials
1. Visit [Face++ Developer Portal](https://www.faceplusplus.com/)
2. Create an account (especially for Pakistani/international users)
3. Create a new application
4. Get your `api_key` and `api_secret`

### 2. Configure Environment Variables
Create a `.env` file in the project root:

```env
# Face++ API Configuration
VITE_FACE_KEY=your_actual_api_key_here
VITE_FACE_SECRET=your_actual_api_secret_here

# Enable debug mode for troubleshooting
VITE_DEBUG_MODE=true
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

## 🚨 Common Issues & Solutions

### 403 Permission Error
**Cause**: Invalid or missing API credentials
**Solution**:
- Verify your API key and secret are correct
- Check if your Face++ account has sufficient credits
- Ensure you're using the correct API endpoint (US endpoint for international users)

### No Face Detected
**Cause**: Image doesn't contain a clear, front-facing face
**Solution**:
- Use a high-quality image with good lighting
- Ensure the face is clearly visible and front-facing
- Avoid images with multiple faces or obscured faces

### Network Timeout
**Cause**: Slow internet connection or large image file
**Solution**:
- Use smaller images (under 2MB)
- Check your internet connection
- The app now has a 45-second timeout (increased from 30 seconds)

### Unsupported Image Format
**Cause**: Using an unsupported file type
**Solution**:
- Use JPG, PNG, or BMP files only
- Convert your image to a supported format

## 🌍 Pakistani Users Specific Notes

- **API Endpoint**: Using `https://api-us.faceplusplus.com` for international access
- **Currency**: Face++ offers competitive pricing for international users
- **Support**: English support is available for troubleshooting

## 🛠️ Troubleshooting Steps

1. **Check Console Logs**: Enable debug mode in `.env` to see detailed logs
2. **Test API Connection**: The app now includes a connection test function
3. **Use Demo Data**: When API fails, you can test with demo data
4. **Validate Images**: The app validates file types and sizes before upload

## 📱 Features

- ✅ Real-time image analysis
- ✅ Face detection and attribute extraction
- ✅ Emotion analysis
- ✅ Beauty scoring
- ✅ Skin status analysis
- ✅ Hair color detection
- ✅ Enhanced error handling
- ✅ Demo data mode for testing
- ✅ File validation
- ✅ Progress indicators

## 🔒 Privacy & Security

- Images are processed securely through Face++ API
- No images are stored locally or on our servers
- All processing happens in real-time via API calls

## 📞 Support

If you continue to experience issues:
1. Check the browser console for detailed error messages
2. Verify your Face++ account status and credits
3. Try with the demo data to isolate API vs. code issues
4. Contact Face++ support for API-specific issues
