# Face++ API 403 Error Debug Guide

## Problem
```
Error: 403 - permission error
Exception: UserAuthError
```

## Step-by-Step Solution

### 1. Check Environment Variables
Verify your `.env` file contains:
```
VITE_FACE_KEY=your_actual_faceplus_api_key
VITE_FACE_SECRET=your_actual_faceplus_api_secret
```

### 2. Get Valid Face++ API Credentials
1. Go to [Face++ Developer Portal](https://www.faceplusplus.com/)
2. Create an account or login
3. Create a new application
4. Copy your API Key and API Secret

### 3. Test API Credentials
Use this test endpoint to verify your credentials:
```bash
curl -X POST "https://api-us.faceplusplus.com/facepp/v3/detect" \
  -F "api_key=YOUR_API_KEY" \
  -F "api_secret=YOUR_API_SECRET" \
  -F "image_url=https://example.com/test.jpg"
```

### 4. Check Account Status
- Ensure your Face++ account is active
- Check if you've exceeded your API quota
- Verify your account has proper permissions

### 5. Update Error Handling
The current error handling doesn't show the actual API response. Update the ImageUpload.js file to display detailed error information.

## Expected Response
A successful response should look like:
```json
{
  "image_id": "abc123...",
  "request_id": "xyz789...",
  "time_used": 123,
  "faces": [...]
}
```

## Next Steps
1. Verify your Face++ API credentials
2. Test the API manually
3. Update the code with better error handling
4. Test the application
