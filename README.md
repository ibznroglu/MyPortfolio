# Portfolio Website

Modern, responsive portfolio website built with React and Tailwind CSS. Features real-time visitor tracking, multilingual support (TR/EN), and a sleek dark theme design.

## 🚀 Features

- **Modern UI/UX**: Dark theme with gradient backgrounds and smooth animations
- **Responsive Design**: Fully responsive across all devices and screen sizes
- **Multilingual Support**: Turkish and English language switching
- **Real-time Analytics**: Firebase Realtime Database integration for visitor tracking
  - Total unique visitors counter
  - Active users counter (last 30 seconds)
- **Interactive Navigation**: Smooth section transitions with active state indicators
- **Project Showcase**: Display of personal projects with live demos and code links
- **Contact Form**: Integrated contact section for easy communication
- **Skills Display**: Visual representation of technical skills and tools

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2.0
- **Styling**: Tailwind CSS 3.3.2
- **Icons**: React Icons
- **Database**: Firebase Realtime Database
- **Build Tool**: Create React App
- **Language**: JavaScript (ES6+)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/MyPortfolio.git
cd MyPortfolio
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Realtime Database
   - Copy your Firebase configuration
   - Update `src/config/firebase.js` with your Firebase credentials

4. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Home.jsx        # Home section with visitor stats
│   ├── About.jsx       # About section
│   ├── Skills.jsx      # Skills showcase
│   ├── Work.jsx        # Projects portfolio
│   ├── Contact.jsx     # Contact form
│   └── navbar.jsx      # Navigation bar
├── context/            # React Context providers
│   └── LanguageContext.js  # Language switching context
├── hooks/              # Custom React hooks
│   └── useVisitorTracking.js  # Visitor analytics hook
├── config/             # Configuration files
│   └── firebase.js     # Firebase configuration
├── assets/             # Static assets (images, etc.)
├── data/               # Data files
└── App.js              # Main app component
```

## 🔥 Firebase Setup

1. Create a Firebase project
2. Enable Realtime Database
3. Set up database rules (for development):
```json
{
  "rules": {
    "totalVisitors": {
      ".read": true,
      ".write": true
    },
    "activeUsers": {
      ".read": true,
      ".write": true
    }
  }
}
```
4. Add your Firebase config to `src/config/firebase.js`

## 🌐 Deployment

Build the production bundle:
```bash
npm run build
```

The `build` folder contains the optimized production build ready for deployment to platforms like:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**İsa Bezeniroğlu**

- Email: ibznroglu@gmail.com
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- GitHub: [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built with [Create React App](https://github.com/facebook/create-react-app)
- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
