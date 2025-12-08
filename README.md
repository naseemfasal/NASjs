# NASjs

> Modern DatePicker (jQuery UI Alternative), TimePicker, Event Calendar, Image Gallery, Modal & Confirmation Popup (SweetAlert Alternative) - Zero Dependencies, Lightweight UI Components

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.2.0-green.svg)]()
[![Size](https://img.shields.io/badge/gzip-~8KB-orange.svg)]()
[![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)]()
[![GitHub stars](https://img.shields.io/github/stars/naseemfasal/NASjs?style=social)](https://github.com/naseemfasal/NASjs/stargazers)

[Live Demo & Documentation](https://naseemfasal.github.io/NASjs/) | [GitHub](https://github.com/naseemfasal/NASjs) | [npm](https://www.npmjs.com/package/nasjs)

---

## Why NASjs?

- **jQuery UI DatePicker Alternative** - Modern, lightweight datepicker without jQuery dependency
- **SweetAlert Alternative** - Beautiful confirmation dialogs without the bloat
- **Zero Dependencies** - Pure vanilla JavaScript, no jQuery or frameworks required
- **Lightweight** - Only ~8KB gzipped, perfect for performance
- **Framework Agnostic** - Works with React, Vue, Angular, or plain HTML
- **Modern Design** - Beautiful, clean UI with smooth animations
- **Dark Mode** - Automatic dark mode support based on system preferences
- **Fully Accessible** - Keyboard navigation, ARIA labels, screen reader support

---

## Components

| Component | Description |
|-----------|-------------|
| **DatePicker** | Modern date selection with min/max dates, disabled days, available dates from API |
| **TimePicker** | Time selection with 12/24 hour format and customizable intervals |
| **Event Calendar** | Full calendar view with events, popups, and API integration |
| **Image Gallery** | Lightbox gallery with thumbnails, zoom, and keyboard navigation |
| **Modal** | Customizable modal dialogs with animations |
| **Confirm** | SweetAlert-style confirmation dialogs |
| **Live Clock** | Real-time clock display |

---

## Installation

### NPM

```bash
npm install nasjs
```

### Yarn

```bash
yarn add nasjs
```

### CDN (jsDelivr - Recommended)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nasjs@1.2.0/dist/nasjs.min.css">
<script src="https://cdn.jsdelivr.net/npm/nasjs@1.2.0/dist/nasjs.min.js"></script>
```

### CDN (GitHub Pages)

```html
<link rel="stylesheet" href="https://naseemfasal.github.io/NASjs/dist/nasjs.min.css">
<script src="https://naseemfasal.github.io/NASjs/dist/nasjs.min.js"></script>
```

---

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nasjs@1.2.0/dist/nasjs.min.css">
</head>
<body>
  <input type="text" class="datepicker" placeholder="Select date">

  <script src="https://cdn.jsdelivr.net/npm/nasjs@1.2.0/dist/nasjs.min.js"></script>
  <script>
    NASjs.datePicker({ selector: '.datepicker' });
  </script>
</body>
</html>
```

---

## 1. DatePicker - Modern jQuery UI Alternative

A beautiful, lightweight datepicker with advanced features.

### Basic Usage

```javascript
NASjs.datePicker({
  selector: '.datepicker-input',
  format: 'YYYY-MM-DD',
  onSelect: (date, input) => {
    console.log('Selected:', date);
  }
});
```

### Block Past Dates (Booking Systems)

```javascript
NASjs.datePicker({
  selector: '.booking-date',
  blockPastDates: true,  // Only future dates available
  format: 'YYYY-MM-DD'
});
```

### Block Future Dates (Historical Data)

```javascript
NASjs.datePicker({
  selector: '.history-date',
  blockFutureDates: true,  // Only past dates available
  format: 'YYYY-MM-DD'
});
```

### Date Range (Next 30 Days)

```javascript
NASjs.datePicker({
  selector: '.appointment-date',
  minDate: '+0',    // Today
  maxDate: '+30',   // 30 days from today
  format: 'YYYY-MM-DD'
});
```

### Disable Weekends (Business Days Only)

```javascript
NASjs.datePicker({
  selector: '.business-date',
  blockPastDates: true,
  disabledDaysOfWeek: [0, 6],  // Sunday=0, Saturday=6
  format: 'YYYY-MM-DD'
});
```

### Disable Specific Dates (Holidays)

```javascript
NASjs.datePicker({
  selector: '.holiday-aware-date',
  disabledDates: [
    '2024-12-25',  // Christmas
    '2024-12-31',  // New Year's Eve
    '2025-01-01'   // New Year's Day
  ],
  format: 'YYYY-MM-DD'
});
```

### Available Dates Only (Hotel Booking)

```javascript
// Hardcoded available dates
NASjs.datePicker({
  selector: '.room-availability',
  availableDates: [
    '2024-12-20', '2024-12-21', '2024-12-22',
    '2024-12-27', '2024-12-28', '2024-12-29'
  ],
  format: 'YYYY-MM-DD'
});

// Load from API
NASjs.datePicker({
  selector: '.room-availability',
  availableDatesUrl: '/api/available-dates',
  format: 'YYYY-MM-DD'
});
```

### DatePicker Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `selector` | string | `'.datepicker-input'` | CSS selector for inputs |
| `format` | string | `'YYYY-MM-DD'` | Date format (YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY) |
| `minDate` | string/Date | `null` | Minimum date: '2024-01-01', '+0', '-30' |
| `maxDate` | string/Date | `null` | Maximum date: '2024-12-31', '+365' |
| `blockPastDates` | boolean | `false` | Block all dates before today |
| `blockFutureDates` | boolean | `false` | Block all dates after today |
| `availableDates` | array | `null` | Only these dates are selectable |
| `availableDatesUrl` | string | `null` | API URL to fetch available dates |
| `disabledDates` | array | `[]` | Specific dates to disable |
| `disabledDaysOfWeek` | array | `[]` | Days to disable [0-6] (0=Sunday) |
| `readonly` | boolean | `true` | Prevent manual typing |
| `onSelect` | function | `null` | Callback: `(date, input) => {}` |
| `onDateCheck` | function | `null` | Custom validation: `(date) => boolean` |

---

## 2. TimePicker

Simple, elegant time selection.

### Basic Usage

```javascript
NASjs.timePicker({
  selector: '.timepicker-input',
  format: '12',     // '12' or '24' hour format
  interval: 30,     // Minutes between options
  onSelect: (time, input) => {
    console.log('Selected:', time);
  }
});
```

### TimePicker Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `selector` | string | `'.timepicker-input'` | CSS selector |
| `format` | string | `'12'` | Time format: '12' or '24' |
| `interval` | number | `30` | Minutes: 15, 30, 60, 120 |
| `onSelect` | function | `null` | Callback when time selected |

---

## 3. Event Calendar

Full-featured calendar with event display.

### Basic Usage

```javascript
const calendar = NASjs.eventCalendar({
  selector: '#my-calendar',
  events: [
    {
      id: 1,
      title: 'Team Meeting',
      date: '2024-12-15',
      description: 'Weekly sync',
      color: '#3b82f6'
    },
    {
      id: 2,
      title: 'Product Launch',
      date: '2024-12-20',
      description: 'New feature release',
      color: '#10b981'
    }
  ]
});
```

### Load Events from API

```javascript
NASjs.eventCalendar({
  selector: '#calendar',
  eventsUrl: '/api/events',  // Returns JSON array of events
  onEventClick: (event, element) => {
    console.log('Event clicked:', event);
  },
  onDateClick: (date, events) => {
    console.log('Date clicked:', date, events);
  }
});
```

### Custom Popup Fields

```javascript
NASjs.eventCalendar({
  selector: '#calendar',
  events: myEvents,
  popupFields: [
    { key: 'title', label: 'Event' },
    { key: 'date', label: 'Date' },
    { key: 'location', label: 'Location' },
    { key: 'attendees', label: 'Attendees' }
  ]
});
```

### Custom Popup Renderer

```javascript
NASjs.eventCalendar({
  selector: '#calendar',
  events: myEvents,
  renderEventPopup: (event) => {
    return `
      <div class="my-custom-popup">
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <button onclick="editEvent(${event.id})">Edit</button>
      </div>
    `;
  }
});
```

### Event Calendar API JSON Format

```json
{
  "events": [
    {
      "id": 1,
      "title": "Meeting",
      "date": "2024-12-15",
      "description": "Team sync",
      "color": "#3b82f6"
    }
  ]
}
```

### Event Calendar Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `selector` | string | `'#calendar'` | Container selector |
| `events` | array | `[]` | Array of event objects |
| `eventsUrl` | string | `null` | API URL to fetch events |
| `dateField` | string | `'date'` | Event date field name |
| `titleField` | string | `'title'` | Event title field name |
| `descriptionField` | string | `'description'` | Event description field |
| `colorField` | string | `'color'` | Event color field |
| `defaultColor` | string | `'#3b82f6'` | Default event color |
| `maxEventsPerDay` | number | `3` | Max events shown per cell |
| `onEventClick` | function | `null` | Event click callback |
| `onDateClick` | function | `null` | Date click callback |
| `onMonthChange` | function | `null` | Month navigation callback |
| `popupFields` | array | `null` | Custom popup fields |
| `renderEventPopup` | function | `null` | Custom popup renderer |

### Calendar Methods

```javascript
const calendar = NASjs.eventCalendar({ ... });

// Add event
calendar.addEvent({ id: 3, title: 'New Event', date: '2024-12-25' });

// Remove event
calendar.removeEvent(3);

// Set all events
calendar.setEvents(newEventsArray);

// Refresh from API
await calendar.refreshEvents();

// Navigate to date
calendar.goToDate('2024-06-01');

// Go to today
calendar.goToToday();
```

---

## 4. Image Gallery - Modern Lightbox

Beautiful image gallery with thumbnails and zoom.

### Basic Usage

```html
<!-- Add data-nasjs-gallery attribute to images -->
<img src="thumb1.jpg"
     data-nasjs-gallery
     data-image-url="full1.jpg"
     data-title="Beautiful Sunset"
     data-description="Captured at the beach">

<img src="thumb2.jpg"
     data-nasjs-gallery
     data-image-url="full2.jpg"
     data-title="Mountain View">

<script>
  NASjs.imageGallery();
</script>
```

### Grouped Galleries

```html
<!-- Gallery 1 -->
<img src="nature1.jpg" data-nasjs-gallery data-gallery="nature" data-image-url="nature1-full.jpg">
<img src="nature2.jpg" data-nasjs-gallery data-gallery="nature" data-image-url="nature2-full.jpg">

<!-- Gallery 2 -->
<img src="city1.jpg" data-nasjs-gallery data-gallery="city" data-image-url="city1-full.jpg">
<img src="city2.jpg" data-nasjs-gallery data-gallery="city" data-image-url="city2-full.jpg">

<script>
  NASjs.imageGallery();
</script>
```

### Image Gallery Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `selector` | string | `'[data-nasjs-gallery]'` | Image selector |
| `enableZoom` | boolean | `true` | Enable zoom on click |
| `zoomLevel` | number | `2` | Zoom magnification level |
| `enableKeyboard` | boolean | `true` | Arrow keys navigation |
| `showThumbnails` | boolean | `true` | Show thumbnail strip |
| `showCounter` | boolean | `true` | Show image counter |
| `closeOnBackdrop` | boolean | `true` | Close on backdrop click |
| `onOpen` | function | `null` | Gallery open callback |
| `onClose` | function | `null` | Gallery close callback |
| `onChange` | function | `null` | Image change callback |

### Image Data Attributes

| Attribute | Description |
|-----------|-------------|
| `data-nasjs-gallery` | Enable gallery for this image |
| `data-gallery` | Group name for multiple galleries |
| `data-image-url` | Full-size image URL |
| `data-title` | Image title |
| `data-description` | Image description |

---

## 5. Modal - Customizable Dialogs

```javascript
const modal = NASjs.modal({
  title: 'Welcome!',
  content: '<p>This is a modal popup with custom content.</p>',
  buttons: [
    {
      text: 'Cancel',
      class: 'nasjs-modal-btn-secondary',
      onClick: () => console.log('Cancelled')
    },
    {
      text: 'Confirm',
      class: 'nasjs-modal-btn-primary',
      onClick: () => console.log('Confirmed')
    }
  ],
  closeOnBackdrop: true,
  closeOnEscape: true,
  onOpen: () => console.log('Modal opened'),
  onClose: () => console.log('Modal closed')
});

// Close programmatically
modal.close();
```

### Modal Button Classes

- `nasjs-modal-btn-primary` - Blue primary button
- `nasjs-modal-btn-secondary` - Gray secondary button
- `nasjs-modal-btn-danger` - Red danger button

---

## 6. Confirm - SweetAlert Alternative

Beautiful confirmation dialogs without dependencies.

```javascript
NASjs.confirm({
  title: 'Delete Item?',
  message: 'This action cannot be undone. Are you sure?',
  confirmText: 'Yes, Delete',
  cancelText: 'Cancel',
  onConfirm: () => {
    // Delete the item
    console.log('Item deleted');
  },
  onCancel: () => {
    console.log('Cancelled');
  }
});
```

### Confirm Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | string | `'Confirm'` | Dialog title |
| `message` | string | `'Are you sure?'` | Confirmation message |
| `confirmText` | string | `'Yes'` | Confirm button text |
| `cancelText` | string | `'No'` | Cancel button text |
| `onConfirm` | function | `null` | Confirm callback |
| `onCancel` | function | `null` | Cancel callback |

---

## 7. Live Clock

```javascript
const clock = NASjs.liveClock('#clock-container', {
  format: '12',        // '12' or '24'
  showSeconds: true,
  showDate: true
});

// Control the clock
clock.stop();
clock.start();
```

---

## Dark Mode

NASjs automatically supports dark mode based on system preferences. No configuration needed!

```css
/* Customize dark mode colors */
@media (prefers-color-scheme: dark) {
  .nasjs-datepicker {
    --nasjs-bg: #1f2937;
    --nasjs-text: #f9fafb;
  }
}
```

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

---

## Accessibility

- Full keyboard navigation (Tab, Enter, Escape, Arrow keys)
- ARIA labels and roles
- Screen reader friendly
- Focus management

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

**Developed by Naseem Fasal Palappetty**

- GitHub: [@naseemfasal](https://github.com/naseemfasal)
- Demo: [https://naseemfasal.github.io/NASjs/](https://naseemfasal.github.io/NASjs/)

---

## Support

- Issues: [GitHub Issues](https://github.com/naseemfasal/NASjs/issues)
- Documentation: [Live Demo](https://naseemfasal.github.io/NASjs/)

---

**Made with care for developers who want beautiful UI without the bloat.**
