# AI-Powered Agricultural Marketplace Platform

A comprehensive platform connecting farmers, buyers, mentors, and agricultural stakeholders through advanced AI features.

## 🚀 Features

### 1. AI Matchmaking Engine
- **Function**: `Run_Matchmaking_Function()`
- **Endpoint**: `/api/Run_AI_Matchmaking`
- Matches buyers with farmers based on quantity, quality, logistics, and certification
- Returns ranked matches with compatibility scores and delivery estimates

### 2. Mentorship Pairing AI
- **Function**: `Assign_Mentor_Function()`
- **Endpoint**: `/api/Assign_Mentor`
- Recommends mentors based on experience, location, forum behavior, and badge history
- Provides compatibility scores and mentor reviews

### 3. Produce Quality Assessment
- **Function**: `Assess_Quality_Function()`
- **Endpoint**: `/api/Assess_Crop_Quality`
- AI-powered image recognition for crop quality grading
- Returns quality grade, confidence score, and market recommendations

### 4. Market Insights & Saturation Analysis
- **Function**: `Generate_Market_Insights_Function()`
- **Endpoint**: `/api/Market_Insights`
- Analyzes market trends and identifies oversupplied crops
- Provides alternative crop recommendations

### 5. AI Chatbot Guidance
- **Function**: `AI_Assistant_Function()`
- **Endpoint**: `/api/AI_Assistant`
- Provides farming tips, mentorship suggestions, and market alerts
- Context-aware responses based on user profile

### 6. Content Moderation
- **Function**: `Moderate_Content_Function()`
- **Endpoint**: `/api/Moderate_Content`
- Automatically flags inappropriate content
- Promotes helpful posts with high engagement

### 7. Smart Notifications
- **Endpoint**: `/api/Notifications`
- Intelligent notification system with customizable preferences
- Triggers based on relevant matches and activities

### 8. Admin Analytics Dashboard
- **Endpoint**: `/api/Analytics`
- Real-time platform health and user behavior insights
- Exportable reports and data visualization

## 🔒 Security Features

- **2FA Authentication**: Mobile or email verification
- **Encrypted Image Uploads**: Secure file handling
- **Location Privacy**: Masked exact location data
- **Role-Based Access Control**: Granular permissions system

## 🛠 Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API Integration**: Fetch API with TypeScript interfaces
- **Authentication**: JWT with 2FA support

## 📱 User Roles

### Farmers
- Access to marketplace, forum, mentorship, quality assessment, chatbot
- Can upload crop images for quality analysis
- Receive buyer match notifications

### Buyers
- Access to marketplace and messaging
- Can post purchase requests
- Receive farmer match notifications

### Mentors/Mentees
- Special badge tracking and review system
- Access to mentorship pairing AI
- Forum participation with enhanced features

### Admins
- Full platform analytics and moderation tools
- Content moderation dashboard
- User management capabilities

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Configure your API endpoints and keys
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📊 API Integration

The platform includes comprehensive API integration with proper error handling and fallback mechanisms. All AI functions are designed to work with real backend services while providing mock data for development.

### Example API Calls

```typescript
// Matchmaking
const matches = await apiService.runMatchmaking({
  buyer_location: "Polokwane, Limpopo",
  commodity: "Oranges",
  quantity: 500,
  frequency: "Weekly",
  certification: "Organic"
});

// Quality Assessment
const assessment = await apiService.assessCropQuality(imageFile, "tomatoes");

// Market Insights
const insights = await apiService.getMarketInsights("Gauteng");
```

## 🎨 Design Philosophy

- **Production-Ready**: Beautiful, modern interface suitable for real-world deployment
- **Responsive Design**: Optimized for desktop and mobile devices
- **Accessibility**: WCAG compliant with proper contrast ratios and keyboard navigation
- **Performance**: Optimized loading states and error handling

## 📈 Analytics & Monitoring

The platform includes comprehensive analytics for:
- User engagement metrics
- Feature usage statistics
- Content moderation effectiveness
- Market trend analysis
- Platform health monitoring

## 🔧 Development

The codebase follows modern React patterns with:
- TypeScript for type safety
- Custom hooks for API integration
- Modular component architecture
- Comprehensive error handling
- Security best practices

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.