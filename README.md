# Fridge Inventory PWA

A local-only Progressive Web App (PWA) for managing your fridge inventory, built with Vite, React, TypeScript, and IndexedDB.

## Features
- **Barcode Scanning**: Scan EAN-13/EAN-8 barcodes using your device's camera.
- **Local Storage**: All data is stored locally in your browser using IndexedDB (no backend required).
- **Offline Capable**: Works offline once installed.
- **Inventory Management**: Track expiration dates, quantities, and units.
- **Expiring Soon**: Filter items expiring within 3 days.

## Getting Started

### Prerequisites
- Node.js installed.

### Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```

3.  Open your browser at the URL shown (usually `http://localhost:5173`).

### Testing on Mobile (Same Network)

1.  Find your computer's local IP address (e.g., `192.168.1.x`).
2.  Run the dev server with host exposed:
    ```bash
    npm run dev -- --host
    ```
3.  On your mobile device, visit `http://YOUR_IP:5173`.
4.  **Note**: Camera access requires HTTPS or localhost. For local testing on mobile without HTTPS, you might need to enable "Insecure origins treated as secure" in `chrome://flags` on your Android device, or use a tunneling service like `ngrok`.
    - Alternatively, use `vite-plugin-mkcert` for local HTTPS.

### Installing PWA

-   **Android (Chrome)**: Tap the menu (3 dots) -> "Add to Home Screen" or "Install App".
-   **iOS (Safari)**: Tap the Share button -> "Add to Home Screen".

## Tech Stack
-   Vite + React + TypeScript
-   Tailwind CSS
-   `idb` (IndexedDB wrapper)
-   `@zxing/browser` (Barcode scanning)
-   `vite-plugin-pwa`

## Deployment

### GitHub Pages (User Site)

This project includes a GitHub Actions workflow to automatically deploy to GitHub Pages.

1.  Push this code to a GitHub repository named `username.github.io`.
2.  Go to **Settings** -> **Pages**.
3.  Under **Build and deployment**, select **Source** as **GitHub Actions**.
4.  The workflow will run automatically on push to `main`.

**Note for HTTPS:** GitHub Pages provides HTTPS by default, which is required for camera access.

