import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      nav: {
        home: 'Home',
        about: 'About',
        skills: 'Skills',
        projects: 'Personal Projects',
        contact: 'Contact'
      },
      home: {
        title: 'Front-End Developer',
        name: 'İSA BEZENİROĞLU',
        description: 'Front-End Developer specializing in React with JavaScript (ES6+) and TypeScript. Over the past few years, I’ve worked on enterprise-scale web applications in the banking and finance domain, contributing to real estate valuation platforms and the digitization of related business processes for major banks in Türkiye. I have experience with modern front-end architectures, Agile/Scrum methodologies, CI/CD pipelines, and RESTful API integrations. I focus on clean code, SOLID principles, and maintainable component-based architecture. In addition, I develop mobile applications using React Native as personal projects.',
        viewProjects: 'View Projects'
      },
      visitor: {
        total: 'Total Visitors',
        active: 'Active Users',
      },
      about: {
        title: 'About Me',
        experience: 'Experience',
        experienceText: 'Working as a Front-End Developer at KEY YAZILIM. Developing real estate valuation platforms (Invex, Hypotex, Propex) for Halkbank and other major banks. Building scalable, responsive, and cross-browser compatible interfaces using React and TypeScript.',
        approach: 'Approach',
        approachText: 'Working with Agile/Scrum methodologies. Deploying to production via CI/CD pipelines (GitHub Actions, Jenkins). Focused on clean code, SOLID principles, and performance optimization. Effective collaboration with cross-functional teams.',
        tech: 'Tech Stack',
        techText: 'React, TypeScript, JavaScript (ES6+), Redux, Material UI, Ant Design, Tailwind CSS, SCSS',
        tools: 'Tools',
        toolsText: 'RESTful API integrations, Git/GitHub, Docker, Webpack, Jira, CI/CD pipelines',
        goals: 'Goals',
        goalsText: 'Continuously learning and improving. Following modern front-end technologies and applying best practices. Writing quality, maintainable code with focus on user experience.'
      },
      skills: {
        title: 'Technical Skills',
        subtitle: 'Technologies and tools I work with'
      },
      projects: {
        title: 'Projects',
        subtitle: 'Some of my recent work',
        live: 'Live',
        code: 'Code'
      },
      contact: {
        title: 'Get In Touch',
        subtitle: 'Fill out the form below or send me an email at ibznroglu@gmail.com',
        name: 'Name',
        email: 'Email',
        message: 'Message',
        send: 'Send Message'
      }
    },
    tr: {
      nav: {
        home: 'Ana Sayfa',
        about: 'Hakkımda',
        skills: 'Yetenekler',
        projects: 'Kişisel Projeler',
        contact: 'İletişim'
      },
      home: {
        title: 'Front-End Developer',
        name: 'İSA BEZENİROĞLU',
        description: "React, JavaScript (ES6+) ve TypeScript odaklı Front-End Developer. Son yıllarda bankacılık ve finans sektöründe kurumsal ölçekte web uygulamaları geliştirerek; Türkiye’deki majör bankalara yönelik gayrimenkul değerleme platformları ve ilgili iş süreçlerinin dijitalleştirilmesinde görev aldım. Modern front-end mimarileri, Agile/Scrum metodolojileri, CI/CD pipeline’ları ve RESTful API entegrasyonları konularında deneyimliyim. Temiz kod, SOLID prensipleri ve sürdürülebilir component tabanlı mimariyi merkeze alıyorum. Ayrıca React Native kullanarak kişisel projeler kapsamında mobil uygulamalar geliştiriyorum.",
        viewProjects: 'Projeleri İncele'
      },
      visitor: {
        total: 'Toplam Ziyaretçi',
        active: 'Anlık Kullanıcılar',
      },
      about: {
        title: 'Hakkımda',
        experience: 'Deneyim',
        experienceText: 'KEY YAZILIM\'da Front-End Developer olarak çalışıyorum. Halkbank ve diğer büyük bankalar için gayrimenkul değerleme platformları (Invex, Hypotex, Propex) geliştiriyorum. React ve TypeScript kullanarak ölçeklenebilir, responsive ve cross-browser uyumlu arayüzler tasarlıyorum.',
        approach: 'Yaklaşım',
        approachText: 'Agile/Scrum metodolojileri ile çalışıyorum. CI/CD pipeline\'ları (GitHub Actions, Jenkins) kullanarak production\'a deploy ediyorum. Clean code, SOLID prensipleri ve performans optimizasyonu konularına odaklanıyorum. Cross-functional takımlarla etkili iş birliği yapıyorum.',
        tech: 'Teknoloji Stack',
        techText: 'React, TypeScript, JavaScript (ES6+), Redux, Material UI, Ant Design, Tailwind CSS, SCSS',
        tools: 'Araçlar',
        toolsText: 'RESTful API entegrasyonları, Git/GitHub, Docker, Webpack, Jira, CI/CD pipeline\'ları',
        goals: 'Hedefler',
        goalsText: 'Sürekli öğrenmeye ve kendimi geliştirmeye odaklanıyorum. Modern front-end teknolojilerini takip ediyor, best practices uyguluyorum. Kullanıcı deneyimini ön planda tutarak, kaliteli ve sürdürülebilir kod yazıyorum.'
      },
      skills: {
        title: 'Teknik Yetenekler',
        subtitle: 'Kullandığım teknolojiler ve araçlar'
      },
      projects: {
        title: 'Projeler',
        subtitle: 'Yakın zamanda üzerinde çalıştığım projeler',
        live: 'Canlı',
        code: 'Kod'
      },
      contact: {
        title: 'İletişim',
        subtitle: 'Formu doldurun veya ibznroglu@gmail.com adresine e-posta gönderin',
        name: 'Adınız',
        email: 'E-posta',
        message: 'Mesajınız',
        send: 'Mesaj Gönder'
      }
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

