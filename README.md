# Weather Dashboard Using API - Auspify Task 4

A dynamic, modern, and responsive Weather Dashboard built with Vanilla JavaScript, HTML5, and CSS3. This application fetches real-time meteorological data using asynchronous API integration, allowing users to search for weather conditions in any city worldwide with instant UI updates and robust error handling.

---

## 🚀 Live Demo & Links

- **Live Demo (Vercel):** [https://auspfy-task-4.vercel.app](https://auspfy-task-4.vercel.app)
- **GitHub Repository:** [https://github.com/murodil01/Auspfy-Task-4.git](https://github.com/murodil01/Auspfy-Task-4.git)

---

## ✨ Key Features & Functionality

- **City Search Functionality:** Search for weather metrics in any global location via interactive user input.
- **Real-Time Data Fetching:** Asynchronous HTTP requests (`fetch` / `async-await`) to receive live temperature, humidity, wind speed, and atmospheric conditions.
- **Dynamic UI Updates:** Immediate DOM manipulation displaying real-time metrics, weather icons, and dynamic status updates without page reloads.
- **API Error Handling & Input Validation:** Built-in validation for empty inputs, non-existent city queries (404 errors), and network request failures with intuitive user feedback.
- **Responsive Dashboard:** Adaptive layout optimized for seamless viewing across desktop, tablet, and mobile displays.

---

## 🛠️ Tech Stack & Concepts Covered

- **HTML5:** Semantic dashboard layout, accessible form structures, and data container elements.
- **CSS3:** Flexbox, CSS Grid, custom properties (variables), transition effects, and mobile-first responsive media queries.
- **JavaScript (ES6+):**
  - **Asynchronous JS:** `Fetch API`, `async/await`, and `Promises`.
  - **JSON Parsing:** Serializing and extracting nested key-value pairs from weather payloads.
  - **DOM Manipulation:** Dynamic creation, updating, and conditional rendering of weather cards and error states.
  - **Event Handling:** Event listeners for user submission, keyboard input (`Enter` key), and button triggers.

---

## 📂 Project Structure

```text
Auspfy-Task-4/
│
├── index.html          # Dashboard interface & input layout
├── style.css           # Styling, visual metrics layout, & responsive grid
├── app.js              # Fetch API logic, asynchronous queries, & DOM rendering
└── README.md           # Project documentation
