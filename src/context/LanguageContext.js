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
        contact: 'Contact',
      },
      home: {
        title: 'Front-End Developer',
        name: 'İSA BEZENİROĞLU',
        description:
          'I build enterprise-scale web applications with React and TypeScript — most recently real estate valuation platforms used by major banks in Türkiye. I also take Vue and React Native products end to end, from first commit to production.',
        viewProjects: 'View Projects',
      },
      visitor: {
        total: 'Total Visitors',
        active: 'Active Users',
      },
      about: {
        title: 'About Me',
        experience: 'Experience',
        experienceText:
          'Worked as a Front-End Developer at KEY Yazılım. Contributed to the development of real estate valuation platforms (Invex, Hypotex, Propex) for major banks in Türkiye within the banking and finance domain. Built scalable, responsive, and cross-browser compatible enterprise web interfaces using React and TypeScript. Alongside my professional work, I develop personal mobile applications with React Native, applying shared architectural and engineering principles across web and mobile platforms.',
        approach: 'Approach',
        approachText:
          'Working with Agile/Scrum methodologies. Deploying to production via CI/CD pipelines (GitHub Actions, Jenkins). Focused on clean code, SOLID principles, and performance optimization. Effective collaboration with cross-functional teams.',
        tech: 'Tech Stack',
        techText:
          'React, Next.js, React Native, TypeScript, JavaScript (ES6+), Redux, Material UI, Ant Design, Tailwind CSS, SCSS',
        tools: 'Tools',
        toolsText:
          'RESTful API integrations, CI/CD, Git/GitHub, Docker, Webpack, Jira, Agile/Scrum',
        goals: 'Goals',
        goalsText:
          'Continuously learning and improving. Following modern front-end technologies and applying best practices. Writing quality, maintainable code with focus on user experience.',
      },
      skills: {
        title: 'Technical Skills',
        subtitle: 'Technologies and tools I work with',
      },
      projects: {
        title: 'Projects',
        subtitle: 'Some of my recent work',
        live: 'Live',
        code: 'Code',
      },
      contact: {
        title: 'Get In Touch',
        subtitle: 'Fill out the form below or send me an email at ibznroglu@gmail.com',
        name: 'Name',
        email: 'Email',
        message: 'Message',
        send: 'Send Message',
      },
    },
    tr: {
      nav: {
        home: 'Ana Sayfa',
        about: 'Hakkımda',
        skills: 'Yetenekler',
        projects: 'Kişisel Projeler',
        contact: 'İletişim',
      },
      home: {
        title: 'Front-End Developer',
        name: 'İSA BEZENİROĞLU',
        description:
          "React ve TypeScript ile kurumsal ölçekte web uygulamaları geliştiriyorum — son olarak Türkiye'nin önde gelen bankalarının kullandığı gayrimenkul değerleme platformlarında çalıştım. Vue ve React Native tarafında ürünleri ilk commit'ten canlıya kadar uçtan uca geliştiriyorum.",
        viewProjects: 'Projeleri İncele',
      },
      visitor: {
        total: 'Toplam Ziyaretçi',
        active: 'Anlık Kullanıcılar',
      },
      about: {
        title: 'Hakkımda',
        experience: 'Deneyim',
        experienceText:
          "KEY Yazılım bünyesinde Front-End Developer olarak görev aldım. Bankacılık ve finans sektöründe, Türkiye'deki majör bankalara yönelik gayrimenkul değerleme platformları (Invex, Hypotex, Propex) geliştirilmesinde aktif rol üstlendim. React ve TypeScript kullanarak ölçeklenebilir, responsive ve cross-browser uyumlu kurumsal web arayüzleri tasarladım. Kurumsal projelerimin yanı sıra, React Native ile kişisel mobil uygulamalar geliştirerek web ve mobil mimariler arasında ortak tasarım ve mühendislik prensipleri uyguluyorum.",
        approach: 'Yaklaşım',
        approachText:
          "Agile/Scrum metodolojileri ile çalışıyorum. CI/CD pipeline'ları (GitHub Actions, Jenkins) kullanarak production'a deploy ediyorum. Clean code, SOLID prensipleri ve performans optimizasyonu konularına odaklanıyorum. Cross-functional takımlarla etkili iş birliği yapıyorum.",
        tech: 'Teknoloji Stack',
        techText:
          'React, Next.js, React Native, TypeScript, JavaScript (ES6+), Redux, Material UI, Ant Design, Tailwind CSS, SCSS',
        tools: 'Araçlar',
        toolsText:
          'RESTful API entegrasyonları, CI/CD, Git/GitHub, Docker, Webpack, Jira, Agile/Scrum',
        goals: 'Hedefler',
        goalsText:
          'Sürekli öğrenmeye ve kendimi geliştirmeye odaklanıyorum. Modern front-end teknolojilerini takip ediyor, best practices uyguluyorum. Kullanıcı deneyimini ön planda tutarak, kaliteli ve sürdürülebilir kod yazıyorum.',
      },
      skills: {
        title: 'Teknik Yetenekler',
        subtitle: 'Kullandığım teknolojiler ve araçlar',
      },
      projects: {
        title: 'Projeler',
        subtitle: 'Yakın zamanda üzerinde çalıştığım projeler',
        live: 'Canlı',
        code: 'Kod',
      },
      contact: {
        title: 'İletişim',
        subtitle: 'Formu doldurun veya ibznroglu@gmail.com adresine e-posta gönderin',
        name: 'Adınız',
        email: 'E-posta',
        message: 'Mesajınız',
        send: 'Mesaj Gönder',
      },
    },
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
