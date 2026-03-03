import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'sanskrit' | 'english' | 'hindi' | 'gujarati';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  sanskrit: {
    // Navigation
    home: 'गृहम्',
    japcount: 'जपगणना',
    bhajanmarg: 'भजनमार्गः',
    dashboard: 'सूचनापट्टम्',
    settings: 'सेटिंग्स',
    
    // Home page
    benefits_title: 'नामजपस्य लाभाः',
    benefits_desc: 'नामजपः मनसः शान्तिं, आध्यात्मिकवृद्धिं च प्रदाति। नियमितजपेन चित्तं स्थिरं भवति, भक्तिः वर्धते च।',
    choose_devotee: 'भक्तं चिनोतु / योजयतु',
    add_custom_god: 'कस्टम देवं योजयतु',
    mala_completed: 'माला पूर्णा!',
    japs: 'जपाः',
    malas: 'मालाः',
    
    // Gods
    ganesh: 'गणेशः',
    vishnu: 'विष्णुः',
    shiv: 'शिवः',
    durga: 'दुर्गा',
    surya: 'सूर्यः',
    
    // Mantras
    ganesh_mantra: 'ॐ गं गणपतये नमः',
    vishnu_mantra: 'ॐ नमो नारायणाय',
    shiv_mantra: 'ॐ नमः शिवाय',
    durga_mantra: 'ॐ दुं दुर्गायै नमः',
    surya_mantra: 'ॐ सूर्याय नमः',
    
    // JapCount
    tap_to_count: 'गणनायै स्पृशतु',
    swipe_up_to_count: 'गणनायै ऊर्ध्वं स्वाइप कुर्वन्तु',
    back: 'पृष्ठम्',
    
    // Dashboard
    daily: 'दैनिकम्',
    weekly: 'साप्ताहिकम्',
    monthly: 'मासिकम्',
    yearly: 'वार्षिकम्',
    calendar_view: 'पञ्चाङ्गदृश्यम्',
    ai_report: 'AI दिव्यप्रतिवेदनम्',
    generate_report: 'प्रतिवेदनं जनयतु',
    
    // Settings
    theme: 'थीम',
    light: 'प्रकाशः',
    dark: 'अन्धकारः',
    jap_method: 'जपविधिः',
    tap: 'स्पर्शः',
    swipe: 'स्वाइप',
    data_management: 'डेटाप्रबन्धनम्',
    export_data: 'डेटा निर्यातयतु',
    import_data: 'डेटा आयातयतु',
    delete_all_data: 'सर्वडेटा विलोपयतु',
    local_storage_note: 'सर्वं डेटा केवलं स्थानीयरूपेण संगृहीतम्',
    
    // Footer
    terms: 'नियमाः शर्ताश्च',
    privacy: 'गोपनीयता',
    copyright: 'प्रतिलिप्यधिकारः',
    feedback: 'प्रतिक्रिया',
    built_with_love: 'प्रेम्णा निर्मितम्',
    
    // Bhajan
    bhajans: 'भजनानि',
    add_bhajan: 'भजनं योजयतु',
    title: 'शीर्षकम्',
    lyrics: 'गीतपदानि',
    audio_link: 'ऑडियोलिङ्क',
  },
  english: {
    // Navigation
    home: 'Home',
    japcount: 'JapCount',
    bhajanmarg: 'BhajanMarg',
    dashboard: 'Dashboard',
    settings: 'Settings',
    
    // Home page
    benefits_title: 'Benefits of Naam Jap',
    benefits_desc: 'Naam Jap brings peace to the mind and spiritual growth. Regular chanting stabilizes the mind and increases devotion.',
    choose_devotee: 'Choose / Add Devotee',
    add_custom_god: 'Add Custom God',
    mala_completed: 'Mala Completed!',
    japs: 'Japs',
    malas: 'Malas',
    
    // Gods
    ganesh: 'Ganesh',
    vishnu: 'Vishnu',
    shiv: 'Shiv',
    durga: 'Durga',
    surya: 'Surya',
    
    // Mantras
    ganesh_mantra: 'Om Gam Ganapataye Namah',
    vishnu_mantra: 'Om Namo Narayanaya',
    shiv_mantra: 'Om Namah Shivaya',
    durga_mantra: 'Om Dum Durgayai Namah',
    surya_mantra: 'Om Suryaya Namah',
    
    // JapCount
    tap_to_count: 'Tap to Count',
    swipe_up_to_count: 'Swipe Up to Count',
    back: 'Back',
    
    // Dashboard
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    calendar_view: 'Calendar View',
    ai_report: 'AI Divine Report',
    generate_report: 'Generate Report',
    
    // Settings
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    jap_method: 'Jap Method',
    tap: 'Tap',
    swipe: 'Swipe',
    data_management: 'Data Management',
    export_data: 'Export Data',
    import_data: 'Import Data',
    delete_all_data: 'Delete All Data',
    local_storage_note: 'All data stored locally only',
    
    // Footer
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    copyright: 'Copyright',
    feedback: 'Feedback',
    built_with_love: 'Built with love using',
    
    // Bhajan
    bhajans: 'Bhajans',
    add_bhajan: 'Add Bhajan',
    title: 'Title',
    lyrics: 'Lyrics',
    audio_link: 'Audio Link',
  },
  hindi: {
    // Navigation
    home: 'होम',
    japcount: 'जप गणना',
    bhajanmarg: 'भजन मार्ग',
    dashboard: 'डैशबोर्ड',
    settings: 'सेटिंग्स',
    
    // Home page
    benefits_title: 'नाम जप के लाभ',
    benefits_desc: 'नाम जप मन को शांति और आध्यात्मिक विकास प्रदान करता है। नियमित जप से मन स्थिर होता है और भक्ति बढ़ती है।',
    choose_devotee: 'भक्त चुनें / जोड़ें',
    add_custom_god: 'कस्टम देवता जोड़ें',
    mala_completed: 'माला पूर्ण!',
    japs: 'जप',
    malas: 'मालाएं',
    
    // Gods
    ganesh: 'गणेश',
    vishnu: 'विष्णु',
    shiv: 'शिव',
    durga: 'दुर्गा',
    surya: 'सूर्य',
    
    // Mantras
    ganesh_mantra: 'ॐ गं गणपतये नमः',
    vishnu_mantra: 'ॐ नमो नारायणाय',
    shiv_mantra: 'ॐ नमः शिवाय',
    durga_mantra: 'ॐ दुं दुर्गायै नमः',
    surya_mantra: 'ॐ सूर्याय नमः',
    
    // JapCount
    tap_to_count: 'गिनने के लिए टैप करें',
    swipe_up_to_count: 'गिनने के लिए ऊपर स्वाइप करें',
    back: 'वापस',
    
    // Dashboard
    daily: 'दैनिक',
    weekly: 'साप्ताहिक',
    monthly: 'मासिक',
    yearly: 'वार्षिक',
    calendar_view: 'कैलेंडर दृश्य',
    ai_report: 'AI दिव्य रिपोर्ट',
    generate_report: 'रिपोर्ट बनाएं',
    
    // Settings
    theme: 'थीम',
    light: 'लाइट',
    dark: 'डार्क',
    jap_method: 'जप विधि',
    tap: 'टैप',
    swipe: 'स्वाइप',
    data_management: 'डेटा प्रबंधन',
    export_data: 'डेटा निर्यात करें',
    import_data: 'डेटा आयात करें',
    delete_all_data: 'सभी डेटा हटाएं',
    local_storage_note: 'सभी डेटा केवल स्थानीय रूप से संग्रहीत',
    
    // Footer
    terms: 'नियम और शर्तें',
    privacy: 'गोपनीयता नीति',
    copyright: 'कॉपीराइट',
    feedback: 'फीडबैक',
    built_with_love: 'प्यार से बनाया गया',
    
    // Bhajan
    bhajans: 'भजन',
    add_bhajan: 'भजन जोड़ें',
    title: 'शीर्षक',
    lyrics: 'गीत',
    audio_link: 'ऑडियो लिंक',
  },
  gujarati: {
    // Navigation
    home: 'હોમ',
    japcount: 'જપ ગણતરી',
    bhajanmarg: 'ભજન માર્ગ',
    dashboard: 'ડેશબોર્ડ',
    settings: 'સેટિંગ્સ',
    
    // Home page
    benefits_title: 'નામ જપના લાભો',
    benefits_desc: 'નામ જપ મનને શાંતિ અને આધ્યાત્મિક વિકાસ આપે છે। નિયમિત જપથી મન સ્થિર થાય છે અને ભક્તિ વધે છે।',
    choose_devotee: 'ભક્ત પસંદ કરો / ઉમેરો',
    add_custom_god: 'કસ્ટમ દેવ ઉમેરો',
    mala_completed: 'માળા પૂર્ણ!',
    japs: 'જપ',
    malas: 'માળાઓ',
    
    // Gods
    ganesh: 'ગણેશ',
    vishnu: 'વિષ્ણુ',
    shiv: 'શિવ',
    durga: 'દુર્ગા',
    surya: 'સૂર્ય',
    
    // Mantras
    ganesh_mantra: 'ૐ ગં ગણપતયે નમઃ',
    vishnu_mantra: 'ૐ નમો નારાયણાય',
    shiv_mantra: 'ૐ નમઃ શિવાય',
    durga_mantra: 'ૐ દું દુર્ગાયૈ નમઃ',
    surya_mantra: 'ૐ સૂર્યાય નમઃ',
    
    // JapCount
    tap_to_count: 'ગણવા માટે ટેપ કરો',
    swipe_up_to_count: 'ગણવા માટે ઉપર સ્વાઇપ કરો',
    back: 'પાછળ',
    
    // Dashboard
    daily: 'દૈનિક',
    weekly: 'સાપ્તાહિક',
    monthly: 'માસિક',
    yearly: 'વાર્ષિક',
    calendar_view: 'કેલેન્ડર દૃશ્ય',
    ai_report: 'AI દિવ્ય રિપોર્ટ',
    generate_report: 'રિપોર્ટ બનાવો',
    
    // Settings
    theme: 'થીમ',
    light: 'લાઇટ',
    dark: 'ડાર્ક',
    jap_method: 'જપ પદ્ધતિ',
    tap: 'ટેપ',
    swipe: 'સ્વાઇપ',
    data_management: 'ડેટા મેનેજમેન્ટ',
    export_data: 'ડેટા નિકાસ કરો',
    import_data: 'ડેટા આયાત કરો',
    delete_all_data: 'બધો ડેટા કાઢી નાખો',
    local_storage_note: 'બધો ડેટા ફક્ત સ્થાનિક રીતે સંગ્રહિત',
    
    // Footer
    terms: 'નિયમો અને શરતો',
    privacy: 'ગોપનીયતા નીતિ',
    copyright: 'કોપીરાઇટ',
    feedback: 'પ્રતિસાદ',
    built_with_love: 'પ્રેમથી બનાવેલ',
    
    // Bhajan
    bhajans: 'ભજનો',
    add_bhajan: 'ભજન ઉમેરો',
    title: 'શીર્ષક',
    lyrics: 'ગીત',
    audio_link: 'ઓડિયો લિંક',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('anantjap_language');
    return (saved as Language) || 'sanskrit';
  });

  useEffect(() => {
    localStorage.setItem('anantjap_language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

