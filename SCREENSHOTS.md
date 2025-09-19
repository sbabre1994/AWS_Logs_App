# Sample Screenshots and UI Mockups

This document contains sample screenshots and descriptions of the AWS CloudWatch Log Management Application UI.

## Application Screenshots

### 1. Error State (Backend Not Running)
![Error State](https://github.com/user-attachments/assets/f7f6d19d-f156-4718-982a-36138ebf0ea5)

This shows the application's error handling when the backend API is not available. The application displays a clear, user-friendly error message instructing users to check their AWS configuration and ensure the backend is running.

### 2. Main Application Interface (with data)

When properly configured with AWS credentials and a running backend, the application provides:

#### Instance Selection
- Dropdown menu showing all available EC2 instances
- Instance status indicators (🟢 Running, 🔴 Stopped, 🟡 Pending, ⚪ Other)
- Detailed instance information including:
  - Instance ID and Name
  - Instance Type
  - State and Launch Time
  - Private and Public IP addresses

#### Log Controls Panel
- **Date/Time Filters**: Start and end time selection with datetime pickers
- **Log Level Filter**: Dropdown for DEBUG, INFO, WARN, ERROR, FATAL levels
- **Search Keywords**: Text input for searching within log messages
- **Page Size**: Configurable number of logs to display (10-1000)
- **Auto-refresh**: Toggle between Manual and Live modes with configurable intervals
- **Action Buttons**:
  - 🔄 Refresh: Manual log refresh
  - 🗑️ Clear Filters: Reset all filters
  - 💾 Export buttons: Download logs in CSV, JSON, or TXT formats

#### Log Display
The application provides two view modes:

**Card View** (Default):
- Each log entry displayed as an expandable card
- Color-coded log levels with emoji indicators:
  - ❌ ERROR (Red)
  - ⚠️ WARN (Orange) 
  - ℹ️ INFO (Blue)
  - 🐛 DEBUG (Purple)
  - 💀 FATAL (Red)
- Expandable details showing:
  - Full log message with syntax highlighting
  - Timestamp and ingestion time
  - Log group and stream information
  - Additional metadata (if available)

**Table View**:
- Compact tabular display for viewing many logs
- Sortable columns: Level, Timestamp, Source, Message, Actions
- Quick "View" button to expand individual log details

#### Features Demonstrated:
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Spinner and "Loading AWS Resources..." message
- **Error Handling**: Clear error messages for various failure scenarios
- **Real-time Updates**: Live mode with automatic refresh indicators
- **Professional Styling**: Clean, modern interface using Chakra UI
- **Accessibility**: Emoji icons, clear contrast, keyboard navigation support

### 3. Mobile Responsive View
The application is fully responsive and adapts to smaller screens:
- Stacked layout on mobile devices
- Touch-friendly controls
- Readable text sizes
- Collapsible sections for better space utilization

### 4. Live Mode Indicator
When auto-refresh is enabled:
- "Live Mode" badge displayed prominently
- Refresh interval controls
- Visual indicators during refresh operations

## Technical Implementation

The UI is built using:
- **React 18** with TypeScript for type safety
- **Chakra UI v2** for consistent, accessible components
- **TanStack Query** for efficient API state management
- **Date-fns** for date formatting and manipulation
- **Axios** for HTTP requests
- **Responsive design** principles for mobile compatibility

The application demonstrates modern web development practices with a focus on user experience, accessibility, and maintainability.