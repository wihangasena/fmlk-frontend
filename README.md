# FMLK - Fashion Market LK Website Clone

A fully responsive e-commerce website clone of fmlk.lk,featuring a modern design for a Sri Lankan fashion retaler

## 📋 Overview

This is a complete static website clone that includes all major pages and functionality of the original FMLK fashion website. The site showcases sarees, dresses, tops, and other fashion items with a clean, professional design

## 🌟 Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile device
- **Product Categories**: Sarees, Dresses, and Tops collections
- **Interactive Elements**: 
  - Hero slider with automatic rotation
  - Product filtering system
  - FAQ accordion
  - Mobile-friendly navigation menu
- **Multiple Pages**:
  - Home page with featured products
  - Category pages (Sarees, Dresses, Tops)
  - Product detail pages
  - About Us
  - Contact Us with form
  - Shopping Cart
  - Login/Register
  - Blog
  - FAQs
  - Size Guide
  - Delivery Policy
  - Return & Exchange Policy
  - Terms & Conditions
  - Store Location

## 📁 Project Structure

```
fmlk/
├── index.html              # Home page
├── styles/
│   ├── main.css           # Main stylesheet
│   └── pages.css          # Additional page styles
├── scripts/
│   ├── main.js            # Main JavaScript functionality
│   └── filter.js          # Product filtering logic
└── pages/
    ├── sarees.html        # Sarees collection
    ├── dresses.html       # Dresses collection
    ├── tops.html          # Tops collection
    ├── about.html         # About page
    ├── contact.html       # Contact page
    ├── cart.html          # Shopping cart
    ├── login.html         # Login page
    ├── blog.html          # Blog listing
    ├── faqs.html          # FAQs with accordion
    ├── size-guide.html    # Size charts
    ├── delivery.html      # Delivery information
    ├── returns.html       # Return policy
    ├── terms.html         # Terms & conditions
    ├── store.html         # Store location
    └── product-detail.html # Product details
```

## 🚀 Getting Started

1. **Open the website**:
   - Simply open `index.html` in any modern web browser
   - Or use a local server for better experience

2. **Using a local server** (optional but recommended):
   ```powershell
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```
   Then navigate to `http://localhost:8000`

## 🎨 Customization

### Colors
Edit CSS variables in `styles/main.css`:
```css
:root {
    --primary-color: #000000;
    --secondary-color: #ffffff;
    --accent-color: #e74c3c;
    --text-color: #333333;
    --light-bg: #f8f8f8;
}
```

### Images
Replace placeholder images with actual product images:
- Product images are currently using placeholder.com
- Replace with real product images in the HTML files
- Recommended image sizes:
  - Product cards: 400x600px
  - Hero slider: 1920x500px
  - Blog images: 400x250px

### Content
- Update text content in HTML files
- Modify product information in category pages
- Update contact details in `contact.html` and footer sections

## 🔧 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript**: Vanilla JS for interactivity
- **Font Awesome 6**: Icon library
- **Google Fonts**: Typography (can be added)

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## ✨ Key Features Implemented

1. **Hero Slider**: Auto-rotating banner with manual controls
2. **Product Grid**: Responsive product card layout
3. **Filter System**: Category-based product filtering
4. **FAQ Accordion**: Expandable question/answer sections
5. **Mobile Menu**: Hamburger menu for mobile devices
6. **Newsletter Form**: Email subscription in footer
7. **Cart Functionality**: Basic cart operations (demo)
8. **Form Validation**: Contact and login forms

## 🔗 External Dependencies

- Font Awesome 6.0.0 (CDN)
- All other resources are self-contained

## 📝 Notes

- This is a static website clone for demonstration purposes
- Shopping cart and payment functionality are simulated
- Backend integration would be required for full e-commerce functionality
- Images are placeholders and should be replaced with actual product images
- Forms currently show alerts; integrate with backend for real functionality

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

This is a clone project for educational/demonstration purposes.

## 👤 Contact

For questions or support, refer to the contact page in the website.

---

**Built with ❤️ for Fashion Market LK**
