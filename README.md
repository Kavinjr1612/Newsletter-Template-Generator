# 📰 Newsletter Template Generator

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

A robust, intuitive, and highly customizable web-based application designed to help educational institutions, corporate departments, and organizations effortlessly design, manage, and publish professional-grade newsletters. 

By streamlining the editorial process from content aggregation to final design export, this system drastically reduces manual effort and formatting struggles, empowering non-technical users to create stunning print-ready or digital newsletters.

---

## ✨ Key Features

- **Split-Screen Editor Workspace:** Manage your data via structured forms on the left while viewing a real-time, high-fidelity A4 scaled preview on the right.
- **Dynamic Theming Engine:** Instantly change the look and feel with pre-configured themes (e.g., "Gazetica" for newspapers, "Modern" for corporate). Easily customize primary colors, background, and typography to ensure 100% brand compliance.
- **Automated Responsive Layouts:** Built-in dynamic grid engine that automatically calculates optimal layouts (2-column or 3-column) and handles text overflow gracefully.
- **Modular Components:** Treat articles, events, HOD messages, and placement statistics as independent blocks that can be easily updated or rearranged.
- **JSON State Hydration:** Save your entire newsletter's state locally as a `.json` file and upload it later to resume editing right where you left off.
- **High-Fidelity PDF Export:** Integrated export service utilizing `html2canvas` and `jspdf` to convert your design into crisp, downloadable PDFs suitable for professional printing or digital distribution.

---

## 🛠️ Architecture & Tech Stack

The application is architected as a modern client-side Single Page Application (SPA), completely decoupling the data layer from the presentation layer for maximum performance.

- **Frontend Framework:** React 18 with Vite for lightning-fast HMR and optimized builds.
- **Language:** TypeScript for strict type safety across complex JSON structures.
- **Styling:** Tailwind CSS for rapid utility-first styling, combined with Vanilla CSS for print-specific `@media` queries and physical unit constraints (`mm`, `pt`).
- **UI Components:** [shadcn-ui](https://ui.shadcn.com/) and Radix UI for highly accessible, beautifully designed primitives.
- **Utilities:** `react-hook-form` & `zod` (validation), `date-fns` (date formatting), `framer-motion` (smooth animations).

---

## 🎯 The Problem it Solves

Traditionally, editorial teams rely on word processors (which break formatting easily) or complex software like Adobe InDesign (which has a steep learning curve). 

**The Newsletter Template Generator solves this by providing:**
1. A simple form-based input system that requires zero graphic design skills.
2. An end to "margin-fixing" frustrations—the system automatically maps your text into professional grids.
3. A reduction in newsletter generation time from weeks to hours.

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone git@github.com:Kavinjr1612/Newsletter-Template-Generator.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd Newsletter-Template-Generator
   ```

3. **Install the dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:8080` (or the port specified in your terminal) to view the application.

---

## 📖 How to Use

1. **Start a Project:** On the dashboard, choose to "Create New Edition" or upload an existing `sample-edition.json` file.
2. **Configure Global Settings:** Use the left panel to define the Newsletter Name, Date, and Department context.
3. **Customize the Theme:** Navigate to the Theme tab to select a preset layout, update the primary accent color, and choose heading/body fonts.
4. **Add Content:** Use the dedicated accordions to input Articles, Events, Placements, and Publications. The preview on the right will update instantaneously.
5. **Export:** Once satisfied with the layout, click the Export button to generate and download a print-ready PDF.

---

## 🔮 Future Enhancements
- **Automated Pagination:** Algorithm to seamlessly distribute overflowing content across multiple A4 pages.
- **Cloud Integration:** Supabase/Firebase integration for real-time collaborative editing.
- **AI Content Assistant:** OpenAI integration to automatically summarize long event reports into punchy newsletter snippets.

---

*Developed using the Design Thinking Methodology to provide a human-centered solution for educational publishing.*
