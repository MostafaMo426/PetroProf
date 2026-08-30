/**
 * lib/i18n/translations.ts
 * Bilingual English & Arabic dictionary for PetroProf Portal.
 */

export type Language = 'en' | 'ar'

export const translations = {
  en: {
    // Brand
    brandName: 'PetroProf',
    brandTagline: 'Rope Access & Industrial Manpower Dispatch',
    brandSub: 'Saudi Arabia Industrial Services',

    // Navigation
    navOverview: 'Overview',
    navTechnicians: 'Technicians Roster',
    navDeployments: 'Live Deployments',
    navOrganizations: 'Client Organizations',
    navJobs: 'Job Requests & Quotes',
    navCompliance: 'Safety & Compliance',
    navAiAssistant: 'IRATA Safety AI',
    navQuoting: 'Dynamic Quoting',
    navAudit: 'Audit Trail',
    navSettings: 'Platform Settings',
    navProjects: 'Active Projects',
    navNewRequest: 'Request Manpower',
    navCalculator: 'Pricing Calculator',
    navLogbook: 'Digital Logbook',
    navQrVerify: 'QR Verification',
    navCertificates: 'Certifications & OCR',
    navChecklist: 'Pre-Rigging Checklist',
    navProfile: 'My Profile',
    navSignOut: 'Sign Out',

    // Common Actions
    add: 'Add',
    remove: 'Remove',
    removeAccount: 'Remove Account',
    cancel: 'Cancel',
    save: 'Save Changes',
    confirm: 'Confirm',
    search: 'Search...',
    filter: 'Filter',
    all: 'All',
    status: 'Status',
    verified: 'Verified',
    pending: 'Pending',
    active: 'Active',
    inProgress: 'In Progress',
    completed: 'Completed',
    sar: 'SAR',
    perShift: 'per shift',
    elevation: 'Elevation',

    // AI Features
    aiAssistantTitle: 'Saeed AI — Safety Advisor',
    aiAssistantSubtitle: 'IRATA ICOP 2024 & Saudi Industrial Safety Standards',
    aiAutoAssess: 'Auto-Assess with Gemini AI',
    aiUploadCert: 'Upload Certificate (AI OCR)',
    askAiPlaceholder: 'Ask Saeed AI about rigging loads, safety ratios, or Aramco permit standards...',

    // IRATA Levels
    level1: 'Level 1 - Technician',
    level2: 'Level 2 - Lead Tech',
    level3: 'Level 3 - Supervisor',

    // Mobile & Layout
    menu: 'Menu',
    notifications: 'Notifications',
    support: '24/7 Support',
  },

  ar: {
    // Brand
    brandName: 'بتروبروف',
    brandTagline: 'بوابة التسلق الصناعي بالحبال وإمداد الكوادر المتخصصة',
    brandSub: 'الخدمات الصناعية والبترولية في المملكة العربية السعودية',

    // Navigation
    navOverview: 'لوحة التحكم العامة',
    navTechnicians: 'سجل الفنيين المعتمدين',
    navDeployments: 'مواقع العمل الميدانية',
    navOrganizations: 'الشركات والعملاء',
    navJobs: 'طلبات الكوادر والتسعير',
    navCompliance: 'السلامة والامتثال',
    navAiAssistant: 'مساعد السلامة الذكي (سعيد)',
    navQuoting: 'حاسبة التسعير الديناميكية',
    navAudit: 'سجل العمليات والأمان',
    navSettings: 'إعدادات المنصة',
    navProjects: 'المشاريع الجارية',
    navNewRequest: 'طلب كوادر متخصصة',
    navCalculator: 'تقدير التكاليف',
    navLogbook: 'سجل الساعات الرقمي',
    navQrVerify: 'التحقق الميداني عبر QR',
    navCertificates: 'الشهادات وفحص OCR الذكي',
    navChecklist: 'قائمة فحص السلامة المسبق',
    navProfile: 'الملف الشخصي',
    navSignOut: 'تسجيل الخروج',

    // Common Actions
    add: 'إضافة',
    remove: 'حذف',
    removeAccount: 'حذف الحساب',
    cancel: 'إلغاء',
    save: 'حفظ التغييرات',
    confirm: 'تأكيد',
    search: 'بحث...',
    filter: 'تصفية',
    all: 'الكل',
    status: 'الحالة',
    verified: 'معتمد وموثق',
    pending: 'قيد المراجعة',
    active: 'نشط',
    inProgress: 'قيد التنفيذ',
    completed: 'مكتمل',
    sar: 'ريال سعودي',
    perShift: 'لكل وردية',
    elevation: 'الارتفاع',

    // AI Features
    aiAssistantTitle: 'المستشار الذكي سعيد — معايير IRATA',
    aiAssistantSubtitle: 'معايير IRATA ICOP 2024 ومتطلبات السلامة الصناعية لأرامكو وسابك',
    aiAutoAssess: 'التقييم الذكي بواسطة Gemini AI',
    aiUploadCert: 'رفع الشهادة (استخراج ذكي OCR)',
    askAiPlaceholder: 'اسأل سعيد عن أحمال نقاط التثبيت، نسب الإشراف، أو تصاريح العمل في أرامكو...',

    // IRATA Levels
    level1: 'المستوى الأول — فني تسلق',
    level2: 'المستوى الثاني — قائد فريق',
    level3: 'المستوى الثالث — مشرف سلامة وإنقاذ',

    // Mobile & Layout
    menu: 'القائمة',
    notifications: 'الإشعارات',
    support: 'الدعم الفني 24/7',
  },
}
