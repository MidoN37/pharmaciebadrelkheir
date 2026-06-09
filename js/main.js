// --- 1. PHARMACIE DE GARDE SETTING ---
// Change this to true when you are on call, and push to GitHub. Netlify will update immediately.
const isPharmacieDeGarde = false; 

// --- 2. TRANSLATIONS DICTIONARY ---
const translations = {
    fr: {
        gardeBanner: "Nous sommes de garde aujourd'hui !",
        callUs: "Appelez-nous",
        heroTitle: "Votre santé, notre priorité au quotidien",
        heroSubtitle: "Conseils experts, parapharmacie, et accompagnement personnalisé.",
        visitUs: "Rendez-nous visite",
        aboutTitle: "À Propos de Nous",
        aboutText1: "Fondée sur des valeurs d'écoute et d'empathie, la Pharmacie Badr El Kheir est votre partenaire santé de confiance. Nous nous engageons à vous fournir des soins de qualité, des conseils précis et un service confidentiel.",
        aboutText2: "Dirigée par le Dr. El Mahdi Nih, notre équipe met un point d'honneur à vous accompagner dans vos traitements médicaux et votre bien-être général.",
        servicesTitle: "Parapharmacie & Services",
        dermoTitle: "Dermo-Cosmétique",
        dermoDesc: "Un large choix de produits pour le soin de la peau, des cheveux et l'hygiène quotidienne, adaptés à tous les types de peaux.",
        babyTitle: "Espace Bébé & Maman",
        babyDesc: "Laits infantiles, soins pour bébés et accompagnement pour les jeunes mamans.",
        healthTitle: "Suivi Santé",
        healthDesc: "Prise de tension artérielle, conseils nutritionnels et orientation médicale par notre équipe.",
        supplementsTitle: "Compléments Alimentaires",
        supplementsDesc: "Vitamines, minéraux et phytothérapie pour booster votre immunité et votre vitalité.",
        contactTitle: "Informations Pratiques",
        hoursTitle: "Horaires d'Ouverture",
        monFri: "Lundi - Vendredi",
        saturday: "Samedi",
        sunday: "Dimanche",
        closedText: "Fermé",
        openMap: "Ouvrir sur Google Maps",
        mapDesc: "Cliquez ici pour obtenir l'itinéraire vers la pharmacie."
    },
    ar: {
        gardeBanner: "صيدليتنا تعمل بنظام الحراسة اليوم!",
        callUs: "اتصل بنا",
        heroTitle: "صحتك، أولويتنا اليومية",
        heroSubtitle: "نصائح خبراء، شبه صيدلية، ومرافقة شخصية.",
        visitUs: "قم بزيارتنا",
        aboutTitle: "معلومات عنا",
        aboutText1: "تأسست صيدلية بدر الخير على قيم الاستماع والتعاطف، وهي شريكك الصحي الموثوق. نحن ملتزمون بتقديم رعاية عالية الجودة ونصائح دقيقة وخدمة سرية.",
        aboutText2: "بقيادة الدكتور المهدي نيح، يحرص فريقنا على مرافقتك في علاجاتك الطبية ورفاهيتك العامة.",
        servicesTitle: "شبه الصيدلية والخدمات",
        dermoTitle: "مستحضرات التجميل الجلدية",
        dermoDesc: "مجموعة واسعة من المنتجات للعناية بالبشرة والشعر والنظافة اليومية، مناسبة لجميع أنواع البشرة.",
        babyTitle: "مساحة الطفل والأم",
        babyDesc: "حليب أطفال، رعاية الرضع ومرافقة الأمهات الشابات.",
        healthTitle: "المتابعة الصحية",
        healthDesc: "قياس ضغط الدم، نصائح غذائية وتوجيه طبي من قبل فريقنا.",
        supplementsTitle: "المكملات الغذائية",
        supplementsDesc: "فيتامينات، معادن وعلاج بالنباتات لتعزيز مناعتك وحيويتك.",
        contactTitle: "معلومات عملية",
        hoursTitle: "أوقات العمل",
        monFri: "الإثنين - الجمعة",
        saturday: "السبت",
        sunday: "الأحد",
        closedText: "مغلق",
        openMap: "افتح على خرائط جوجل",
        mapDesc: "انقر هنا للحصول على الاتجاهات إلى الصيدلية."
    }
};

// --- 3. LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    // Check Garde Status
    if (isPharmacieDeGarde) {
        document.getElementById("garde-banner").classList.remove("hidden");
    }

    // Set Copyright Year dynamically
    document.getElementById("year").innerText = new Date().getFullYear();

    // Check Language Preferences
    const savedLang = localStorage.getItem("lang");
    if (!savedLang) {
        document.getElementById("language-modal").style.display = "flex";
    } else {
        document.getElementById("language-modal").style.display = "none";
        applyLanguage(savedLang);
    }
});

// Select language from Modal
function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    document.getElementById("language-modal").style.display = "none";
    applyLanguage(lang);
}

// Toggle language from Header Button
function toggleLanguage() {
    const currentLang = localStorage.getItem("lang") || "fr";
    const newLang = currentLang === "fr" ? "ar" : "fr";
    localStorage.setItem("lang", newLang);
    applyLanguage(newLang);
}

// Apply Language and RTL/LTR logic
function applyLanguage(lang) {
    // Change layout direction
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    
    // Update Button Text
    document.getElementById("current-lang").innerText = lang === "fr" ? "AR" : "FR";

    // Translate all elements with data-i18n attribute
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
}