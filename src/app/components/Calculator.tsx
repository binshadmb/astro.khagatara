'use client'
import { useState, useEffect } from 'react'

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
  .swipe-outer { background:#F5F3EF; padding:1.5rem 1rem 2rem; min-height:460px; }
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
  @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
  @media(max-width:600px){ .pada-grid{grid-template-columns:repeat(2,1fr);} .cq{font-size:1.15rem;} .swipe-card{padding:1.4rem 1.1rem 1.2rem;} }
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

  const [name,        setName]        = useState('')
  const [dobDay,      setDobDay]      = useState('')
  const [dobMonth,    setDobMonth]    = useState('')
  const [dobYear,     setDobYear]     = useState('')
  const [birthTime,   setBirthTime]   = useState('')
  const [ampm,        setAmpm]        = useState('AM')
  const [pada,        setPada]        = useState<1|2|3|4|null>(null)
  const [timeUnknown, setTimeUnknown] = useState(false)
  const [showTimeDis, setShowTimeDis] = useState(false)
  const [gender,      setGender]      = useState('')
  const [country,     setCountry]     = useState('')
  const [stateVal,    setStateVal]    = useState('')
  const [city,        setCity]        = useState('')
  const [placeStep,   setPlaceStep]   = useState<'country'|'state'|'city'>('country')
  const [countrySearch, setCountrySearch] = useState('')
  const [showPlaceDis,  setShowPlaceDis]  = useState(false)
  const [result,      setResult]      = useState<Result | null>(null)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [card,        setCard]        = useState(0)
  const [anim,        setAnim]        = useState('sc-active')
  const [cssReady,    setCssReady]    = useState(false)

  useEffect(() => {
    if (!cssReady) {
      const s = document.createElement('style')
      s.textContent = CARD_CSS
      document.head.appendChild(s)
      setCssReady(true)
    }
  }, [cssReady])

  const dob = dobYear && dobMonth && dobDay
    ? `${dobYear}-${dobMonth.padStart(2,'0')}-${dobDay.padStart(2,'0')}`
    : ''

  const birthPlace = city || stateVal || country.replace(/^.{3}/,'').trim()

  const resolvedTime = birthTime || (pada===1?'09:00':pada===2?'15:00':pada===3?'21:00':pada===4?'03:00':'')
  const resolvedAmpm = birthTime ? ampm : (pada===1||pada===2)?'AM':'PM'

  function buildPayload() {
    return {
      name, dob,
      birth_time: (timeUnknown && !pada) ? '' : resolvedTime,
      ampm: resolvedAmpm,
      birth_place: birthPlace,
      time_unknown: timeUnknown && !pada,
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
    try {
      const res  = await fetch('https://khagatara-api.onrender.com/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload())
      })
      const data = await res.json()
      setResult(data)
      goNext(4)
    } catch { setError(t.errorText) }
    setLoading(false)
  }

  async function getFullReport() {
    setLoading(true)
    try {
      const res  = await fetch('https://khagatara-api.onrender.com/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload())
      })
      const data = await res.json()
      if (!res.ok || !data.checkout_url) throw new Error(data.detail || 'Payment failed')
      window.location.href = data.checkout_url
    } catch (err: unknown) {
      console.error(err); setError(t.errorPayment); alert(t.errorPayment)
    }
    setLoading(false)
  }

  const filtered = POPULAR_COUNTRIES.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  )

  const dots = [0,1,2,3,4]

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

        {/* ── Card 1: DOB + Time ── */}
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
            <div style={{fontSize:'0.68rem',fontWeight:700,color:'#3D3D3D',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.5rem'}}>
              ⏰ Birth Time
            </div>
            <div className="pada-grid">
              {([
                {p:1,emoji:'🌅',label:'Morning',time:'6AM–12PM'},
                {p:2,emoji:'☀️', label:'Noon',   time:'12PM–6PM'},
                {p:3,emoji:'🌆',label:'Evening',time:'6PM–12AM'},
                {p:4,emoji:'🌙',label:'Night',  time:'12AM–6AM'},
              ] as {p:1|2|3|4,emoji:string,label:string,time:string}[]).map(({p,emoji,label,time}) => (
                <button key={p} className={`pada-btn${pada===p?' sel':''}`}
                  onClick={() => { setPada(p); setTimeUnknown(false); setShowTimeDis(false) }}>
                  <span className="pada-emoji">{emoji}</span>
                  <span className="pada-label">{label}</span>
                  <span className="pada-time">{time}</span>
                  <span className="pada-name">Pada {p}</span>
                </button>
              ))}
            </div>
            <div style={{fontSize:'0.65rem',color:'#6B6B6B',marginBottom:'0.35rem'}}>or exact time:</div>
            <div className="time-row">
              <input type="time" className="cinput" value={birthTime}
                onChange={e => { setBirthTime(e.target.value); setPada(null); setTimeUnknown(false) }} />
              <select className="ampm-sel" value={ampm} onChange={e => setAmpm(e.target.value)}>
                <option>AM</option><option>PM</option>
              </select>
            </div>
            <button className="dklink" onClick={() => setShowTimeDis(v => !v)}>{t.labelTimeUnknown}</button>
            {showTimeDis && (
              <div className="dis-pop">
                <strong>⚠️ Birth time affects your Nakshatra Pada</strong> — the quarter defining your
                personality sub-type, career timing and marriage window. Even approximate is better.
                <div className="dis-btns">
                  <button className="dis-btn primary" onClick={() => { setTimeUnknown(true); setShowTimeDis(false); goNext(2) }}>
                    Got it, continue without
                  </button>
                  <button className="dis-btn" onClick={() => setShowTimeDis(false)}>Enter time instead</button>
                </div>
              </div>
            )}
            <div className="card-nav">
              <button className="c-back" onClick={goBack}>← Back</button>
              <button className="c-next" disabled={!dob} onClick={() => goNext(2)}>Next →</button>
            </div>
          </div>
        )}

        {/* ── Card 2: Gender ── */}
        {card === 2 && (
          <div className={`swipe-card ${anim}`}>
            <div className="cq">✨ You are...</div>
            <div className="gender-grid">
              {([
                {val:'male',       emoji:'👨', label:t.genderMale},
                {val:'female',     emoji:'👩', label:t.genderFemale},
                {val:'prefer_not', emoji:'🌈', label:t.genderOther},
              ] as {val:string,emoji:string,label:string}[]).map(({val,emoji,label}) => (
                <button key={val} className="gender-btn" onClick={() => { setGender(val); goNext(3) }}>
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

        {/* ── Card 3: Place of Birth ── */}
        {card === 3 && (
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
                        else { setStateVal(''); setCity(''); goNext(4) }
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
                  onKeyDown={e => e.key === 'Enter' && city.trim() && goNext(4)} autoFocus />
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
                  <button className="dis-btn primary" onClick={() => { setShowPlaceDis(false); goNext(4) }}>
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
              <button className="c-next gold" disabled={loading} onClick={calculate}>
                {loading ? t.btnCalculating : `✦ ${t.btnCalculate}`}
              </button>
            </div>
          </div>
        )}

        {/* ── Card 4: Result ── */}
        {card === 4 && result && (
          <div className={`swipe-card ${anim}`}>
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
            <button className="btn-primary" onClick={getFullReport} disabled={loading}>
              {loading ? t.btnLoading : t.btnReport}
            </button>
            <p className="payment-note">{t.paymentNote}</p>
            <div className="card-nav" style={{marginTop:'0.5rem'}}>
              <button className="c-back" onClick={() => { setResult(null); goNext(0, true) }}>
                ← Start over
              </button>
            </div>
          </div>
        )}

        {error && <p className="error" style={{marginTop:'1rem',textAlign:'center'}}>{error}</p>}
      </div>
    </div>
  )
}
