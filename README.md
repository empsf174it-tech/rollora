# Rollora - Massage Foam Rollers

Rollora is a dedicated web application for Massage Foam Rollers (Nutrition & Recovery), featuring responsive UI, user authentication, interactive workflow features, and admin management controls. 

## Features
- **Interactive Shop**: Browse and filter a selection of foam rollers.
- **Body-Area Selector**: Choose a body area to get customized roller recommendations and routines.
- **Density Guide**: Find the right roller density for your needs.
- **Technique Guides**: Step-by-step instructions for effective rolling.
- **Routine Timer**: Custom and preset timers for your recovery routines.
- **Admin Dashboard**: Manage products, guides, routines, and orders.

## Demo Information
**IMPORTANT**: This is a demo application.
- All products, prices, stock, reviews, and routine timings are placeholder demo data.
- The authentication is client-side only (using `localStorage`). Never store real passwords here.
- To access the Admin Dashboard, log in with:
  - **Email**: `admin@rollora.demo`
  - **Password**: `any password (min 8 chars)`
- Regular users can be registered via the Register tab.
- This site provides informational content about self-massage tools. It is not medical advice, diagnosis, or treatment.

## Folder Structure
- `index.html`: Main SPA with 12 sections.
- `auth.html`: Authentication page.
- `dashboard.html`: Admin dashboard.
- `assets/css/style.css`: Unified styling using CSS variables.
- `assets/js/*`: Vanilla JS modules for all interactivity.
