// ─── E-Book Promo Configuration ──────────────────────────────────────────────
// Update these values to promote your own books, journals, or custom guides.
// Set `active: true` to display the promo card globally on all 700 pages.

export const BOOK_PROMO_CONFIG = {
  active: true,
  price: '€4.99',
  checkoutUrl: 'https://checkout.stripe.com/demo', // Replace with your live Stripe payment or checkout link
  
  // Localized title & 5 bullets for major language groups
  translations: {
    en: {
      title: '📘 The Cosmic Geometry: A Guide to Vedic Mindfulness',
      bullets: [
        'Explore the mathematical symmetry of the 27 Nakshatras',
        'Simple, daily reflection rituals for peace and focus',
        'How to align your morning intentions with lunar cycles',
        'Traditional Vedic frameworks for patience and self-growth',
        'Includes printable 30-day spiritual journal & checklist'
      ],
      btnText: 'Grab Your Copy — €4.99',
      paymentNote: 'Instant PDF download • Secure Checkout'
    },
    es: {
      title: '📘 Geometría Cósmica: Guía de Atención Plena Védica',
      bullets: [
        'Explora la simetría matemática de los 27 Nakshatras',
        'Rituales sencillos de reflexión diaria para la paz y el enfoque',
        'Cómo alinear tus intenciones matutinas con los ciclos lunares',
        'Marcos védicos tradicionales para la paciencia y el crecimiento',
        'Incluye un diario espiritual de 30 días para imprimir'
      ],
      btnText: 'Obtener Mi Copia — €4.99',
      paymentNote: 'Descarga instantánea en PDF • Pago Seguro'
    },
    pt: {
      title: '📘 Geometria Cósmica: Guia de Atenção Plena Védica',
      bullets: [
        'Explore a simetria matemática dos 27 Nakshatras',
        'Rituais simples de reflexão diária para paz e foco',
        'Como alinhar suas intenções matinais com os ciclos lunares',
        'Abordagens védicas tradicionais para paciência e autoconhecimento',
        'Inclui um diário espiritual de 30 dias para imprimir'
      ],
      btnText: 'Garantir Minha Cópia — €4.99',
      paymentNote: 'Download instantâneo em PDF • Pago Seguro'
    },
    fr: {
      title: '📘 La Géométrie Cosmique : Guide de Pleine Conscience Védique',
      bullets: [
        'Explorez la symétrie mathématique des 27 Nakshatras',
        'Rituels simples de réflexion quotidienne pour la paix et la clarté',
        'Comment aligner vos intentions matinales sur les cycles lunaires',
        'Méthodes védiques traditionnelles pour la patience et le développement',
        'Comprend un journal spirituel imprimable de 30 jours'
      ],
      btnText: 'Obtenir Mon Exemplaire — €4.99',
      paymentNote: 'Téléchargement PDF immédiat • Paiement Sécurisé'
    },
    it: {
      title: '📘 La Geometria Cosmica: Guida alla Consapevolezza Vedica',
      bullets: [
        'Esplora la simmetria matematica delle 27 Nakshatras',
        'Semplici rituali di riflessione quotidiana per pace e concentrazione',
        'Come allineare le tue intenzioni mattutine con i cicli lunari',
        'Metodi vedici tradizionali per la pazienza e l\'auto-crescita',
        'Include un diario spirituale stampabile di 30 giorni'
      ],
      btnText: 'Ottieni la Tua Copia — €4.99',
      paymentNote: 'Download istantaneo in PDF • Pagamento Sicuro'
    },
    de: {
      title: '📘 Kosmische Geometrie: Leitfaden für vedische Achtsamkeit',
      bullets: [
        'Entdecken Sie die mathematische Symmetrie der 27 Nakshatras',
        'Einfache tägliche Reflexionsrituale für Frieden und Fokus',
        'Wie Sie Ihre morgendlichen Absichten auf die Mondzyklen abstimmen',
        'Traditionelle vedische Ansätze für Geduld und Selbstwachstum',
        'Enthält ein druckbares 30-tägiges spirituelles Tagebuch'
      ],
      btnText: 'Jetzt Exemplar Sichern — €4.99',
      paymentNote: 'Sofortiger PDF-Download • Sichere Zahlung'
    },
    hi: {
      title: '📘 ब्रह्मांडीय ज्यामिति: वैदिक माइंडफुलनेस गाइड',
      bullets: [
        '२७ नक्षत्रों की पूर्ण गणितीय समरूपता को समझें',
        'शांति और एकाग्रता के लिए सरल दैनिक आत्म-चिंतन अनुष्ठान',
        'चंद्र चक्रों के साथ अपने सुबह के इरादों को कैसे संरेखित करें',
        'धैर्य और आत्म-विकास के लिए पारंपरिक वैदिक दृष्टिकोण',
        'प्रिंट करने योग्य ३०-दिवसीय आध्यात्मिक जर्नल शामिल है'
      ],
      btnText: 'अपनी प्रति प्राप्त करें — €4.99',
      paymentNote: 'तत्काल PDF डाउनलोड • सुरक्षित भुगतान'
    },
    ar: {
      title: '📘 الهندسة الكونية: دليل اليقظة الذهنية الفيدية',
      bullets: [
        'استكشف التناظر الرياضي لـ 27 نكشاترا (نجم ميلاد)',
        'طقوس بسيطة للتأمل اليومي من أجل السلام والتركيز العميق',
        'كيفية مواءمة نواياك الصباحية مع دورات القمر الطبيعية',
        'الأساليب الفيدية التقليدية للصبر والنمو الذاتي الروحي',
        'يتضمن دفتر يوميات روحي وجدول متابعة قابل للطباعة لمدة 30 يومًا'
      ],
      btnText: 'احصل على نسختك — €4.99',
      paymentNote: 'تحميل PDF فوري • دفع آمن بالكامل'
    }
  }
}
