# AI Integration with AIML API

This Excel Dashboard now includes intelligent AI/ML analysis powered by the AIML API to provide enhanced insights for your dashboard widgets.

## Features

### 🤖 AI-Powered Data Analysis
- **Dynamic Widget Generation**: AI analyzes your data and creates appropriate widgets based on actual content
- **Intelligent Column Detection**: Automatically identifies data types and creates relevant metrics
- **Smart Trend Analysis**: Provides intelligent trend calculations and insights
- **Enhanced Widget Data**: Updates dashboard widgets with AI-generated insights
- **Fallback Analysis**: Works even when AI is unavailable with intelligent fallback logic

### 📊 Dynamic Dashboard Widgets
The AI system now generates widgets based on your actual data content:

#### Widget Types Generated:
1. **KPI Widgets**: 
   - Total values from numeric columns
   - Unique counts from categorical columns
   - Averages and other calculated metrics

2. **Chart Widgets**:
   - Bar charts for categorical vs numeric data
   - Pie charts for distribution analysis
   - Line charts for time series data

3. **Table Widgets**:
   - Complete data table views
   - Filtered data displays

#### Example Widget Names:
- If your data has "Amount" column → "Total Amount" widget
- If your data has "Customer" column → "Unique Customers" widget  
- If your data has "Product" column → "Total Products" widget
- If your data has "Sales" column → "Total Sales" widget

The AI analyzes your actual data and creates widget names that match your content, not generic names.

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
- The AI will analyze your data and create appropriate widgets
- Analysis results are automatically applied to dashboard widgets

### 3. View AI Insights
- Navigate to the dashboard to see AI-generated widgets
- Widget names and types are based on your actual data
- AI insights are displayed with source information

### 4. Widget Recommendations
- The AI provides widget recommendations based on data analysis
- Each recommendation includes:
  - Widget name based on data content
  - Widget type (KPI, chart, table)
  - Description of what the widget shows
  - Source columns used
  - Calculation method
  - Priority level

## How It Works

### 1. Data Analysis
The AI analyzes your Excel data to understand:
- Column types (numeric, categorical, date)
- Data relationships
- Business context
- Data quality and completeness

### 2. Widget Generation
Based on the analysis, the AI creates:
- **KPI widgets** for important metrics
- **Chart widgets** for data visualization
- **Table widgets** for detailed data views

### 3. Insight Generation
For each widget, the AI provides:
- Current values
- Trend analysis
- Source column information
- Calculation methods

### 4. Dynamic Naming
Widget names are generated based on your actual data:
- "Total Sales" if you have sales data
- "Unique Customers" if you have customer data
- "Product Count" if you have product data
- etc.

## Benefits

✅ **Accurate Widget Names**: Widgets are named based on your actual data content
✅ **Relevant Metrics**: Only shows metrics that make sense for your data
✅ **Dynamic Generation**: No more generic "Total Sales" for non-sales data
✅ **Intelligent Analysis**: AI understands your data context
✅ **Scalable**: Works with any type of Excel data 
