import React from 'react';
import { useLanguage } from "../context/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();

  return (
    <div className='w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#112240] to-[#0a192f] flex items-center justify-center py-16'>
      <div className='max-w-2xl mx-auto px-8 w-full'>
        <div className='text-center mb-12'>
          <h2 className='text-5xl font-bold inline border-b-4 border-pink-600 text-gray-300 pb-2'>
            {t.contact.title}
          </h2>
          <p className='text-gray-400 py-4 mt-4'>{t.contact.subtitle}</p>
        </div>
        <form 
          method='POST' 
          action="https://getform.io/f/f29dddd8-127d-4073-b25f-78aee14e9831" 
          className='bg-[#112240] p-8 rounded-xl border border-pink-600/20 shadow-2xl space-y-6'
        >
          <input 
            className='w-full bg-[#0a192f] border border-pink-600/30 text-gray-300 p-4 rounded-lg focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-600/50 transition-all' 
            type="text" 
            placeholder={t.contact.name} 
            name='name' 
            required 
          />
          <input 
            className='w-full bg-[#0a192f] border border-pink-600/30 text-gray-300 p-4 rounded-lg focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-600/50 transition-all' 
            type="email" 
            placeholder={t.contact.email} 
            name='email' 
            required 
          />
          <textarea 
            className='w-full bg-[#0a192f] border border-pink-600/30 text-gray-300 p-4 rounded-lg focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-600/50 transition-all resize-none' 
            name="message" 
            rows="8" 
            placeholder={t.contact.message} 
            required
          ></textarea>
          <button 
            type="submit" 
            className='w-full text-white border-2 border-pink-600 bg-pink-600 hover:bg-pink-700 hover:border-pink-700 px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-600/50 font-semibold text-lg'
          >
            {t.contact.send}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
