# Artwork Selection Table

A React component that displays artwork data from the Art Institute of Chicago API with advanced selection capabilities.

## Features

- **Data Table**: Displays artwork information in a paginated table format
- **Multi-Row Selection**: Select individual rows using checkboxes
- **Bulk Selection**: Select multiple rows across all pages using the custom selection tool
- **Persistent Storage**: Selected artworks are saved to localStorage and persist across page refreshes
- **Responsive Design**: Clean, professional UI with proper spacing and styling

## Data Columns

The table displays the following artwork information:

- **TITLE**: Name of the artwork
- **PLACE OF ORIGIN**: Where the artwork was created
- **ARTIST**: Artist name and details
- **INSCRIPTIONS**: Any inscriptions on the artwork
- **START DATE**: Creation start date
- **END DATE**: Creation end date

## Selection Features

### Individual Selection
- Click checkboxes next to each row to select/deselect individual artworks
- Selected rows are highlighted and tracked in real-time

### Bulk Selection
Click the dropdown arrow next to the selection counter to access bulk selection options:

1. Enter the number of rows you want to select
2. Click "Select" to automatically select that many artworks across all pages
3. The system will start from page 1 and select available artworks sequentially
4. Duplicates are automatically avoided

## Technical Details

### Built With
- React 18 with TypeScript
- PrimeReact UI components
- Art Institute of Chicago API
- CSS3 for styling

### Key Components
- `DataTable` - Main table component with pagination
- `OverlayPanel` - Custom selection interface
- `InputNumber` - Number input for bulk selection
- LocalStorage integration for data persistence

### API Integration
Fetches data from: `https://api.artic.edu/api/v1/artworks`
- Paginated responses (12 items per page)
- Lazy loading for better performance
- Error handling for failed requests

## Usage

1. The table loads automatically with the first page of artwork data
2. Use the pagination controls to navigate between pages
3. Select individual rows using checkboxes
4. For bulk operations, use the custom selection panel
5. All selections are automatically saved

## Selection Logic

- Selected items are stored in application state and localStorage
- Bulk selection starts from the beginning of the dataset
- The system ensures no duplicate selections
- If fewer artworks are available than requested, users are notified

## Error Handling

- Network request failures are caught and logged
- Invalid bulk selection numbers show user-friendly alerts
- Missing data fields display "N/A" instead of breaking the UI

## Styling

The component uses a custom CSS file (`Table.css`) that provides:
- Clean table layout with grid lines
- Professional pagination styling
- Responsive design for different screen sizes
- Consistent color scheme and spacing
