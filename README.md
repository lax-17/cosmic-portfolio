# Cosmic Interface Portfolio

A modern, interactive portfolio website for Laxmikant Nishad, an AI/ML Engineer specializing in multi-modal models, LLM fine-tuning, and computer vision.

## 🚀 Features

- **Interactive 3D Visualizations**: Skills and projects displayed with WebGL and Three.js
- **Terminal Interface**: Command-line style navigation
- **Real-time Analytics**: Track visitor interactions
- **Responsive Design**: Optimized for all devices
- **Dark/Light Theme**: Automatic theme switching
- **SEO Optimized**: Meta tags and structured data
- **Performance Monitoring**: Built-in analytics and error tracking

## 🛠️ Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **3D Graphics**: Three.js with custom shaders
- **State Management**: React Context
- **Routing**: React Router
- **Icons**: Lucide React
- **Deployment**: Vercel/Netlify

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/lax-17/cosmic-portfolio.git
   cd cosmic-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Page components
├── shaders/           # WebGL shaders
└── content/           # Content management
```

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Vite configuration
3. Deploy automatically on push

### Netlify

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting provider

## 🔧 Configuration

- **Environment Variables**: Copy `.env.example` to `.env` and configure
- **Analytics**: Update tracking IDs in `src/contexts/AnalyticsContext.tsx`
- **Content**: Modify content in `src/content/`

## 📊 Analytics & Monitoring

The portfolio includes built-in analytics for:
- Page views and user interactions
- Performance metrics
- Error tracking
- Custom events

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 📞 Contact

Laxmikant Nishad
- Email: [Your Email]
- LinkedIn: [Your LinkedIn]
- GitHub: [Your GitHub]

---

Built with ❤️ using React, TypeScript, and modern web technologies.
