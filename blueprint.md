# Blueprint: AI-Powered Matchmaking Platform

## 1. Overview

This document outlines the blueprint for an innovative web application that leverages artificial intelligence to provide personalized matchmaking services based on the traditional Asian practices of Physiognomy (관상, gwansang) and the Four Pillars of Destiny (사주, saju).

The platform will offer users a unique and engaging experience by analyzing their facial features and birth data to generate insightful personality profiles and recommend compatible partners. By blending ancient wisdom with modern technology, we aim to create a matchmaking service that is not only fun but also deeply meaningful.

## 2. Core Features & Design

### 2.1. User Input & Data Collection

- **Facial Photo Upload:** Users will upload a clear photo of their face. The application will provide a user-friendly interface for uploading, including a drag-and-drop zone and image preview.
- **Birth Information:** Users will input their birth date and time, which are essential for generating a Saju analysis.
- **Profile Information:** Basic information such as name and gender will be collected.

### 2.2. AI-Powered Analysis

- **Physiognomy Analysis (Simulated):** The application will simulate an AI analysis of the user's facial features to determine their dominant "animal sign" (e.g., Tiger-like, Rabbit-like).
- **Saju Analysis (Simulated):** The application will simulate an analysis of the user’s Four Pillars of Destiny based on their birth data to provide insights into their personality and elemental balance.

### 2.3. Matchmaking & Results

- **Compatibility Algorithm (Simulated):** A simulated algorithm will match users based on the compatibility of their physiognomy and Saju profiles.
- **Results Display:** The app will present a list of recommended matches in a visually appealing card-based layout. Each card will display the matched user's photo, name, and a brief summary of their compatible traits.
- **Loading Animation:** A loading animation will be displayed while the "analysis" is in progress to enhance the user experience.

## 3. Visual & Interactive Design

### 3.1. Aesthetics & Branding

- **Color Palette:** A vibrant and inviting color scheme will be used, with a mix of warm and trustworthy colors.
  - **Primary:** Warm Pink (`#C13584`)
  - **Secondary:** Approachable Orange (`#FCAF45`)
  - **Accent:** Trustworthy Blue (`#405DE6`)
  - **Background:** Soft Off-White (`#FAF9F6`) with a subtle noise texture for a premium feel.
- **Typography:** The `Noto Sans KR` font will be used for its readability and modern aesthetic. A clear hierarchy will be established using varying font sizes and weights.
- **Visual Effects:**
  - **Shadows:** Deep, multi-layered drop shadows will be used to create a sense of depth and lift interactive elements.
  - **Glow Effects:** Interactive elements like buttons will have a subtle glow on hover to provide feedback.
  - **Gradients & Textures:** Gradients will be used in the header and buttons to create a dynamic look. A noise texture will be applied to the background.

### 3.2. Layout & Responsiveness

- **Mobile-First Design:** The application will be fully responsive and optimized for a seamless experience on both mobile and desktop devices.
- **Component-Based Structure:** The layout will be organized into logical sections, including a header, user input form, results page, and a partnership inquiry form.
- **Card Layout:** Matching results will be displayed in a clean, grid-based card layout that is easy to scan.

## 4. Technical Implementation

### 4.1. Frontend

- **HTML5:** Semantic HTML will be used to structure the content.
- **CSS3:** Modern CSS techniques will be employed for styling and layout, including:
  - **CSS Variables:** For easy theming and maintenance.
  - **Flexbox & Grid:** For creating responsive layouts.
  - **Animations & Transitions:** To create a dynamic and engaging user interface.
- **JavaScript (ES6+):**
  - **DOM Manipulation:** To handle user interactions and dynamically update content.
  - **Event Handling:** To manage form submissions, file uploads, and button clicks.
  - **Simulated Asynchronicity:** `setTimeout` will be used to simulate the AI analysis process.

### 4.2. Current Plan & Action Steps

- **Objective:** Implement the frontend of the AI Matchmaking platform based on the user's request. This initial version will simulate the AI analysis and matching features. (Note: Restored the original pink/orange design while maintaining current functionality).

- **Steps:**
  1. **Structure `index.html`:** Create the main HTML file with sections for user input (photo, birth date, etc.) and a hidden section for displaying results.
  2. **Style with `style.css`:** Develop the stylesheet with the defined color palette, typography, and visual effects. Ensure the layout is responsive.
  3. **Implement `main.js`:**
     - Add event listeners for the file upload (drag-and-drop, click).
     - Implement image preview functionality.
     - Create a function to handle the "Show Results" button click, which will:
       - Hide the main content.
       - Display the results page with a loading animation.
       - Simulate a delay for the "analysis."
       - Generate and display a list of mock matching profiles.
     - Add functionality for the partnership inquiry form submission.
