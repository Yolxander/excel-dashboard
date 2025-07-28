# AI Integration with AIML API

This Excel Dashboard now includes intelligent AI/ML analysis powered by the AIML API to provide enhanced insights for your dashboard widgets.

## Features

### 🤖 AI-Powered Data Analysis
- **Intelligent Column Detection**: Automatically identifies sales, revenue, commission, and recruiter data
- **Smart Trend Analysis**: Provides intelligent trend calculations and insights
- **Enhanced Widget Data**: Updates dashboard widgets with AI-generated insights
- **Fallback Analysis**: Works even when AI is unavailable with intelligent fallback logic

### 📊 Enhanced Dashboard Widgets
The following widgets now include AI insights:

1. **Total Sales**
   - AI-identified sales columns
   - Intelligent trend calculations
   - Source column tracking

2. **Active Recruiters**
   - Automatic recruiter identification
   - Unique count analysis
   - Performance tracking

3. **Target Achievement**
   - AI-calculated achievement rates
   - Smart completion detection
   - Method transparency

4. **Average Commission**
   - Intelligent averaging algorithms
   - Per-recruiter calculations
   - Trend analysis

## Configuration

### Environment Variables

Add the following to your `.env` file:

```env
# AIML API Configuration
AIML_API_BASE_URL=https://api.aimlapi.com/v1
AIML_API_KEY=your_aiml_api_key_here
```

### Getting Your AIML API Key

1. Visit [AIML API](https://api.aimlapi.com)
2. Sign up for an account
3. Generate your API key
4. Add it to your `.env` file

## Usage

### 1. Upload and Connect Files
- Upload your Excel files through the upload interface
- Connect files to the dashboard using the "Connect" button

### 2. AI Analysis
- Click the brain icon (🧠) next to any connected file
- The AI will analyze your data and provide insights
- Analysis results are automatically applied to dashboard widgets

### 3. View AI Insights
- Navigate to the dashboard to see AI-enhanced widgets
- AI insights are displayed with source information
- Trend calculations and methods are transparent

## AI Analysis Process

### Data Preparation
1. **Column Analysis**: Identifies numeric vs categorical columns
2. **Data Sampling**: Analyzes sample data for context
3. **Pattern Recognition**: Detects sales, revenue, and performance patterns

### AI Processing
1. **Prompt Engineering**: Creates intelligent analysis prompts
2. **API Integration**: Sends data to AIML API for analysis
3. **Response Parsing**: Extracts structured insights from AI responses
4. **Fallback Logic**: Provides intelligent analysis when AI is unavailable

### Widget Enhancement
1. **Insight Application**: Updates widget configurations with AI insights
2. **Source Tracking**: Records which columns were used for calculations
3. **Method Documentation**: Explains how calculations were performed

## API Endpoints

### Analyze File with AI
```
POST /ai/analyze-file/{fileId}
```

### Get Widget Insights
```
GET /ai/widget-insights/{widgetId}
```

## Error Handling

The system includes robust error handling:

- **API Failures**: Graceful fallback to intelligent analysis
- **Network Issues**: User-friendly error messages
- **Data Issues**: Automatic data validation and cleaning
- **Missing Data**: Intelligent default calculations

## Security

- API keys are stored securely in environment variables
- No sensitive data is logged
- All API calls are made server-side
- User data is protected and not shared with third parties

## Performance

- AI analysis runs asynchronously
- Results are cached in widget configurations
- Fallback analysis ensures dashboard always works
- Minimal impact on dashboard performance

## Troubleshooting

### AI Analysis Not Working
1. Check your AIML API key in `.env`
2. Verify internet connectivity
3. Check server logs for API errors
4. Ensure files are properly processed

### No AI Insights Displayed
1. Verify file is connected to dashboard
2. Check if AI analysis completed successfully
3. Refresh the dashboard page
4. Check browser console for errors

### Fallback Analysis
If AI analysis fails, the system automatically:
- Analyzes data structure
- Identifies relevant columns
- Provides intelligent estimates
- Maintains dashboard functionality

## Future Enhancements

- **Real-time Analysis**: Continuous AI monitoring
- **Custom Models**: User-specific AI training
- **Advanced Insights**: Predictive analytics
- **Export Features**: AI insights export
- **Batch Processing**: Multiple file analysis

## Support

For issues with AI integration:
1. Check the server logs
2. Verify API configuration
3. Test with sample data
4. Contact support with error details 
