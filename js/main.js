// --- 1. PHARMACIE DE GARDE SETTING ---
const isPharmacieDeGarde = false;

// --- 2. TRANSLATIONS ---
const translations = {
    fr: {
        gardeBanner: "Nous sommes de garde aujourd'hui !",
        callUs: "Appelez-nous",
        heroTitle: "Votre santé,\nnotre priorité\nau quotidien",
        heroSubtitle: "Conseils experts, parapharmacie, et accompagnement personnalisé.",
        visitUs: "Obtenir l'itinéraire",
        aboutTitle: "À Propos\nde Nous",
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
        monFri: "Lundi – Vendredi",
        saturday: "Samedi",
        sunday: "Dimanche",
        closedText: "Fermé",
        openMap: "Ouvrir sur Google Maps",
        mapDesc: "Cliquez ici pour l'itinéraire"
    },
    ar: {
        gardeBanner: "صيدليتنا تعمل بنظام الحراسة اليوم!",
        callUs: "اتصل بنا",
        heroTitle: "صحتك،\nأولويتنا\nاليومية",
        heroSubtitle: "نصائح خبراء، شبه صيدلية، ومرافقة شخصية.",
        visitUs: "احصل على الاتجاهات",
        aboutTitle: "معلومات\nعنا",
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
        monFri: "الإثنين – الجمعة",
        saturday: "السبت",
        sunday: "الأحد",
        closedText: "مغلق",
        openMap: "افتح على خرائط جوجل",
        mapDesc: "انقر هنا للحصول على الاتجاهات"
    }
};

// --- 3. LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    if (isPharmacieDeGarde) {
        document.getElementById("garde-banner").classList.remove("hidden");
    }

    document.getElementById("year").innerText = new Date().getFullYear();

    const savedLang = localStorage.getItem("lang");
    if (!savedLang) {
        document.getElementById("language-modal").style.display = "flex";
    } else {
        document.getElementById("language-modal").style.display = "none";
        applyLanguage(savedLang);
    }

    // Hide float button when hero phone button is visible
    const floatBtn = document.getElementById("float-call");
    const heroCta = document.querySelector(".btn-hero-call");
    if (floatBtn && heroCta) {
        const observer = new IntersectionObserver(entries => {
            floatBtn.style.opacity = entries[0].isIntersecting ? "0" : "1";
            floatBtn.style.pointerEvents = entries[0].isIntersecting ? "none" : "auto";
        }, { threshold: 0.5 });
        observer.observe(heroCta);
    }
});

function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    document.getElementById("language-modal").style.display = "none";
    applyLanguage(lang);
}

function toggleLanguage() {
    const currentLang = localStorage.getItem("lang") || "fr";
    const newLang = currentLang === "fr" ? "ar" : "fr";
    localStorage.setItem("lang", newLang);
    applyLanguage(newLang);
}

function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.getElementById("current-lang").innerText = lang === "fr" ? "AR" : "FR";

    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
}
