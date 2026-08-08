'use client'
import { useState, useEffect } from 'react'
import { MOTHER_TONGUE_OPTIONS } from '../lib/languages'

interface Result {
  life_path: number
  name_number: number
  soul_urge: number
  personality: number
  meaning: string
  rashi: string
  nakshatra: string
  nakshatra_pada: number
  dasha_lord: string
  dasha_years: number
}

interface CalculatorProps {
  lang: string
}

// ─── Localization ─────────────────────────────────────────────────────────────
const CALC_LOCALIZATION: Record<string, Record<string, string>> = {
  en: {
    placeholderName: 'Enter your full name',
    placeholderDob: 'Select your birth date',
    placeholderPlace: 'Place of birth (e.g. Thrissur, India)',
    labelTimeUnknown: "I don't know my exact birth time",
    genderMale: 'Male', genderFemale: 'Female', genderOther: 'Prefer not to say',
    disclaimerText: 'Some readings may be approximate due to missing birth details.',
    btnCalculate: 'Calculate My Path', btnCalculating: 'Calculating...',
    gridLifePath: 'Life Path', gridNameNumber: 'Name Number', gridSoulUrge: 'Soul Urge', gridPersonality: 'Personality',
    titleVedic: '✦ Vedic Reading', labelMoonSign: 'Moon Sign', labelBirthStar: 'Birth Star', labelCurrentDasha: 'Current Dasha', labelPada: 'Pada', labelYears: 'yrs',
    premiumText: 'Your full Vedic report includes complete relationship compatibility, supportive planetary energies, detailed time cycle (Dasha) analysis, and your complete personal soul blueprint PDF.',
    btnReport: 'Get Full Report — €2.99', btnLoading: 'Loading...',
    paymentNote: 'Instant PDF download • Secure payment',
    errorText: 'Something went wrong. Please try again.', errorPayment: 'Payment failed. Please try again.'
  },
  es: {
    placeholderName: 'Ingresa tu nombre completo', placeholderDob: 'Selecciona tu fecha de nacimiento',
    placeholderPlace: 'Lugar de nacimiento (ej. Madrid, España)', labelTimeUnknown: 'No sé mi hora exacta de nacimiento',
    genderMale: 'Masculino', genderFemale: 'Femenino', genderOther: 'Prefiero no decirlo',
    disclaimerText: 'Algunas lecturas pueden ser aproximadas.',
    btnCalculate: 'Calcular Mi Camino', btnCalculating: 'Calculando...',
    gridLifePath: 'Camino de Vida', gridNameNumber: 'Número del Nombre', gridSoulUrge: 'Impulso del Alma', gridPersonality: 'Personalidad',
    titleVedic: '✦ Lectura Védica', labelMoonSign: 'Signo Lunar', labelBirthStar: 'Estrella Natal', labelCurrentDasha: 'Ciclo Actual (Dasha)', labelPada: 'Pada', labelYears: 'años',
    premiumText: 'Tu informe védico completo incluye compatibilidad de relaciones, energías planetarias, análisis del ciclo de tiempo (Dasha) y tu PDF del mapa del alma.',
    btnReport: 'Obtener Informe Completo — €2.99', btnLoading: 'Cargando...',
    paymentNote: 'Descarga PDF instantánea • Pago seguro',
    errorText: 'Algo salió mal. Por favor intenta de nuevo.', errorPayment: 'El pago falló. Por favor intenta de nuevo.'
  },
  pt: {
    placeholderName: 'Insira seu nome completo', placeholderDob: 'Selecione sua data de nascimento',
    placeholderPlace: 'Local de nascimento (ex. Lisboa, Portugal)', labelTimeUnknown: 'Não sei meu horário exato de nascimento',
    genderMale: 'Masculino', genderFemale: 'Feminino', genderOther: 'Prefiro não dizer',
    disclaimerText: 'Algumas leituras podem ser aproximadas.',
    btnCalculate: 'Calcular Meu Caminho', btnCalculating: 'Calculando...',
    gridLifePath: 'Caminho de Vida', gridNameNumber: 'Número do Nome', gridSoulUrge: 'Desejo da Alma', gridPersonality: 'Personalidade',
    titleVedic: '✦ Leitura Védica', labelMoonSign: 'Signo Lunar', labelBirthStar: 'Estrela de Nascimento', labelCurrentDasha: 'Ciclo Atual (Dasha)', labelPada: 'Pada', labelYears: 'anos',
    premiumText: 'Seu relatório védico completo inclui compatibilidade, energias planetárias, análise do ciclo de tempo (Dasha) e o PDF do seu mapa da alma.',
    btnReport: 'Obter Relatório Completo — €2.99', btnLoading: 'Carregando...',
    paymentNote: 'Download instantâneo em PDF • Pagamento seguro',
    errorText: 'Algo deu errado. Por favor, tente novamente.', errorPayment: 'Falha no pagamento. Por favor, tente novamente.'
  },
  fr: {
    placeholderName: 'Entrez votre nom complet', placeholderDob: 'Sélectionnez votre date de naissance',
    placeholderPlace: 'Lieu de naissance (ex. Paris, France)', labelTimeUnknown: "Je ne connais pas mon heure exacte de naissance",
    genderMale: 'Homme', genderFemale: 'Femme', genderOther: 'Préfère ne pas dire',
    disclaimerText: "Certaines lectures peuvent être approximatives.",
    btnCalculate: 'Calculer Mon Chemin', btnCalculating: 'Calcul en cours...',
    gridLifePath: 'Chemin de Vie', gridNameNumber: 'Nombre du Nom', gridSoulUrge: "Désir de l'Âme", gridPersonality: 'Personnalité',
    titleVedic: '✦ Lecture Védique', labelMoonSign: 'Signe Lunaire', labelBirthStar: 'Étoile de Naissance', labelCurrentDasha: 'Cycle Actuel (Dasha)', labelPada: 'Pada', labelYears: 'ans',
    premiumText: "Votre rapport védique complet comprend la compatibilité relationnelle, les énergies planétaires, l'analyse du cycle temporel (Dasha) et votre PDF.",
    btnReport: 'Obtenir le Rapport Complet — 2,99 €', btnLoading: 'Chargement...',
    paymentNote: 'Téléchargement PDF instantané • Paiement sécurisé',
    errorText: 'Une erreur est survenue. Veuillez réessayer.', errorPayment: 'Échec du paiement. Veuillez réessayer.'
  },
  it: {
    placeholderName: 'Inserisci il tuo nome completo', placeholderDob: 'Seleziona la tua data di nascita',
    placeholderPlace: 'Luogo di nascita (es. Roma, Italia)', labelTimeUnknown: 'Non conosco la mia ora esatta di nascita',
    genderMale: 'Maschio', genderFemale: 'Femmina', genderOther: 'Preferisco non dirlo',
    disclaimerText: 'Alcune letture potrebbero essere approssimative.',
    btnCalculate: 'Calcola il Mio Cammino', btnCalculating: 'Calcolo in corso...',
    gridLifePath: 'Cammino di Vita', gridNameNumber: 'Numero del Nome', gridSoulUrge: "Desiderio dell'Anima", gridPersonality: 'Personalità',
    titleVedic: '✦ Lettura Vedica', labelMoonSign: 'Segno Lunare', labelBirthStar: 'Stella di Nascita', labelCurrentDasha: 'Ciclo Attuale (Dasha)', labelPada: 'Pada', labelYears: 'anni',
    premiumText: "Il tuo rapporto vedico completo include compatibilità relazionale, energie planetarie, analisi del ciclo temporale (Dasha) e il PDF della tua mappa dell'anima.",
    btnReport: 'Ottieni il Rapporto Completo — €2.99', btnLoading: 'Caricamento...',
    paymentNote: 'Download istantaneo in PDF • Pagamento sicuro',
    errorText: 'Qualcosa è andato storto. Riprova.', errorPayment: 'Pagamento fallito. Riprova.'
  },
  de: {
    placeholderName: 'Geben Sie Ihren vollständigen Namen ein', placeholderDob: 'Wählen Sie Ihr Geburtsdatum',
    placeholderPlace: 'Geburtsort (z.B. Berlin, Deutschland)', labelTimeUnknown: 'Ich kenne meine genaue Geburtszeit nicht',
    genderMale: 'Männlich', genderFemale: 'Weiblich', genderOther: 'Keine Angabe',
    disclaimerText: 'Einige Lesungen können ungefähr sein.',
    btnCalculate: 'Meinen Weg Berechnen', btnCalculating: 'Berechnung läuft...',
    gridLifePath: 'Lebenszahl', gridNameNumber: 'Namenszahl', gridSoulUrge: 'Seelenimpuls', gridPersonality: 'Persönlichkeit',
    titleVedic: '✦ Vedische Lesung', labelMoonSign: 'Mondzeichen', labelBirthStar: 'Geburtsstern', labelCurrentDasha: 'Aktueller Dasha-Zyklus', labelPada: 'Pada', labelYears: 'Jahre',
    premiumText: 'Ihr vollständiger vedischer Bericht enthält Beziehungsanalyse, Planetenenergien, detaillierte Dasha-Analyse und Ihr persönliches Seelen-Blueprint-PDF.',
    btnReport: 'Vollständigen Bericht anfordern — 2,99 €', btnLoading: 'Laden...',
    paymentNote: 'Sofortiger PDF-Download • Sichere Zahlung',
    errorText: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.', errorPayment: 'Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.'
  },
  hi: {
    placeholderName: 'अपना पूरा नाम दर्ज करें', placeholderDob: 'अपनी जन्म तिथि चुनें',
    placeholderPlace: 'जन्म स्थान (जैसे मुंबई, भारत)', labelTimeUnknown: 'मुझे अपना सटीक जन्म समय नहीं पता',
    genderMale: 'पुरुष', genderFemale: 'महिला', genderOther: 'बताना नहीं चाहता',
    disclaimerText: 'कुछ पठन अनुमानित हो सकते हैं।',
    btnCalculate: 'मेरा पथ खोजें', btnCalculating: 'गणना हो रही है...',
    gridLifePath: 'जीवन पथ', gridNameNumber: 'नाम अंक', gridSoulUrge: 'आत्मा इच्छा', gridPersonality: 'व्यक्तित्व',
    titleVedic: '✦ वैदिक पठन', labelMoonSign: 'चंद्र राशि', labelBirthStar: 'जन्म नक्षत्र', labelCurrentDasha: 'वर्तमान महादशा', labelPada: 'पाद', labelYears: 'वर्ष',
    premiumText: 'आपकी संपूर्ण वैदिक रिपोर्ट में संबंध अनुकूलता, सहायक ऊर्जाएं, विस्तृत दशा विश्लेषण और आत्मा का ब्लूप्रिंट PDF शामिल है।',
    btnReport: 'पूर्ण रिपोर्ट प्राप्त करें — €2.99', btnLoading: 'लोड हो रहा है...',
    paymentNote: 'तत्काल PDF डाउनलोड • सुरक्षित भुगतान',
    errorText: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।', errorPayment: 'भुगतान विफल रहा। कृपया पुनः प्रयास करें।'
  },
  ar: {
    placeholderName: 'أدخل اسمك الكامل', placeholderDob: 'اختر تاريخ ميلادك',
    placeholderPlace: 'مكان الميلاد (مثال: القاهرة، مصر)', labelTimeUnknown: 'لا أعرف وقت ميلادي بالضبط',
    genderMale: 'ذكر', genderFemale: 'أنثى', genderOther: 'أفضل عدم الإفصاح',
    disclaimerText: 'قد تكون بعض القراءات تقريبية.',
    btnCalculate: 'احسب مسار حياتي', btnCalculating: 'جاري الحساب...',
    gridLifePath: 'مسار الحياة', gridNameNumber: 'رقم الاسم', gridSoulUrge: 'رغبة الروح', gridPersonality: 'الشخصية',
    titleVedic: '✦ القراءة الفيدية', labelMoonSign: 'البرج القمري', labelBirthStar: 'نجم الميلاد', labelCurrentDasha: 'دورة الوقت الحالية (داشا)', labelPada: 'بادا', labelYears: 'سنوات',
    premiumText: 'يتضمن تقريرك الفيدي الكامل توافق العلاقات، الطاقات الكوكبية، تحليل دورة الوقت (داشا)، وكتيب PDF لمخطط روحك.',
    btnReport: 'احصل على التقرير الكامل — 2.99 €', btnLoading: 'جاري التحميل...',
    paymentNote: 'تحميل PDF فوري • دفع آمن',
    errorText: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.', errorPayment: 'فشل الدفع. يرجى المحاولة مرة أخرى.'
  },
}

// ─── Card swipe CSS ───────────────────────────────────────────────────────────
const CARD_CSS = `
  .swipe-outer { background:#F5F3EF; padding:0.75rem 1rem 2rem; min-height:460px; margin-top:24px; position:relative; z-index:10; }
  .progress-dots { display:flex; justify-content:center; gap:8px; margin-bottom:1.5rem; }
  .pdot { height:8px; border-radius:4px; transition:all 0.25s; background:#D0D0D0; width:8px; }
  .pdot.done   { background:#B07A10; width:8px; }
  .pdot.active { background:#0A0A0A; width:22px; }
  .swipe-wrap { position:relative; max-width:560px; margin:0 auto; min-height:340px; }
  .swipe-card { position:absolute; top:0; left:0; right:0; background:#FFFFFF; border-radius:20px; box-shadow:0 8px 40px rgba(0,0,0,0.08); padding:1.75rem 1.75rem 1.5rem; transition:transform 300ms ease-out,opacity 300ms ease-out; }
  .sc-active     { transform:translateX(0);     opacity:1;  pointer-events:auto; }
  .sc-enter      { transform:translateX(100%);  opacity:0;  pointer-events:none; }
  .sc-exit       { transform:translateX(-100%); opacity:0;  pointer-events:none; }
  .sc-back-enter { transform:translateX(-100%); opacity:0;  pointer-events:none; }
  .sc-back-exit  { transform:translateX(100%);  opacity:0;  pointer-events:none; }
  .cq { font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:600; color:#0A0A0A; margin-bottom:1.25rem; line-height:1.3; }
  .cinput { width:100%; background:#F7F7F7; border:1.5px solid #D0D0D0; border-radius:10px; color:#0A0A0A; font-size:0.95rem; padding:0.7rem 1rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
  .cinput:focus { border-color:#B07A10; }
  .cinput::placeholder { color:#A0A0A0; }
  .chint { font-size:0.7rem; color:#6B6B6B; margin-top:0.4rem; }
  .pada-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:0.5rem; margin-bottom:0.75rem; }
  .pada-btn { background:#FAFAFA; border:1.5px solid #E0E0E0; border-radius:12px; cursor:pointer; padding:0.65rem 0.3rem; text-align:center; transition:all 0.18s; }
  .pada-btn:hover,.pada-btn.sel { background:#FDF3E0; border-color:#B07A10; box-shadow:0 3px 12px rgba(176,122,16,0.12); }
  .pada-emoji { font-size:1.6rem; display:block; }
  .pada-label { font-size:0.65rem; font-weight:700; color:#0A0A0A; display:block; margin-top:3px; }
  .pada-time  { font-size:0.58rem; color:#6B6B6B; display:block; }
  .pada-name  { font-size:0.58rem; color:#B07A10; font-weight:600; display:block; }
  .time-exact-wrap { margin-bottom:0.4rem; }
  .time-exact-toggle { background:none; border:none; color:#6B6B6B; cursor:pointer; font-size:0.7rem; text-decoration:underline; padding:0; margin-bottom:0.4rem; display:block; }
  .time-exact-toggle:hover { color:#B07A10; }
  .time-row { display:flex; gap:0.5rem; align-items:center; margin-bottom:0.4rem; }
  .time-row .cinput { flex:1; margin:0; }
  .ampm-sel { background:#F7F7F7; border:1.5px solid #D0D0D0; border-radius:10px; color:#0A0A0A; font-size:0.85rem; padding:0.65rem 0.5rem; outline:none; }
  .dklink { background:none; border:none; color:#6B6B6B; cursor:pointer; font-size:0.72rem; text-decoration:underline; padding:0; }
  .dklink:hover { color:#B07A10; }
  .dob-row { display:grid; grid-template-columns:1fr 1.5fr 1.2fr; gap:0.5rem; margin-bottom:0.75rem; }
  .dob-sel { background:#F7F7F7; border:1.5px solid #D0D0D0; border-radius:10px; color:#0A0A0A; font-size:0.85rem; padding:0.65rem 0.4rem; outline:none; width:100%; appearance:none; text-align:center; }
  .dob-sel:focus { border-color:#B07A10; }
  .gender-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.65rem; margin-bottom:0.75rem; }
  .gender-btn { background:#FAFAFA; border:1.5px solid #E0E0E0; border-radius:14px; cursor:pointer; padding:1.1rem 0.4rem; text-align:center; transition:all 0.18s; }
  .gender-btn:hover { background:#FDF3E0; border-color:#B07A10; }
  .gender-emoji { font-size:2rem; display:block; margin-bottom:5px; }
  .gender-label { font-size:0.72rem; font-weight:700; color:#0A0A0A; }
  .place-chips { display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.65rem; }
  .place-chip { background:#F7F7F7; border:1.5px solid #E0E0E0; border-radius:20px; cursor:pointer; font-size:0.72rem; padding:0.28rem 0.75rem; color:#1A1A1A; transition:all 0.15s; }
  .place-chip:hover,.place-chip.sel { background:#FDF3E0; border-color:#B07A10; }
  .place-bc { font-size:0.68rem; color:#6B6B6B; margin-bottom:0.5rem; }
  .place-bc span { color:#B07A10; }
  .dis-pop { background:#FFFBF0; border:1.5px solid #C8901A; border-radius:10px; padding:0.85rem 1rem; margin-top:0.6rem; font-size:0.72rem; color:#3D3D3D; line-height:1.6; animation:fadeIn 0.2s ease; }
  .dis-btns { display:flex; gap:0.5rem; margin-top:0.5rem; flex-wrap:wrap; }
  .dis-btn { background:none; border:1px solid #D0D0D0; border-radius:6px; cursor:pointer; font-size:0.68rem; padding:0.28rem 0.65rem; color:#3D3D3D; transition:all 0.15s; }
  .dis-btn:hover { border-color:#B07A10; color:#B07A10; }
  .dis-btn.primary { background:#0A0A0A; color:#fff; border-color:#0A0A0A; }
  .dis-btn.primary:hover { background:#B07A10; border-color:#B07A10; }
  .card-nav { display:flex; justify-content:space-between; align-items:center; margin-top:1.1rem; }
  .c-back { background:none; border:none; color:#6B6B6B; cursor:pointer; font-size:0.72rem; letter-spacing:0.06em; padding:0; }
  .c-next { background:#0A0A0A; border:none; border-radius:8px; color:#fff; cursor:pointer; font-size:0.72rem; font-weight:700; letter-spacing:0.1em; padding:0.55rem 1.3rem; text-transform:uppercase; transition:background 0.18s; }
  .c-next:hover { background:#B07A10; }
  .c-next:disabled { opacity:0.4; cursor:not-allowed; }
  .c-next.gold { background:#B07A10; font-size:0.78rem; padding:0.65rem 1.5rem; }
  .c-next.gold:hover { background:#8A5E0A; }
  .numbers-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:0.75rem; margin-bottom:1rem; }
  .number-box { background:#F7F5F0; border-radius:14px; padding:1rem; text-align:center; }
  .number-value { font-family:'Cormorant Garamond',serif; font-size:2.4rem; font-weight:700; color:#B07A10; line-height:1; }
  .number-label { font-size:0.65rem; font-weight:700; color:#6B6B6B; letter-spacing:0.08em; text-transform:uppercase; margin-top:4px; }
  .meaning { font-size:0.82rem; color:#3D3D3D; line-height:1.7; margin-bottom:1rem; }
  .vedic-section { background:#FAFAF8; border:1px solid #E8E4DC; border-radius:12px; padding:0.9rem 1rem; margin-bottom:1rem; }
  .vedic-title { font-family:'Cormorant Garamond',serif; font-size:1rem; font-weight:600; color:#B07A10; margin-bottom:0.5rem; }
  .vedic-row { display:flex; justify-content:space-between; font-size:0.73rem; padding:0.3rem 0; border-bottom:1px solid #EEEBE3; color:#3D3D3D; }
  .vedic-row:last-child { border-bottom:none; }
  .premium-blur { font-size:0.75rem; color:#6B6B6B; line-height:1.7; margin-bottom:0.9rem; filter:blur(3.5px); user-select:none; }
  .btn-primary { width:100%; background:#0A0A0A; border:none; border-radius:10px; color:#fff; cursor:pointer; font-size:0.85rem; font-weight:700; letter-spacing:0.08em; padding:0.85rem; text-transform:uppercase; transition:background 0.18s; }
  .btn-primary:hover { background:#B07A10; }
  .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
  .payment-note { font-size:0.65rem; color:#9B9B9B; text-align:center; margin-top:0.5rem; }
  .error { color:#C0392B; font-size:0.78rem; }
  .loading-state { text-align:center; padding:2rem 1rem; }
  .loading-spinner { width:36px; height:36px; border:3px solid #E8E4DC; border-top-color:#B07A10; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 0.75rem; }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
  @media(max-width:600px){ .swipe-outer{margin-top:18px;padding-top:0.65rem;} .pada-grid{grid-template-columns:repeat(2,1fr);} .cq{font-size:1.15rem;} .swipe-card{padding:1.4rem 1.1rem 1.2rem;} .numbers-grid{grid-template-columns:repeat(2,1fr);} }
`

// ─── Data ─────────────────────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = Array.from({length:31},(_,i)=>String(i+1))
const YEARS  = Array.from({length:100},(_,i)=>String(new Date().getFullYear()-i))

const POPULAR_COUNTRIES = [
  '🇮🇳 India','🇺🇸 USA','🇬🇧 UK','🇦🇪 UAE','🇨🇦 Canada',
  '🇦🇺 Australia','🇸🇬 Singapore','🇲🇾 Malaysia','🇵🇰 Pakistan',
  '🇧🇩 Bangladesh','🇱🇰 Sri Lanka','🇳🇬 Nigeria','🇿🇦 South Africa','🇵🇭 Philippines',
]

const INDIA_STATES = [
  'Kerala','Tamil Nadu','Karnataka','Maharashtra','Delhi','Gujarat',
  'Rajasthan','Uttar Pradesh','West Bengal','Punjab','Andhra Pradesh',
  'Telangana','Odisha','Bihar','Madhya Pradesh','Assam','Goa',
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function Calculator({ lang }: CalculatorProps) {
  const t = CALC_LOCALIZATION[lang] ?? CALC_LOCALIZATION['en']

  const [name,          setName]          = useState('')
  const [dobDay,        setDobDay]        = useState('')
  const [dobMonth,      setDobMonth]      = useState('')
  const [dobYear,       setDobYear]       = useState('')
  const [birthTime,     setBirthTime]     = useState('')
  const [ampm,          setAmpm]          = useState('AM')
  const [pada,          setPada]          = useState<1|2|3|4|null>(null)
  const [timeUnknown,   setTimeUnknown]   = useState(false)
  const [showTimeDis,   setShowTimeDis]   = useState(false)
  const [showExactTime, setShowExactTime] = useState(false)
  const [motherTongue,  setMotherTongue]  = useState('')
  const [mtOpen,        setMtOpen]        = useState(false)
  const [,              setGender]        = useState('')
  const [country,       setCountry]       = useState('')
  const [stateVal,      setStateVal]      = useState('')
  const [city,          setCity]          = useState('')
  const [placeStep,     setPlaceStep]     = useState<'country'|'state'|'city'>('country')
  const [countrySearch, setCountrySearch] = useState('')
  const [showPlaceDis,  setShowPlaceDis]  = useState(false)
  const [result,        setResult]        = useState<Result | null>(null)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')
  const [card,          setCard]          = useState(0)
  const [anim,          setAnim]          = useState('sc-active')

  useEffect(() => {
    if (!document.getElementById('khagatara-card-css')) {
      const s = document.createElement('style')
      s.id = 'khagatara-card-css'
      s.textContent = CARD_CSS
      document.head.appendChild(s)
    }
  }, [])

  const dob = dobYear && dobMonth && dobDay
    ? `${dobYear}-${dobMonth.padStart(2,'0')}-${dobDay.padStart(2,'0')}`
    : ''

  const birthPlace = city || stateVal || country.replace(/^.{3}/,'').trim()

  // Time resolution:
  // - If user picked a pada tile, use its midpoint time (exact input is optional/hidden by default)
  // - If user entered exact time, use that
  // - If timeUnknown and no pada, empty string
  const resolvedTime = birthTime
    ? birthTime
    : pada === 1 ? '09:00'
    : pada === 2 ? '15:00'
    : pada === 3 ? '21:00'
    : pada === 4 ? '03:00'
    : ''

  const resolvedAmpm = birthTime
    ? ampm
    : (pada === 1 || pada === 2) ? 'AM' : 'PM'

  // Date is required; birth time stays optional on its own slide.
  const canProceedFromDOB = !!dob

  function buildPayload() {
    return {
      name, dob,
      birth_time: (timeUnknown && !pada && !birthTime) ? '' : resolvedTime,
      ampm: resolvedAmpm,
      birth_place: birthPlace,
      time_unknown: timeUnknown && !pada && !birthTime,
      mother_tongue: motherTongue,
      lang,
    }
  }

  function goNext(next: number, back = false) {
    setAnim(back ? 'sc-back-exit' : 'sc-exit')
    setTimeout(() => {
      setCard(next)
      setAnim(back ? 'sc-back-enter' : 'sc-enter')
      setTimeout(() => setAnim('sc-active'), 20)
    }, 300)
  }

  function goBack() { if (card > 0) goNext(card - 1, true) }

  async function calculate() {
    if (!name || !dob) return
    setLoading(true); setError('')
    // Navigate to the result card immediately, showing loading state
    goNext(6)
    try {
      const res = await fetch('https://khagatara-api.onrender.com/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload())
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setError(t.errorText)
      // Go back to place of birth on error so user can retry
      goNext(5, true)
    }
    setLoading(false)
  }

  async function getFullReport(provider: 'stripe' | 'paypal' = 'stripe') {
    setLoading(true)
    try {
      const endpoint = provider === 'paypal' ? 'create-checkout-paypal' : 'create-checkout'
      const res  = await fetch(`https://khagatara-api.onrender.com/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload())
      })
      const data = await res.json()
      if (!res.ok || !data.checkout_url) throw new Error(data.detail || 'Payment failed')
      const checkoutUrl = new URL(data.checkout_url)
      checkoutUrl.searchParams.set('mother_tongue', motherTongue)
      window.location.href = checkoutUrl.toString()
    } catch (err: unknown) {
      console.error(err); setError(t.errorPayment); alert(t.errorPayment)
    }
    setLoading(false)
  }

  const filtered = POPULAR_COUNTRIES.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const dots = [0,1,2,3,4,5,6]

  return (
    <div className="swipe-outer">
      <div className="progress-dots">
        {dots.map(i => (
          <div key={i} className={`pdot ${i < card ? 'done' : i === card ? 'active' : ''}`} />
        ))}
      </div>

      <div className="swipe-wrap">

        {/* ── Card 0: Name ── */}
        {card === 0 && (
          <div className={`swipe-card ${anim}`}>
            <div className="cq">👤 {t.placeholderName}?</div>
            <input
              className="cinput" type="text"
              placeholder={t.placeholderName}
              value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && name.trim() && goNext(1)}
              autoFocus
            />
            <p className="chint">Your name carries a vibration. Every letter is a number.</p>
            <div className="card-nav">
              <span />
              <button className="c-next" disabled={!name.trim()} onClick={() => goNext(1)}>Next →</button>
            </div>
          </div>
        )}

        {/* ── Card 1: Date of Birth ── */}
        {card === 1 && (
          <div className={`swipe-card ${anim}`}>
            <div className="cq">🎂 Hello {name.split(' ')[0]} — when were you born?</div>
            <div className="dob-row">
              <select className="dob-sel" value={dobDay} onChange={e => setDobDay(e.target.value)}>
                <option value="">DD</option>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select className="dob-sel" value={dobMonth} onChange={e => setDobMonth(e.target.value)}>
                <option value="">Month</option>
                {MONTHS.map((m,i) => <option key={m} value={String(i+1).padStart(2,'0')}>{m}</option>)}
              </select>
              <select className="dob-sel" value={dobYear} onChange={e => setDobYear(e.target.value)}>
                <option value="">YYYY</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <p className="chint">Your date of birth is enough to continue. Birth time comes next.</p>
            <div className="card-nav">
              <button className="c-back" onClick={goBack}>← Back</button>
              <button className="c-next" disabled={!canProceedFromDOB} onClick={() => goNext(2)}>Next →</button>
            </div>
          </div>
        )}

        {/* ── Card 2: Mother Tongue ── */}
        {card === 2 && (
          <div className={`swipe-card ${anim}`}>
            <div className="cq">🌐 {name.split(' ')[0]} — what&apos;s your mother tongue?</div>
            {/* Collapsible dropdown */}
            <div style={{position:'relative',marginBottom:'1rem'}}>
              <button
                onClick={() => setMtOpen(v => !v)}
                style={{
                  width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
                  background:'#F7F7F7', border:'1.5px solid ' + (motherTongue ? '#B07A10' : '#D0D0D0'),
                  borderRadius: mtOpen ? '10px 10px 0 0' : '10px',
                  padding:'0.75rem 1rem', cursor:'pointer', transition:'all 0.2s',
                  fontSize:'1.1rem', color: motherTongue ? '#0A0A0A' : '#A0A0A0',
                }}>
                <span style={{fontFamily: motherTongue ? 'inherit' : 'inherit'}}>
                  {motherTongue
                    ? MOTHER_TONGUE_OPTIONS.find(o => o.code === motherTongue)?.native
                    : 'Select your language…'}
                </span>
                <span style={{
                  display:'inline-block', transition:'transform 0.25s',
                  transform: mtOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  fontSize:'0.85rem', color:'#6B6B6B'
                }}>▼</span>
              </button>
              {mtOpen && (
                <div style={{
                  position:'absolute', top:'100%', left:0, right:0, zIndex:20,
                  background:'#FFFFFF', border:'1.5px solid #B07A10', borderTop:'none',
                  borderRadius:'0 0 10px 10px',
                  boxShadow:'0 8px 24px rgba(0,0,0,0.1)',
                  maxHeight:'260px', overflowY:'auto',
                  animation:'fadeIn 0.18s ease',
                }}>
                  {MOTHER_TONGUE_OPTIONS.map((opt, i) => (
                    <button key={opt.code}
                      onClick={() => { setMotherTongue(opt.code); setMtOpen(false) }}
                      style={{
                        width:'100%', display:'flex', alignItems:'center', gap:'0.75rem',
                        background: motherTongue === opt.code ? '#FDF3E0' : 'transparent',
                        border:'none', borderBottom: i < MOTHER_TONGUE_OPTIONS.length - 1 ? '1px solid #F0EDE6' : 'none',
                        padding:'0.7rem 1rem', cursor:'pointer', textAlign:'left',
                        transition:'background 0.15s',
                      }}
                      onMouseEnter={e => { if (motherTongue !== opt.code) (e.currentTarget as HTMLButtonElement).style.background = '#FAF6EE' }}
                      onMouseLeave={e => { if (motherTongue !== opt.code) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                    >
                      <span style={{fontSize:'1.4rem', lineHeight:1}}>{opt.flag}</span>
                      <div>
                        <div style={{fontSize:'1rem', color:'#0A0A0A', lineHeight:1.2}}>{opt.native}</div>
                        <div style={{fontSize:'0.62rem', color:'#9B9B9B', marginTop:'2px', letterSpacing:'0.04em'}}>{opt.english}</div>
                      </div>
                      {motherTongue === opt.code && (
                        <span style={{marginLeft:'auto', color:'#B07A10', fontSize:'0.9rem'}}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="chint" style={{marginBottom:'1.1rem'}}>
              Helps personalise your reading in the right vibration.
            </p>
            <div className="card-nav">
              <button className="c-back" onClick={goBack}>← Back</button>
              <button className="c-next" disabled={!motherTongue} onClick={() => goNext(3)}>Next →</button>
            </div>
          </div>
        )}

        {/* ── Card 3: Time of Birth ── */}
        {card === 3 && (
          <div className={`swipe-card ${anim}`}>
            <div className="cq">⏰ What time were you born?</div>
            <div style={{fontSize:'0.68rem',fontWeight:700,color:'#3D3D3D',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.5rem'}}>
              ⏰ Birth Time <span style={{fontWeight:400,color:'#9B9B9B',letterSpacing:0,textTransform:'none'}}>(optional)</span>
            </div>

            {/* Pada tiles — selecting one is sufficient, exact time is not required */}
            <div className="pada-grid">
              {([
                {p:1,emoji:'🌅',label:'Morning',time:'6AM–12PM'},
                {p:2,emoji:'☀️', label:'Noon',   time:'12PM–6PM'},
                {p:3,emoji:'🌆',label:'Evening',time:'6PM–12AM'},
                {p:4,emoji:'🌙',label:'Night',  time:'12AM–6AM'},
              ] as {p:1|2|3|4,emoji:string,label:string,time:string}[]).map(({p,emoji,label,time}) => (
                <button key={p} className={`pada-btn${pada===p?' sel':''}`}
                  onClick={() => {
                    setPada(p)
                    setTimeUnknown(false)
                    setShowTimeDis(false)
                    // Collapse exact time input when a pada tile is tapped
                    setShowExactTime(false)
                    setBirthTime('')
                  }}>
                  <span className="pada-emoji">{emoji}</span>
                  <span className="pada-label">{label}</span>
                  <span className="pada-time">{time}</span>
                  <span className="pada-name">Pada {p}</span>
                </button>
              ))}
            </div>

            {/* Exact time — shown only if user taps the toggle OR if no pada selected */}
            <div className="time-exact-wrap">
              {!pada && !timeUnknown && (
                <>
                  {!showExactTime ? (
                    <button className="time-exact-toggle" onClick={() => setShowExactTime(true)}>
                      + Enter exact time
                    </button>
                  ) : (
                    <div className="time-row">
                      <input type="time" className="cinput" value={birthTime}
                        onChange={e => { setBirthTime(e.target.value); setPada(null); setTimeUnknown(false) }} />
                      <select className="ampm-sel" value={ampm} onChange={e => setAmpm(e.target.value)}>
                        <option>AM</option><option>PM</option>
                      </select>
                    </div>
                  )}
                </>
              )}
              {pada && (
                <button className="time-exact-toggle" onClick={() => {
                  setShowExactTime(true); setPada(null)
                }}>
                  Enter exact time instead
                </button>
              )}
              {showExactTime && pada === null && (
                <div className="time-row" style={{marginTop:'0.3rem'}}>
                  <input type="time" className="cinput" value={birthTime}
                    onChange={e => { setBirthTime(e.target.value); setTimeUnknown(false) }} />
                  <select className="ampm-sel" value={ampm} onChange={e => setAmpm(e.target.value)}>
                    <option>AM</option><option>PM</option>
                  </select>
                </div>
              )}
            </div>

            <button className="dklink" onClick={() => setShowTimeDis(v => !v)}>{t.labelTimeUnknown}</button>
            {showTimeDis && (
              <div className="dis-pop">
                <strong>⚠️ Birth time affects your Nakshatra Pada</strong> — the quarter defining your
                personality sub-type, career timing and marriage window. Even approximate is better.
                <div className="dis-btns">
                  <button className="dis-btn primary" onClick={() => { setTimeUnknown(true); setPada(null); setBirthTime(''); setShowTimeDis(false); goNext(4) }}>
                    Got it, continue without
                  </button>
                  <button className="dis-btn" onClick={() => setShowTimeDis(false)}>Enter time instead</button>
                </div>
              </div>
            )}
            <div className="card-nav">
              <button className="c-back" onClick={goBack}>← Back</button>
              <button className="c-next" onClick={() => goNext(4)}>Next →</button>
            </div>
          </div>
        )}

        {/* ── Card 4: Gender ── */}
        {card === 4 && (
          <div className={`swipe-card ${anim}`}>
            <div className="cq">✨ You are...</div>
            <div className="gender-grid">
              {([
                {val:'male',       emoji:'👨', label:t.genderMale},
                {val:'female',     emoji:'👩', label:t.genderFemale},
                {val:'prefer_not', emoji:'🌈', label:t.genderOther},
              ] as {val:string,emoji:string,label:string}[]).map(({val,emoji,label}) => (
                <button key={val} className="gender-btn" onClick={() => { setGender(val); goNext(5) }}>
                  <span className="gender-emoji">{emoji}</span>
                  <span className="gender-label">{label}</span>
                </button>
              ))}
            </div>
            <p className="chint" style={{textAlign:'center'}}>Tap one — moves automatically</p>
            <div className="card-nav">
              <button className="c-back" onClick={goBack}>← Back</button>
              <span />
            </div>
          </div>
        )}

        {/* ── Card 5: Place of Birth ── */}
        {card === 5 && (
          <div className={`swipe-card ${anim}`}>
            <div className="cq">🌍 Where were you born?</div>
            {(country || stateVal) && (
              <div className="place-bc">
                {country && <span>{country.replace(/^.{3}/,'').trim()}</span>}
                {stateVal && <> › <span>{stateVal}</span></>}
                {city     && <> › <span>{city}</span></>}
              </div>
            )}
            {placeStep === 'country' && (
              <>
                <input className="cinput" placeholder="🔍 Search country..."
                  value={countrySearch} onChange={e => setCountrySearch(e.target.value)} />
                <div className="place-chips">
                  {filtered.map(c => (
                    <button key={c} className={`place-chip${country===c?' sel':''}`}
                      onClick={() => {
                        setCountry(c)
                        if (c.includes('India')) { setPlaceStep('state') }
                        else { setStateVal(''); setCity(''); calculate() }
                      }}>{c}</button>
                  ))}
                </div>
              </>
            )}
            {placeStep === 'state' && (
              <>
                <div style={{fontSize:'0.68rem',color:'#6B6B6B',marginBottom:'0.5rem'}}>Which state?</div>
                <div className="place-chips">
                  {INDIA_STATES.map(s => (
                    <button key={s} className={`place-chip${stateVal===s?' sel':''}`}
                      onClick={() => { setStateVal(s); setPlaceStep('city') }}>{s}</button>
                  ))}
                </div>
              </>
            )}
            {placeStep === 'city' && (
              <>
                <div style={{fontSize:'0.68rem',color:'#6B6B6B',marginBottom:'0.5rem'}}>Which city or district?</div>
                <input className="cinput" placeholder="e.g. Thrissur, Kochi..."
                  value={city} onChange={e => setCity(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && city.trim() && calculate()} autoFocus />
              </>
            )}
            <button className="dklink" style={{marginTop:'0.6rem'}} onClick={() => setShowPlaceDis(v => !v)}>
              Prefer not to say
            </button>
            {showPlaceDis && (
              <div className="dis-pop">
                <strong>⚠️ Without birthplace</strong>, Moon sign and Ascendant (Lagna) cannot be
                calculated. Nakshatra reading will be approximate.
                <div className="dis-btns">
                  <button className="dis-btn primary" onClick={() => { setShowPlaceDis(false); calculate() }}>
                    Got it, continue without
                  </button>
                  <button className="dis-btn" onClick={() => setShowPlaceDis(false)}>Enter place instead</button>
                </div>
              </div>
            )}
            <div className="card-nav">
              <button className="c-back" onClick={() => {
                if (placeStep==='city')  { setPlaceStep('state');   return }
                if (placeStep==='state') { setPlaceStep('country'); return }
                goBack()
              }}>← Back</button>
              {/* Show calculate button only when place is sufficiently filled */}
              {(placeStep === 'city' && city.trim()) || (placeStep === 'state' && stateVal) || (placeStep === 'country' && country && !country.includes('India')) ? (
                <button className="c-next gold" disabled={loading} onClick={calculate}>
                  {loading ? t.btnCalculating : `✦ ${t.btnCalculate}`}
                </button>
              ) : placeStep === 'city' ? (
                <button className="c-next gold" disabled={!city.trim() || loading} onClick={calculate}>
                  {loading ? t.btnCalculating : `✦ ${t.btnCalculate}`}
                </button>
              ) : null}
            </div>
          </div>
        )}

        {/* ── Card 6: Result (or Loading) ── */}
        {card === 6 && (
          <div className={`swipe-card ${anim}`}>
            {loading || !result ? (
              /* Loading state — shown while API call is in flight */
              <div className="loading-state">
                <div className="loading-spinner" />
                <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.1rem',color:'#0A0A0A',marginBottom:'0.4rem'}}>
                  Reading your stars…
                </div>
                <div style={{fontSize:'0.72rem',color:'#9B9B9B'}}>
                  Calculating your Vedic chart
                </div>
              </div>
            ) : (
              <>
                <div className="numbers-grid">
                  <div className="number-box">
                    <div className="number-value">{result.life_path}</div>
                    <div className="number-label">{t.gridLifePath}</div>
                  </div>
                  <div className="number-box">
                    <div className="number-value">{result.name_number}</div>
                    <div className="number-label">{t.gridNameNumber}</div>
                  </div>
                  <div className="number-box">
                    <div className="number-value">{result.soul_urge}</div>
                    <div className="number-label">{t.gridSoulUrge}</div>
                  </div>
                  <div className="number-box">
                    <div className="number-value">{result.personality}</div>
                    <div className="number-label">{t.gridPersonality}</div>
                  </div>
                </div>
                <p className="meaning">{result.meaning}</p>
                <div className="vedic-section">
                  <div className="vedic-title">{t.titleVedic}</div>
                  <div className="vedic-row"><span>{t.labelMoonSign}</span><span>{result.rashi}</span></div>
                  <div className="vedic-row">
                    <span>{t.labelBirthStar}</span>
                    <span>{result.nakshatra} ({t.labelPada} {result.nakshatra_pada})</span>
                  </div>
                  <div className="vedic-row">
                    <span>{t.labelCurrentDasha}</span>
                    <span>{result.dasha_lord} ({result.dasha_years} {t.labelYears})</span>
                  </div>
                </div>
                <div className="premium-blur">{t.premiumText}</div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <button className="btn-primary" onClick={() => getFullReport('stripe')} disabled={loading}>
                    {loading ? t.btnLoading : `${t.btnReport} — Card`}
                  </button>
                  <button
                    className="btn-primary"
                    style={{ background: '#003087' }}
                    onClick={() => getFullReport('paypal')}
                    disabled={loading}
                  >
                    {loading ? t.btnLoading : `${t.btnReport} — PayPal`}
                  </button>
                </div>
                <p className="payment-note">{t.paymentNote}</p>
                <div className="card-nav" style={{marginTop:'0.5rem'}}>
                  <button className="c-back" onClick={() => { setResult(null); setCard(0); setAnim('sc-active') }}>
                    ← Start over
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {error && <p className="error" style={{marginTop:'1rem',textAlign:'center'}}>{error}</p>}
      </div>
    </div>
  )
}
