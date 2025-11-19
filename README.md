# Mindclone Data Intake Application

Welcome to the Mindclone Data Intake application! This project is designed to collect personality and creative identity data through an interactive web interface. Below are the details and instructions for setting up and using the application.

## Features

- **Dynamic Questioning**: The application dynamically renders questions and sections based on a structured JSON file.
- **Autosave Functionality**: User responses are automatically saved to LocalStorage and Firestore, ensuring no data is lost during the intake process.
- **Progress Tracking**: Users can see their progress through the intake process with a visual progress bar.
- **Final JSON Export**: Users can export their responses as a structured JSON file for further analysis.

## Project Structure

The project is organized as follows:

```
mindclone-intake-app
├── src
│   ├── app
│   │   ├── layout.tsx          # Main layout of the application
│   │   ├── page.tsx            # Main intake UI
│   │   ├── globals.css          # Global styles
│   │   └── api
│   │       ├── save-progress    # API route for saving progress
│   │       ├── export-data      # API route for exporting data
│   │       └── load-progress     # API route for loading progress
│   ├── components
│   │   ├── ui
│   │   │   ├── button.tsx       # Reusable button component
│   │   │   ├── input.tsx        # Styled input field
│   │   │   ├── textarea.tsx     # Styled textarea
│   │   │   ├── progress.tsx      # Progress bar component
│   │   │   └── card.tsx         # Card layout for questions
│   │   ├── QuestionForm.tsx     # Manages question display and input
│   │   ├── ProgressBar.tsx      # Visualizes user progress
│   │   ├── SectionNavigation.tsx # Navigation controls for sections
│   │   ├── AutoSave.tsx         # Autosave functionality
│   │   └── ExportDialog.tsx     # Export dialog for JSON data
│   ├── lib
│   │   ├── utils.ts             # Utility functions
│   │   ├── storage.ts           # LocalStorage management
│   │   └── validation.ts         # Input validation logic
│   ├── types
│   │   └── index.ts             # TypeScript types and interfaces
│   ├── hooks
│   │   ├── useLocalStorage.ts    # Custom hook for LocalStorage
│   │   ├── useAutoSave.ts       # Custom hook for autosave logic
│   │   └── useProgress.ts       # Custom hook for tracking progress
│   └── data
│       └── questions.json       # Structured JSON data for questions
├── public
│   └── favicon.ico              # Application favicon
├── package.json                  # Project dependencies and scripts
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                    # Project documentation
```

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd mindclone-intake-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Open the Application**:
   Navigate to `http://localhost:3000` in your web browser to access the application.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

Thank you for using the Mindclone Data Intake application! We hope you find it useful for collecting and analyzing personality and creative identity data.