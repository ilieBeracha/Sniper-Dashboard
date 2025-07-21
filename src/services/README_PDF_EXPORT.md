# Training PDF Export System

A standalone, professional PDF export service for training session reports. This system works independently from your existing codebase and can be easily integrated anywhere in your application.

## 🎯 Features

- **Professional Design**: Clean, mature, non-colorful statistical layout
- **Comprehensive Reports**: Includes all training data, participants, performance analytics, weapons, equipment
- **Standalone Service**: Works independently, doesn't interfere with existing code
- **TypeScript Support**: Fully typed with proper interfaces
- **Easy Integration**: Simple React hooks and components
- **Error Handling**: Robust error handling with user feedback
- **Multiple Export Options**: Export from existing data or fetch data by ID

## 📋 What's Included in the PDF Report

1. **Title Page**: Session name, date, location, conductor information
2. **Executive Summary**: Key performance indicators and overview
3. **Training Details**: Session information and assignments
4. **Participants Overview**: List of participants with roles and statistics
5. **Performance Analytics**: Overall performance metrics and distance-based analysis
6. **Squad Performance**: Individual and squad-level performance analysis
7. **Weapon & Equipment Analysis**: Weapon performance stats and equipment used
8. **Day/Night Performance**: Comparative analysis of day vs night operations
9. **Training Effectiveness**: Analysis of training assignment effectiveness
10. **Recommendations**: AI-generated recommendations based on performance data

## 🚀 Quick Start

### Method 1: Using the React Component (Recommended)

```tsx
import { TrainingPDFExportButton } from '@/components/TrainingPDFExportButton';

// In your training detail component
function TrainingDetailPage({ training, participants, analytics }) {
  return (
    <div>
      {/* Your existing training content */}
      
      {/* Add this button anywhere */}
      <TrainingPDFExportButton
        trainingData={{
          training,
          participants,
          analytics,
          // ... other data you have available
        }}
        variant="primary"
        size="md"
        onExportComplete={() => console.log('PDF exported successfully!')}
      />
    </div>
  );
}
```

### Method 2: Using the React Hook

```tsx
import { useTrainingPDFExport } from '@/hooks/useTrainingPDFExport';

function MyComponent() {
  const { exportTrainingReport, isExporting, exportError } = useTrainingPDFExport();

  const handleExportClick = async () => {
    await exportTrainingReport({
      training: myTrainingData,
      participants: myParticipants,
      analytics: myAnalytics,
      // ... other data
    });
  };

  return (
    <button onClick={handleExportClick} disabled={isExporting}>
      {isExporting ? 'Generating PDF...' : 'Export Report'}
    </button>
  );
}
```

### Method 3: Direct Service Usage

```tsx
import { createTrainingPDFExporter, createTrainingDataAggregator } from '@/services/pdfExportService';

const pdfExporter = createTrainingPDFExporter();
const dataAggregator = createTrainingDataAggregator();

// Prepare your data
const reportData = dataAggregator.aggregateFromExistingData({
  training: myTraining,
  participants: myParticipants,
  analytics: myAnalytics,
});

// Export to PDF
await pdfExporter.exportTrainingReport(reportData);
```

## 🔧 Integration Options

### Option A: With Existing Data

If you already have training data in your component state:

```tsx
<TrainingPDFExportButton
  trainingData={{
    training: currentTraining,
    participants: trainingParticipants,
    analytics: performanceData,
    squadStats: squadPerformanceData,
    weaponStats: weaponUsageData,
    // ... other available data
  }}
/>
```

### Option B: Fetch Data by ID

If you only have a training ID and want to fetch data automatically:

```tsx
<TrainingPDFExportButton
  trainingId="training-123"
/>
```

**Note**: For Option B, you need to implement the API calls in `trainingDataAggregator.ts`

## 🎨 Component Variants

```tsx
// Primary button (default)
<TrainingPDFExportButton variant="primary" />

// Secondary button
<TrainingPDFExportButton variant="secondary" />

// Outline button
<TrainingPDFExportButton variant="outline" />

// Ghost button
<TrainingPDFExportButton variant="ghost" />

// Different sizes
<TrainingPDFExportButton size="sm" />   // Small
<TrainingPDFExportButton size="md" />   // Medium (default)
<TrainingPDFExportButton size="lg" />   // Large

// Preset components
<CompactExportButton trainingData={data} />
<PrimaryExportButton trainingData={data} />
<SecondaryExportButton trainingData={data} />
<OutlineExportButton trainingData={data} />
```

## 🔌 API Integration

To connect the system with your existing API, edit `src/services/trainingDataAggregator.ts`:

```typescript
// Replace the mock implementations with your actual API calls
private async fetchTrainingSession(trainingId: string): Promise<TrainingSession> {
  const response = await api.get(`/training/${trainingId}`);
  return response.data;
}

private async fetchParticipants(trainingId: string): Promise<TrainingParticipant[]> {
  const response = await api.get(`/training/${trainingId}/participants`);
  return response.data;
}

// ... implement other fetch methods
```

## 📊 Data Structure

The system expects data in the following structure:

```typescript
interface TrainingReportData {
  training: TrainingSession;           // Required: Basic training info
  participants: TrainingParticipant[]; // Required: List of participants
  analytics: TrainingTeamAnalytics;    // Required: Performance metrics
  squadStats: SquadStats[];           // Optional: Squad member stats
  weaponStats: WeaponUsageStats[];     // Optional: Weapon performance
  dayNightPerformance: DayNightPerformance[]; // Optional: Day/night analysis
  squadPerformance: SquadPerformance[]; // Optional: Squad-level performance
  trainingEffectiveness: TrainingEffectiveness[]; // Optional: Training effectiveness
  weapons: Weapon[];                   // Optional: Weapons used
  equipment: Equipment[];              // Optional: Equipment used
}
```

## 🎯 Example Usage in Existing Components

### In a Training List Component

```tsx
import { CompactExportButton } from '@/components/TrainingPDFExportButton';

function TrainingListItem({ training }) {
  return (
    <div className="training-item">
      <h3>{training.session_name}</h3>
      <p>{training.date}</p>
      
      <div className="actions">
        <button>View Details</button>
        <CompactExportButton 
          trainingId={training.id}
          buttonText="Export"
        />
      </div>
    </div>
  );
}
```

### In a Training Dashboard

```tsx
import { PrimaryExportButton } from '@/components/TrainingPDFExportButton';

function TrainingDashboard({ currentTraining, analytics, participants }) {
  return (
    <div className="dashboard">
      <div className="header">
        <h1>{currentTraining.session_name}</h1>
        <PrimaryExportButton
          trainingData={{
            training: currentTraining,
            participants,
            analytics,
          }}
          onExportComplete={() => {
            // Show success message
            toast.success('Training report exported successfully!');
          }}
        />
      </div>
      
      {/* Your dashboard content */}
    </div>
  );
}
```

### In a Training Detail Page

```tsx
import { TrainingPDFExportButton } from '@/components/TrainingPDFExportButton';

function TrainingDetailPage() {
  const [training, setTraining] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [participants, setParticipants] = useState([]);

  return (
    <div className="training-detail">
      {/* Your existing content */}
      
      <div className="export-section">
        <h3>Export Report</h3>
        <p>Generate a comprehensive PDF report with all training data and analytics.</p>
        
        <TrainingPDFExportButton
          trainingData={{
            training,
            participants,
            analytics,
            // Add more data as available
          }}
          variant="outline"
          size="lg"
          buttonText="Generate Complete Report"
          className="mt-4"
        />
      </div>
    </div>
  );
}
```

## 🔍 Error Handling

The system includes comprehensive error handling:

```tsx
<TrainingPDFExportButton
  trainingData={data}
  onExportError={(error) => {
    // Handle export errors
    console.error('Export failed:', error);
    showErrorToast(error);
  }}
  onExportStart={() => {
    // Handle export start
    setIsLoading(true);
  }}
  onExportComplete={() => {
    // Handle export completion
    setIsLoading(false);
    showSuccessToast('Report exported successfully!');
  }}
/>
```

## 🎨 Customization

### Custom Styling

```tsx
<TrainingPDFExportButton
  className="my-custom-button-class"
  buttonText="Download Training Report"
  loadingText="Creating PDF Document..."
/>
```

### Custom PDF Styling

Edit `src/services/pdfExportService.ts` to customize the PDF appearance:

```typescript
private styles: PDFStyles = {
  fontSize: {
    title: 24,      // Increase for larger titles
    subtitle: 18,   // Adjust section headers
    heading: 14,    // Adjust subheadings
    body: 11,       // Adjust body text
    small: 9        // Adjust small text
  },
  colors: {
    primary: '#2C3E50',     // Main heading color
    secondary: '#34495E',   // Subheading color
    text: '#2C3E50',        // Body text color
    border: '#BDC3C7',      // Table border color
    background: '#F8F9FA'   // Background color
  },
  // ... other styling options
};
```

## 🚀 Performance Considerations

- **Lazy Loading**: PDF libraries are dynamically imported to avoid increasing bundle size
- **Concurrent Data Fetching**: All data is fetched in parallel for optimal performance
- **Error Boundaries**: Robust error handling prevents crashes
- **Memory Management**: PDF generation is optimized for large datasets

## 🔒 Security Considerations

- All data validation is performed before PDF generation
- No sensitive information is logged or stored
- PDF generation happens client-side for data privacy
- Error messages don't expose sensitive system information

## 📱 Mobile Responsiveness

The export button is fully responsive and works on all device sizes:

```tsx
// Automatically adjusts for mobile
<TrainingPDFExportButton 
  size="sm"           // Use smaller size on mobile
  className="w-full"  // Full width on mobile
/>
```

## 🔧 Troubleshooting

### Common Issues

1. **"jsPDF not found" error**: Make sure you've installed the dependencies
   ```bash
   npm install jspdf jspdf-autotable @types/jspdf
   ```

2. **TypeScript errors**: Ensure all type imports are correct in your tsconfig.json

3. **PDF not downloading**: Check browser settings for file downloads

4. **Missing data in PDF**: Verify your data structure matches the expected interfaces

5. **Performance issues**: Use the `aggregateFromExistingData` method instead of fetching data

### Debug Mode

Enable debug logging by setting `NODE_ENV=development`:

```typescript
const { exportTrainingReport } = useTrainingPDFExport();

// Debug information will be logged to console in development mode
```

## 📚 Additional Resources

- Check the TypeScript interfaces in `/types/` for exact data structures
- See component examples in the `/components/` directory
- Review the service implementation in `/services/` for customization options

---

**Ready to use!** 🎉 Just import the component and start exporting professional training reports!