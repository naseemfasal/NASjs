# NASjs

> Beautiful, lightweight, framework-agnostic UI components for modern web applications

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)]()
[![Size](https://img.shields.io/badge/size-15KB-orange.svg)]()
[![GitHub stars](https://img.shields.io/github/stars/yourusername/nasjs?style=social)](https://github.com/yourusername/nasjs/stargazers)

[Demo](https://yourusername.github.io/nasjs/) | [Documentation](#documentation) | [GitHub](https://github.com/yourusername/nasjs)

## 🌟 Features

- **Zero Dependencies** - Pure vanilla JavaScript, no jQuery or frameworks required
- **Lightweight** - Only 15KB minified, perfect for performance
- **Framework Agnostic** - Works with React, Vue, Angular, or plain HTML
- **Modern Design** - Beautiful, clean UI components with smooth animations
- **Responsive** - Mobile-friendly out of the box
- **Dark Mode** - Automatic dark mode support based on system preferences
- **Accessible** - Keyboard navigation, ARIA labels, and screen reader support
- **Easy to Use** - Simple API, minimal configuration needed

## 📦 Installation

### NPM

```bash
npm install nasjs
```

### Yarn

```bash
yarn add nasjs
```

### CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nasjs/dist/nasjs.min.css">
<script src="https://cdn.jsdelivr.net/npm/nasjs/dist/nasjs.min.js"></script>
```

### Download

Download the latest release from [GitHub Releases](https://github.com/yourusername/nasjs/releases)

## 🚀 Quick Start

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="nasjs.min.css">
</head>
<body>
  <input type="text" class="datepicker-input" placeholder="Select date">
  
  <script src="nasjs.min.js"></script>
  <script>
    // Initialize DatePicker
    NASjs.datePicker();
  </script>
</body>
</html>
```

## 📚 Components

### 1. DatePicker

Beautiful date selection with month/year dropdowns and smart positioning.

#### Basic Usage

```javascript
NASjs.datePicker({
  selector: '.datepicker-input',
  format: 'YYYY-MM-DD',
  onSelect: (date, input) => {
    console.log('Selected:', date);
  }
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selector` | string | `'.datepicker-input'` | CSS selector for input elements |
| `format` | string | `'YYYY-MM-DD'` | Date format (YYYY-MM-DD, DD-MM-YYYY, etc.) |
| `minDate` | string/Date | `null` | Minimum selectable date |
| `maxDate` | string/Date | `null` | Maximum selectable date |
| `onSelect` | function | `null` | Callback when date is selected |

#### Example

```html
<input type="text" class="datepicker-input" placeholder="Pick a date">

<script>
  NASjs.datePicker({
    format: 'DD/MM/YYYY',
    minDate: '2024-01-01',
    maxDate: '2024-12-31',
    onSelect: (date, input) => {
      alert(`Selected: ${input.value}`);
    }
  });
</script>
```

---

### 2. TimePicker

Intuitive time selection with hour/minute controls and AM/PM toggle.

#### Basic Usage

```javascript
NASjs.timePicker({
  selector: '.timepicker-input',
  format: '12', // or '24'
  onSelect: (time, input) => {
    console.log('Selected:', time);
  }
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selector` | string | `'.timepicker-input'` | CSS selector for input elements |
| `format` | string | `'12'` | Time format ('12' or '24') |
| `onSelect` | function | `null` | Callback when time is selected |

#### Example

```html
<input type="text" class="timepicker-input" placeholder="Select time">

<script>
  NASjs.timePicker({
    format: '24',
    onSelect: (time, input) => {
      console.log('Time selected:', time);
    }
  });
</script>
```

---

### 3. Live Clock

Display a live updating clock in any element.

#### Basic Usage

```javascript
const clock = NASjs.liveClock('#clockDiv', {
  format: '12',
  showSeconds: true,
  showDate: false
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | string | `'12'` | Time format ('12' or '24') |
| `showSeconds` | boolean | `true` | Show seconds |
| `showDate` | boolean | `false` | Show date alongside time |

#### Methods

```javascript
// Stop the clock
clock.stop();

// Start the clock again
clock.start();
```

#### Example

```html
<div id="myClock"></div>

<script>
  const clock = NASjs.liveClock('#myClock', {
    format: '12',
    showSeconds: true,
    showDate: true
  });
</script>
```

---

### 4. Modal Popup

Minimal, beautiful modal with backdrop blur and smooth animations.

#### Basic Usage

```javascript
NASjs.modal({
  title: 'Welcome!',
  content: '<p>This is a modal popup.</p>',
  buttons: [
    { 
      text: 'OK', 
      class: 'nasjs-modal-btn-primary',
      onClick: () => console.log('OK clicked')
    }
  ]
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Modal Title'` | Modal title |
| `content` | string | `''` | Modal content (HTML) |
| `buttons` | array | `[...]` | Array of button objects |
| `closeOnBackdrop` | boolean | `true` | Close when clicking backdrop |
| `closeOnEscape` | boolean | `true` | Close when pressing ESC |
| `onOpen` | function | `null` | Callback when modal opens |
| `onClose` | function | `null` | Callback when modal closes |

#### Button Object

```javascript
{
  text: 'Button Text',
  class: 'nasjs-modal-btn-primary', // or 'secondary', 'danger'
  onClick: () => { /* action */ },
  close: true // Close modal after click (default: true)
}
```

#### Example

```html
<button onclick="showModal()">Open Modal</button>

<script>
  function showModal() {
    const modal = NASjs.modal({
      title: 'Confirm Action',
      content: '<p>Are you sure you want to continue?</p>',
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
      onClose: () => console.log('Modal closed')
    });
    
    // Programmatically close the modal
    // modal.close();
  }
</script>
```

---

### 5. Confirmation Dialog

Beautiful confirm dialogs with custom callbacks for Yes/No actions.

#### Basic Usage

```javascript
NASjs.confirm({
  title: 'Delete Item',
  message: 'Are you sure you want to delete this item?',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  onConfirm: () => {
    // Delete action
  },
  onCancel: () => {
    // Cancel action
  }
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Confirm'` | Dialog title |
| `message` | string | `'Are you sure?'` | Confirmation message |
| `confirmText` | string | `'Yes'` | Confirm button text |
| `cancelText` | string | `'No'` | Cancel button text |
| `onConfirm` | function | `null` | Callback when confirmed |
| `onCancel` | function | `null` | Callback when cancelled |

#### Example

```html
<button onclick="deleteItem()">Delete Item</button>

<script>
  function deleteItem() {
    NASjs.confirm({
      title: 'Delete Item',
      message: 'This action cannot be undone. Continue?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        console.log('Item deleted');
        // Perform delete operation
      },
      onCancel: () => {
        console.log('Deletion cancelled');
      }
    });
  }
</script>
```

## 🎨 Customization

### Custom Styling

You can override the default styles by adding your own CSS:

```css
/* Custom DatePicker colors */
.nasjs-dp-selected {
  background: #10b981 !important;
}

/* Custom Modal styling */
.nasjs-modal {
  border-radius: 20px;
}
```

### Dark Mode

NASjs automatically supports dark mode based on system preferences. The dark mode styles are applied automatically when the user's system is set to dark mode.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## 📱 Responsive Design

All components are mobile-friendly and adapt to different screen sizes automatically.

## ♿ Accessibility

- Keyboard navigation support (Tab, Enter, Escape)
- ARIA labels and roles
- Screen reader friendly
- Focus management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for developers
- Inspired by modern UI design trends
- Community driven and open source

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/nasjs/issues)
- 📖 Docs: [Full Documentation](https://yourusername.github.io/nasjs/)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/nasjs/discussions)

## 🗺️ Roadmap

- [ ] Range DatePicker
- [ ] Color Picker
- [ ] Toast Notifications
- [ ] Dropdown Menu
- [ ] Tooltip Component
- [ ] Progress Bar
- [ ] Slider Component

---

**Made with ❤️ by developers, for developers**

[Website](https://yourusername.github.io/nasjs/) • [Documentation](https://yourusername.github.io/nasjs/) • [GitHub](https://github.com/yourusername/nasjs)