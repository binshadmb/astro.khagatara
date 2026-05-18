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
    btnCalculate: 'Calculate My Path',
    btnCalculating: 'Calculating...',
    gridLifePath: 'Life Path',
    gridNameNumber: 'Name Number',
    gridSoulUrge: 'Soul Urge',
    gridPersonality: 'Personality',
    titleVedic: '✦ Vedic Reading',
    labelMoonSign: 'Moon Sign',
    labelBirthStar: 'Birth Star',
    labelCurrentDasha: 'Current Dasha',
    labelPada: 'Pada',
    labelYears: 'yrs',
    premiumText: 'Your full Vedic report includes complete relationship compatibility, supportive planetary energies, detailed time cycle (Dasha) analysis, and your complete personal soul blueprint PDF.',
    btnReport: 'Get Full Report — €2.99',
    btnLoading: 'Loading...',
    paymentNote: 'Instant PDF download • Secure payment',
    errorText: 'Something went wrong. Please try again.',
    errorPayment: 'Payment failed. Please try again.'
  },
  es: {
    placeholderName: 'Ingresa tu nombre completo',
    placeholderDob: 'Selecciona tu fecha de nacimiento',
    btnCalculate: 'Calcular Mi Camino',
    btnCalculating: 'Calculando...',
    gridLifePath: 'Camino de Vida',
    gridNameNumber: 'Número del Nombre',
    gridSoulUrge: 'Impulso del Alma',
    gridPersonality: 'Personalidad',
    titleVedic: '✦ Lectura Védica',
    labelMoonSign: 'Signo Lunar',
    labelBirthStar: 'Estrella Natal',
    labelCurrentDasha: 'Ciclo Actual (Dasha)',
    labelPada: 'Pada',
    labelYears: 'años',
    premiumText: 'Tu informe védico completo incluye compatibilidad de relaciones, energías planetarias de armonización, análisis detallado del ciclo de tiempo (Dasha) y tu PDF completo del mapa del alma.',
    btnReport: 'Obtener Informe Completo — €2.99',
    btnLoading: 'Cargando...',
    paymentNote: 'Descarga PDF instantánea • Pago seguro',
    errorText: 'Algo salió mal. Por favor intenta de nuevo.',
    errorPayment: 'El pago falló. Por favor intenta de nuevo.'
  },
  pt: {
    placeholderName: 'Insira seu nome completo',
    placeholderDob: 'Selecione sua data de nascimento',
    btnCalculate: 'Calcular Meu Caminho',
    btnCalculating: 'Calculando...',
    gridLifePath: 'Caminho de Vida',
    gridNameNumber: 'Número do Nome',
    gridSoulUrge: 'Desejo da Alma',
    gridPersonality: 'Personalidade',
    titleVedic: '✦ Leitura Védica',
    labelMoonSign: 'Signo Lunar',
    labelBirthStar: 'Estrela de Nascimento',
    labelCurrentDasha: 'Ciclo Atual (Dasha)',
    labelPada: 'Pada',
    labelYears: 'anos',
    premiumText: 'Seu relatório védico completo inclui compatibilidade de relacionamento, energias planetárias de suporte, análise detalhada do ciclo de tempo (Dasha) e o PDF do seu mapa da alma.',
    btnReport: 'Obter Relatório Completo — €2.99',
    btnLoading: 'Carregando...',
    paymentNote: 'Download instantâneo em PDF • Pagamento seguro',
    errorText: 'Algo deu errado. Por favor, tente novamente.',
    errorPayment: 'Falha no pagamento. Por favor, tente novamente.'
  },
  fr: {
    placeholderName: 'Entrez votre nom complet',
    placeholderDob: 'Sélectionnez votre date de naissance',
    btnCalculate: 'Calculer Mon Chemin',
    btnCalculating: 'Calcul en cours...',
    gridLifePath: 'Chemin de Vie',
    gridNameNumber: 'Nombre du Nom',
    gridSoulUrge: 'Désir de l\'Âme',
    gridPersonality: 'Personnalité',
    titleVedic: '✦ Lecture Védique',
    labelMoonSign: 'Signe Lunaire',
    labelBirthStar: 'Étoile de Naissance',
    labelCurrentDasha: 'Cycle Actuel (Dasha)',
    labelPada: 'Pada',
    labelYears: 'ans',
    premiumText: 'Votre rapport védique complet comprend la compatibilité relationnelle, les énergies planétaires de soutien, l\'analyse détaillée du cycle temporel (Dasha) et votre PDF du plan de l\'âme.',
    btnReport: 'Obtenir le Rapport Complet — 2,99 €',
    btnLoading: 'Chargement...',
    paymentNote: 'Téléchargement PDF instantané • Paiement sécurisé',
    errorText: 'Une erreur est survenue. Veuillez réessayer.',
    errorPayment: 'Échec du paiement. Veuillez réessayer.'
  },
  it: {
    placeholderName: 'Inserisci il tuo nome completo',
    placeholderDob: 'Seleziona la tua data di nascita',
    btnCalculate: 'Calcola il Mio Cammino',
    btnCalculating: 'Calcolo in corso...',
    gridLifePath: 'Cammino di Vita',
    gridNameNumber: 'Numero del Nome',
    gridSoulUrge: 'Desiderio dell\'Anima',
    gridPersonality: 'Personalità',
    titleVedic: '✦ Lettura Vedica',
    labelMoonSign: 'Segno Lunare',
    labelBirthStar: 'Stella di Nascita',
    labelCurrentDasha: 'Ciclo Attuale (Dasha)',
    labelPada: 'Pada',
    labelYears: 'anni',
    premiumText: 'Il tuo rapporto vedico completo include compatibilità relazionale, energie planetarie di supporto, analisi dettagliata del ciclo temporale (Dasha) e il PDF della tua mappa dell\'anima.',
    btnReport: 'Ottieni il Rapporto Completo — €2.99',
    btnLoading: 'Caricamento...',
    paymentNote: 'Download istantaneo in PDF • Pagamento sicuro',
    errorText: 'Qualcosa è andato storto. Riprova.',
    errorPayment: 'Pagamento fallito. Riprova.'
  },
  de: {
    placeholderName: 'Geben Sie Ihren vollständigen Namen ein',
    placeholderDob: 'Wählen Sie Ihr Geburtsdatum',
    btnCalculate: 'Meinen Weg Berechnen',
    btnCalculating: 'Berechnung läuft...',
    gridLifePath: 'Lebenszahl',
    gridNameNumber: 'Namenszahl',
    gridSoulUrge: 'Seelenimpuls',
    gridPersonality: 'Persönlichkeit',
    titleVedic: '✦ Vedische Lesung',
    labelMoonSign: 'Mondzeichen',
    labelBirthStar: 'Geburtsstern',
    labelCurrentDasha: 'Aktueller Dasha-Zyklus',
    labelPada: 'Pada',
    labelYears: 'Jahre',
    premiumText: 'Ihr vollständiger vedischer Bericht enthält Beziehungsanalyse, unterstützende Planetenenergien, detaillierte Dasha-Zeitzyklus-Analyse und Ihr persönliches Seelen-Blueprint-PDF.',
    btnReport: 'Vollständigen Bericht anfordern — 2,99 €',
    btnLoading: 'Laden...',
    paymentNote: 'Sofortiger PDF-Download • Sichere Zahlung',
    errorText: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    errorPayment: 'Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.'
  },
  hi: {
    placeholderName: 'अपना पूरा नाम दर्ज करें',
    placeholderDob: 'अपनी जन्म तिथि चुनें',
    btnCalculate: 'मेरा पथ खोजें',
    btnCalculating: 'गणना हो रही है...',
    gridLifePath: 'जीवन पथ',
    gridNameNumber: 'नाम अंक',
    gridSoulUrge: 'आत्मा इच्छा',
    gridPersonality: 'व्यक्तित्व',
    titleVedic: '✦ वैदिक पठन',
    labelMoonSign: 'चंद्र राशि',
    labelBirthStar: 'जन्म नक्षत्र',
    labelCurrentDasha: 'वर्तमान महादशा',
    labelPada: 'पाद',
    labelYears: 'वर्ष',
    premiumText: 'आपकी संपूर्ण वैदिक रिपोर्ट में संबंध अनुकूलता, सहायक सकारात्मक ऊर्जाएं, विस्तृत समय चक्र (दशा) विश्लेषण और आपकी व्यक्तिगत आत्मा का ब्लूप्रिंट PDF शामिल है।',
    btnReport: 'पूर्ण रिपोर्ट प्राप्त करें — €2.99',
    btnLoading: 'लोड हो रहा है...',
    paymentNote: 'तत्काल PDF डाउनलोड • सुरक्षित भुगतान',
    errorText: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
    errorPayment: 'भुगतान विफल रहा। कृपया पुनः प्रयास करें।'
  },
  ar: {
    placeholderName: 'أدخل اسمك الكامل',
    placeholderDob: 'اختر تاريخ ميلادك',
    btnCalculate: 'احسب مسار حياتي',
    btnCalculating: 'جاري الحساب...',
    gridLifePath: 'مسار الحياة',
    gridNameNumber: 'رقم الاسم',
    gridSoulUrge: 'رغبة الروح',
    gridPersonality: 'الشخصية',
    titleVedic: '✦ القراءة الفيدية',
    labelMoonSign: 'البرج القمري',
    labelBirthStar: 'نجم الميلاد',
    labelCurrentDasha: 'دورة الوقت الحالية (داشا)',
    labelPada: 'بادا',
    labelYears: 'سنوات',
    premiumText: 'يتضمن تقريرك الفيدي الكامل توافق العلاقات، الطاقات الكوكبية الداعمة، تحليل مفصل لدورة الوقت (داشا)، وكتيب PDF الكامل لمخطط روحك.',
    btnReport: 'احصل على التقرير الكامل — 2.99 €',
    btnLoading: 'جاري التحميل...',
    paymentNote: 'تحميل PDF فوري • دفع آمن',
    errorText: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    errorPayment: 'فشل الدفع. يرجى المحاولة مرة أخرى.'
  }
}

interface CalculatorProps {
  lang: string
}

export default function Calculator({ lang }: CalculatorProps) {
  const t = CALC_LOCALIZATION[lang] ?? CALC_LOCALIZATION['en']

  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function calculate() {
    if (!name || !dob) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://khagatara-api.onrender.com/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dob, city: 'London' })
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
        body: JSON.stringify({ name, dob, city: 'London' })
      })
      const data = await res.json()
      if (!res.ok || !data.checkout_url) {
        throw new Error(data.detail || 'Payment failed')
      }
      window.location.href = data.checkout_url
    } catch (err: any) {
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
