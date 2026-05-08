# BMH Receptionist Apps

A modern, responsive receptionist management system built for BMH (Baitul Maal Hidayatullah). This application helps receptionists manage guest logs, mustahiq services, and donor interactions efficiently.

## Features

- **Guest Book (Buku Tamu)**: Real-time logging of visitors with categorized entries (Donatur, Mustahiq, Kunjungan & Lainnya).
- **Service Management**: Specialized workflows for Mustahiq and Donor services.
- **Data Export**: Export guest logs to Excel and PDF formats for reporting.
- **Real-time Synchronization**: Powered by Firebase Firestore for instant updates across devices.
- **Responsive Design**: Clean and professional UI styled with Emerald green theme (BMH Brand), optimized for both desktop and mobile.

## Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore Lite & Authentication)
- **State Management**: React Hooks & Context API
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Icons**: [Lucide React](https://lucide.dev/)
- **Exports**: [SheetJS (XLSX)](https://sheetjs.com/) & [jsPDF](https://github.com/parallax/jsPDF)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components (shadcn/ui and custom components).
- `src/lib`: Utility functions, Firebase configuration, and Zod schemas.
- `src/hooks`: Custom React hooks.

## License

Copyright © 2024 BMH Apps. All rights reserved.
