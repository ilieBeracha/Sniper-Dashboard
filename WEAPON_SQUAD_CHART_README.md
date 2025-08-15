# Weapon Squad Performance Chart Component

## Overview

The `ChartUserScoresByWeaponSquad` component provides a comprehensive view of how individual users' presence correlates with squad performance when using specific weapons. It helps identify which users lift squad results with certain weapons by analyzing hit ratios, session counts, and other performance metrics.

## Features

- **Weapon Filtering**: Dropdown to select from available weapons
- **Performance Visualization**: Horizontal bar chart showing hit ratios by user
- **Detailed Data Table**: Comprehensive performance metrics for each user
- **Interactive Elements**: Clickable bars for drilldown functionality
- **Responsive Design**: Works on both desktop and mobile devices
- **Dark Mode Support**: Automatically adapts to theme changes
- **Mock Mode**: Built-in testing mode when Supabase is unavailable

## Data Source

The component uses the Supabase RPC function:
```sql
get_users_squad_totals_by_weapon(p_weapon_id uuid)
```

Returns performance data including:
- User and squad identification
- Session counts and shot statistics
- Hit ratios and target counts
- Squad composition metrics

## Component Props

```tsx
interface WeaponSquadTotalsChartProps {
  supabase?: SupabaseClient | null;  // Supabase client instance
  onUserSelected?: (userId: string) => void;  // Callback for user selection
}
```

## Usage Example

```tsx
import { ChartUserScoresByWeaponSquad } from './ChartUserScoresByWeaponSquad';
import { supabase } from '@/services/supabaseClient';

function PerformancePage() {
  const handleUserSelected = (userId: string) => {
    // Navigate to user detail page
    router.push(`/users/${userId}`);
    
    // Or open drilldown panel
    setSelectedUserId(userId);
    setDrilldownOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <ChartUserScoresByWeaponSquad 
        supabase={supabase} 
        onUserSelected={handleUserSelected} 
      />
    </div>
  );
}
```

## Environment Variables

Required environment variables:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Requirements

### Tables
- `weapons`: Weapon inventory with types and serial numbers
- `users`: User profiles with names and squad assignments
- RPC function: `get_users_squad_totals_by_weapon`

### RPC Function Schema
```sql
CREATE OR REPLACE FUNCTION get_users_squad_totals_by_weapon(p_weapon_id uuid)
RETURNS TABLE (
  user_id uuid,
  squad_id uuid,
  sessions_count integer,
  total_shots integer,
  total_hits integer,
  hit_ratio numeric,
  users_count integer,
  targets_count integer
)
```

## Performance Considerations

- **Data Fetching**: Weapons are loaded once on component mount
- **User Lookups**: User names are fetched individually to handle missing data gracefully
- **Sorting**: Data is sorted by hit ratio (descending) for optimal visualization
- **Caching**: Consider implementing React Query or SWR for production use

## Error Handling

The component gracefully handles:
- Missing Supabase client (shows helpful message with mock mode option)
- Network errors during data fetching
- Missing user data (falls back to short UUIDs)
- Empty data sets (shows appropriate empty state)

## Styling

- Uses Tailwind CSS utility classes
- Responsive design with mobile-first approach
- Dark mode support through CSS variables
- Consistent with the project's design system

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly tooltips

## Testing

### Mock Mode
When `supabase` is not provided, the component automatically switches to mock mode:
- Shows sample weapon data
- Displays mock performance metrics
- Useful for development and testing

### Test Data
Mock data includes realistic performance scenarios:
- Multiple users with varying hit ratios
- Different session counts and shot totals
- Realistic squad sizes and target counts

## Future Enhancements

Potential improvements:
- **Date Range Filtering**: Filter by specific time periods
- **Squad Comparison**: Compare performance across different squads
- **Trend Analysis**: Show performance changes over time
- **Export Functionality**: Download data as CSV/PDF
- **Advanced Filtering**: Filter by weather, distance, or other factors

## Troubleshooting

### Common Issues

1. **No weapons loading**: Check database permissions and weapon table structure
2. **RPC function errors**: Verify function exists and has correct parameters
3. **User names not showing**: Check user table permissions and data integrity
4. **Chart not rendering**: Ensure Recharts library is properly installed

### Debug Mode
Enable console logging by checking browser developer tools for:
- API call responses
- Data transformation steps
- Error messages and stack traces

## Dependencies

- React 18+
- Recharts (for chart visualization)
- Tailwind CSS (for styling)
- Supabase JS client (for data fetching)

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)
- Requires ES2020+ support for optional chaining and nullish coalescing
