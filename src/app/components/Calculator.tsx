'use client'
import { useState } from 'react'

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

// Simple translation dictionary for the calculator UI
const CALC_LOCALIZATION: Record<string, Record<string, string>> = {
  en: {
    placeholderName: 'Enter your full name',
    placeholderDob: 'Select your birth date',
    placeholderPlace: 'Place of birth (e.g. Thrissur, India)',
    labelTimeUnknown: "I don't know my exact birth time",
    genderMale: 'Male', genderFemale: 'Female', genderOther: 'Prefer not to say',
    disclaimerText: 'Some readings may be approximate due to missing birth details. For accurate Nakshatra, Pada, Lagna, and Dasha calculations, exact birth time and birthplace are recommended.',
    btnCalculate: 'Calculate My Path', btnCalculating: 'Calculating...',
    gridLifePath: 'Life Path', gridNameNumber: 'Name Number', gridSoulUrge: 'Soul Urge', gridPersonality: 'Personality',
    titleVedic: '✦ Vedic Reading', labelMoonSign: 'Moon Sign', labelBirthStar: 'Birth Star', labelCurrentDasha: 'Current Dasha', labelPada: 'Pada', labelYears: 'yrs',
    premiumText: 'Your full Vedic report includes complete relationship compatibility, supportive planetary energies, detailed time cycle (Dasha) analysis, and your complete personal soul blueprint PDF.',
    btnReport: 'Get Full Report — €2.99', btnLoading: 'Loading...',
    paymentNote: 'Instant PDF download • Secure payment',
    errorText: 'Something went wrong. Please try again.', errorPayment: 'Payment failed. Please try again.'
  },
  es: {
    placeholderName: 'Ingresa tu nombre completo',
    placeholderDob: 'Selecciona tu fecha de nacimiento',
    placeholderPlace: 'Lugar de nacimiento (ej. Madrid, España)',
    labelTimeUnknown: 'No sé mi hora exacta de nacimiento',
    genderMale: 'Masculino', genderFemale: 'Femenino', genderOther: 'Prefiero no decirlo',
    disclaimerText: 'Algunas lecturas pueden ser aproximadas. Para cálculos precisos de Nakshatra, Pada, Lagna y Dasha, se recomienda la hora y lugar exactos de nacimiento.',
    btnCalculate: 'Calcular Mi Camino', btnCalculating: 'Calculando...',
    gridLifePath: 'Camino de Vida', gridNameNumber: 'Número del Nombre', gridSoulUrge: 'Impulso del Alma', gridPersonality: 'Personalidad',
    titleVedic: '✦ Lectura Védica', labelMoonSign: 'Signo Lunar', labelBirthStar: 'Estrella Natal', labelCurrentDasha: 'Ciclo Actual (Dasha)', labelPada: 'Pada', labelYears: 'años',
    premiumText: 'Tu informe védico completo incluye compatibilidad de relaciones, energías planetarias, análisis detallado del ciclo de tiempo (Dasha) y tu PDF del mapa del alma.',
    btnReport: 'Obtener Informe Completo — €2.99', btnLoading: 'Cargando...',
    paymentNote: 'Descarga PDF instantánea • Pago seguro',
    errorText: 'Algo salió mal. Por favor intenta de nuevo.', errorPayment: 'El pago falló. Por favor intenta de nuevo.'
  },
  pt: {
    placeholderName: 'Insira seu nome completo',
    placeholderDob: 'Selecione sua data de nascimento',
    placeholderPlace: 'Local de nascimento (ex. Lisboa, Portugal)',
    labelTimeUnknown: 'Não sei meu horário exato de nascimento',
    genderMale: 'Masculino', genderFemale: 'Feminino', genderOther: 'Prefiro não dizer',
    disclaimerText: 'Algumas leituras podem ser aproximadas. Para cálculos precisos de Nakshatra, Pada, Lagna e Dasha, recomenda-se hora e local exatos de nascimento.',
    btnCalculate: 'Calcular Meu Caminho', btnCalculating: 'Calculando...',
    gridLifePath: 'Caminho de Vida', gridNameNumber: 'Número do Nome', gridSoulUrge: 'Desejo da Alma', gridPersonality: 'Personalidade',
    titleVedic: '✦ Leitura Védica', labelMoonSign: 'Signo Lunar', labelBirthStar: 'Estrela de Nascimento', labelCurrentDasha: 'Ciclo Atual (Dasha)', labelPada: 'Pada', labelYears: 'anos',
    premiumText: 'Seu relatório védico completo inclui compatibilidade de relacionamento, energias planetárias, análise detalhada do ciclo de tempo (Dasha) e o PDF do seu mapa da alma.',
    btnReport: 'Obter Relatório Completo — €2.99', btnLoading: 'Carregando...',
    paymentNote: 'Download instantâneo em PDF • Pagamento seguro',
    errorText: 'Algo deu errado. Por favor, tente novamente.', errorPayment: 'Falha no pagamento. Por favor, tente novamente.'
  },
  fr: {
    placeholderName: 'Entrez votre nom complet',
    placeholderDob: 'Sélectionnez votre date de naissance',
    placeholderPlace: 'Lieu de naissance (ex. Paris, France)',
    labelTimeUnknown: "Je ne connais pas mon heure exacte de naissance",
    genderMale: 'Homme', genderFemale: 'Femme', genderOther: 'Préfère ne pas dire',
    disclaimerText: "Certaines lectures peuvent être approximatives. Pour des calculs précis de Nakshatra, Pada, Lagna et Dasha, l'heure et le lieu exacts de naissance sont recommandés.",
    btnCalculate: 'Calculer Mon Chemin', btnCalculating: 'Calcul en cours...',
    gridLifePath: 'Chemin de Vie', gridNameNumber: 'Nombre du Nom', gridSoulUrge: "Désir de l'Âme", gridPersonality: 'Personnalité',
    titleVedic: '✦ Lecture Védique', labelMoonSign: 'Signe Lunaire', labelBirthStar: 'Étoile de Naissance', labelCurrentDasha: 'Cycle Actuel (Dasha)', labelPada: 'Pada', labelYears: 'ans',
    premiumText: "Votre rapport védique complet comprend la compatibilité relationnelle, les énergies planétaires, l'analyse du cycle temporel (Dasha) et votre PDF du plan de l'âme.",
    btnReport: 'Obtenir le Rapport Complet — 2,99 €', btnLoading: 'Chargement...',
    paymentNote: 'Téléchargement PDF instantané • Paiement sécurisé',
    errorText: 'Une erreur est survenue. Veuillez réessayer.', errorPayment: 'Échec du paiement. Veuillez réessayer.'
  },
  it: {
    placeholderName: 'Inserisci il tuo nome completo',
    placeholderDob: 'Seleziona la tua data di nascita',
    placeholderPlace: 'Luogo di nascita (es. Roma, Italia)',
    labelTimeUnknown: 'Non conosco la mia ora esatta di nascita',
    genderMale: 'Maschio', genderFemale: 'Femmina', genderOther: 'Preferisco non dirlo',
    disclaimerText: 'Alcune letture potrebbero essere approssimative. Per calcoli precisi di Nakshatra, Pada, Lagna e Dasha, si consiglia ora e luogo esatti di nascita.',
    btnCalculate: 'Calcola il Mio Cammino', btnCalculating: 'Calcolo in corso...',
    gridLifePath: 'Cammino di Vita', gridNameNumber: 'Numero del Nome', gridSoulUrge: "Desiderio dell'Anima", gridPersonality: 'Personalità',
    titleVedic: '✦ Lettura Vedica', labelMoonSign: 'Segno Lunare', labelBirthStar: 'Stella di Nascita', labelCurrentDasha: 'Ciclo Attuale (Dasha)', labelPada: 'Pada', labelYears: 'anni',
    premiumText: "Il tuo rapporto vedico completo include compatibilità relazionale, energie planetarie, analisi del ciclo temporale (Dasha) e il PDF della tua mappa dell'anima.",
    btnReport: 'Ottieni il Rapporto Completo — €2.99', btnLoading: 'Caricamento...',
    paymentNote: 'Download istantaneo in PDF • Pagamento sicuro',
    errorText: 'Qualcosa è andato storto. Riprova.', errorPayment: 'Pagamento fallito. Riprova.'
  },
  de: {
    placeholderName: 'Geben Sie Ihren vollständigen Namen ein',
    placeholderDob: 'Wählen Sie Ihr Geburtsdatum',
    placeholderPlace: 'Geburtsort (z.B. Berlin, Deutschland)',
    labelTimeUnknown: 'Ich kenne meine genaue Geburtszeit nicht',
    genderMale: 'Männlich', genderFemale: 'Weiblich', genderOther: 'Keine Angabe',
    disclaimerText: 'Einige Lesungen können ungefähr sein. Für genaue Nakshatra-, Pada-, Lagna- und Dasha-Berechnungen werden genaue Geburtszeit und -ort empfohlen.',
    btnCalculate: 'Meinen Weg Berechnen', btnCalculating: 'Berechnung läuft...',
    gridLifePath: 'Lebenszahl', gridNameNumber: 'Namenszahl', gridSoulUrge: 'Seelenimpuls', gridPersonality: 'Persönlichkeit',
    titleVedic: '✦ Vedische Lesung', labelMoonSign: 'Mondzeichen', labelBirthStar: 'Geburtsstern', labelCurrentDasha: 'Aktueller Dasha-Zyklus', labelPada: 'Pada', labelYears: 'Jahre',
    premiumText: 'Ihr vollständiger vedischer Bericht enthält Beziehungsanalyse, Planetenenergien, detaillierte Dasha-Analyse und Ihr persönliches Seelen-Blueprint-PDF.',
    btnReport: 'Vollständigen Bericht anfordern — 2,99 €', btnLoading: 'Laden...',
    paymentNote: 'Sofortiger PDF-Download • Sichere Zahlung',
    errorText: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.', errorPayment: 'Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.'
  },
  hi: {
    placeholderName: 'अपना पूरा नाम दर्ज करें',
    placeholderDob: 'अपनी जन्म तिथि चुनें',
    placeholderPlace: 'जन्म स्थान (जैसे मुंबई, भारत)',
    labelTimeUnknown: 'मुझे अपना सटीक जन्म समय नहीं पता',
    genderMale: 'पुरुष', genderFemale: 'महिला', genderOther: 'बताना नहीं चाहता',
    disclaimerText: 'कुछ पठन अनुमानित हो सकते हैं। सटीक नक्षत्र, पाद, लग्न और दशा गणना के लिए सटीक जन्म समय और स्थान आवश्यक है।',
    btnCalculate: 'मेरा पथ खोजें', btnCalculating: 'गणना हो रही है...',
    gridLifePath: 'जीवन पथ', gridNameNumber: 'नाम अंक', gridSoulUrge: 'आत्मा इच्छा', gridPersonality: 'व्यक्तित्व',
    titleVedic: '✦ वैदिक पठन', labelMoonSign: 'चंद्र राशि', labelBirthStar: 'जन्म नक्षत्र', labelCurrentDasha: 'वर्तमान महादशा', labelPada: 'पाद', labelYears: 'वर्ष',
    premiumText: 'आपकी संपूर्ण वैदिक रिपोर्ट में संबंध अनुकूलता, सहायक ऊर्जाएं, विस्तृत दशा विश्लेषण और आत्मा का ब्लूप्रिंट PDF शामिल है।',
    btnReport: 'पूर्ण रिपोर्ट प्राप्त करें — €2.99', btnLoading: 'लोड हो रहा है...',
    paymentNote: 'तत्काल PDF डाउनलोड • सुरक्षित भुगतान',
    errorText: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।', errorPayment: 'भुगतान विफल रहा। कृपया पुनः प्रयास करें।'
  },
  ar: {
    placeholderName: 'أدخل اسمك الكامل',
    placeholderDob: 'اختر تاريخ ميلادك',
    placeholderPlace: 'مكان الميلاد (مثال: القاهرة، مصر)',
    labelTimeUnknown: 'لا أعرف وقت ميلادي بالضبط',
    genderMale: 'ذكر', genderFemale: 'أنثى', genderOther: 'أفضل عدم الإفصاح',
    disclaimerText: 'قد تكون بعض القراءات تقريبية. للحصول على حسابات دقيقة للنكشاترا والباداا واللاجنا والداشا، يُوصى بمعرفة وقت ومكان الميلاد بدقة.',
    btnCalculate: 'احسب مسار حياتي', btnCalculating: 'جاري الحساب...',
    gridLifePath: 'مسار الحياة', gridNameNumber: 'رقم الاسم', gridSoulUrge: 'رغبة الروح', gridPersonality: 'الشخصية',
    titleVedic: '✦ القراءة الفيدية', labelMoonSign: 'البرج القمري', labelBirthStar: 'نجم الميلاد', labelCurrentDasha: 'دورة الوقت الحالية (داشا)', labelPada: 'بادا', labelYears: 'سنوات',
    premiumText: 'يتضمن تقريرك الفيدي الكامل توافق العلاقات، الطاقات الكوكبية، تحليل مفصل لدورة الوقت (داشا)، وكتيب PDF لمخطط روحك.',
    btnReport: 'احصل على التقرير الكامل — 2.99 €', btnLoading: 'جاري التحميل...',
    paymentNote: 'تحميل PDF فوري • دفع آمن',
    errorText: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.', errorPayment: 'فشل الدفع. يرجى المحاولة مرة أخرى.'
  }
}

interface CalculatorProps {
  lang: string
}

export default function Calculator({ lang }: CalculatorProps) {
  const t = CALC_LOCALIZATION[lang] ?? CALC_LOCALIZATION['en']

  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [ampm, setAmpm] = useState('AM')
  const [birthPlace, setBirthPlace] = useState('')
  const [timeUnknown, setTimeUnknown] = useState(false)
  const [gender, setGender] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const showDisclaimer = timeUnknown || gender === 'prefer_not'

  function buildPayload() {
    return {
      name,
      dob,
      birth_time: timeUnknown ? '' : birthTime,
      ampm,
      birth_place: birthPlace,
      time_unknown: timeUnknown,
    }
  }

  async function calculate() {
    if (!name || !dob) return
    setLoading(true)
    setError('')
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
    }
    setLoading(false)
  }

  async function getFullReport() {
    setLoading(true)
    try {
      const res = await fetch('https://khagatara-api.onrender.com/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload())
      })
      const data = await res.json()
      if (!res.ok || !data.checkout_url) {
        throw new Error(data.detail || 'Payment failed')
      }
      window.location.href = data.checkout_url
    } catch (err: unknown) {
      console.error(err)
      setError(t.errorPayment)
      alert(t.errorPayment)
    }
    setLoading(false)
  }

  return (
    <>
      <div className="card">
        <div className="form-group">
          <input
            type="text"
            placeholder={t.placeholderName}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            placeholder={t.placeholderDob}
            value={dob}
            onChange={e => setDob(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder={t.placeholderPlace}
            value={birthPlace}
            onChange={e => setBirthPlace(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
            <input
              type="time"
              value={birthTime}
              onChange={e => setBirthTime(e.target.value)}
              disabled={timeUnknown}
              style={{flex:1, opacity: timeUnknown ? 0.4 : 1}}
            />
            <select
              value={ampm}
              onChange={e => setAmpm(e.target.value)}
              disabled={timeUnknown}
              style={{
                background:'var(--surface2)', border:'0.5px solid var(--border2)',
                borderRadius:'6px', color:'var(--text)', padding:'0.65rem 0.5rem',
                fontSize:'0.82rem', opacity: timeUnknown ? 0.4 : 1
              }}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <label style={{display:'flex', alignItems:'center', gap:'8px', marginTop:'8px', cursor:'pointer', fontSize:'0.72rem', color:'var(--text-low)'}}>
            <input
              type="checkbox"
              checked={timeUnknown}
              onChange={e => setTimeUnknown(e.target.checked)}
              style={{accentColor:'var(--accent)'}}
            />
            {t.labelTimeUnknown}
          </label>
        </div>
        <div className="form-group">
          <div style={{display:'flex', gap:'16px', flexWrap:'wrap'}}>
            {([['male', t.genderMale],['female', t.genderFemale],['prefer_not', t.genderOther]] as [string,string][]).map(([val, label]) => (
              <label key={val} style={{display:'flex', alignItems:'center', gap:'6px', cursor:'pointer', fontSize:'0.82rem', color: gender === val ? 'var(--accent)' : 'var(--text-low)'}}>
                <input
                  type="radio"
                  name={`gender-${lang}`}
                  value={val}
                  checked={gender === val}
                  onChange={() => setGender(val)}
                  style={{accentColor:'var(--accent)'}}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {showDisclaimer && (
          <div style={{
            background:'var(--surface2)', border:'0.5px solid var(--accent)',
            borderRadius:'8px', padding:'12px 14px', marginBottom:'12px',
            fontSize:'0.72rem', color:'var(--text-mid)', lineHeight:'1.6'
          }}>
            ⚠️ {t.disclaimerText}
          </div>
        )}

        <button
          className="btn-primary"
          onClick={calculate}
          disabled={loading}
        >
          {loading ? t.btnCalculating : t.btnCalculate}
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      {result && (
        <div className="card">
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
            <div className="vedic-row">
              <span>{t.labelMoonSign}</span>
              <span>{result.rashi}</span>
            </div>
            <div className="vedic-row">
              <span>{t.labelBirthStar}</span>
              <span>{result.nakshatra} ({t.labelPada} {result.nakshatra_pada})</span>
            </div>
            <div className="vedic-row">
              <span>{t.labelCurrentDasha}</span>
              <span>{result.dasha_lord} ({result.dasha_years} {t.labelYears})</span>
            </div>
          </div>

          <div className="premium-blur">
            {t.premiumText}
          </div>

          <button
            className="btn-primary"
            onClick={getFullReport}
            disabled={loading}
          >
            {loading ? t.btnLoading : t.btnReport}
          </button>
          <p className="payment-note">{t.paymentNote}</p>
        </div>
      )}
    </>
  )
}
