/**
 * translate-ui.js
 * Translates Calculator UI strings and BookPromo content for all 99 languages.
 * Outputs:
 *   ui-output/calculator-localization.ts  → drop-in replacement for CALC_LOCALIZATION
 *   ui-output/book-config-translations.ts → drop-in replacement for translations block
 *
 * Usage:
 *   node translate-ui.js              → all 99 languages
 *   node translate-ui.js zh-cn ja ru  → specific languages only
 *
 * Already-translated languages (es, pt, fr, it, de, hi, ar) are skipped automatically.
 */

const fs   = require('fs')
const path = require('path')

// ─── Config ───────────────────────────────────────────────────────────────────

const DELAY_MS   = 350
const OUTPUT_DIR = path.join(__dirname, 'ui-output')

const LANGUAGE_CONFIG = [
  ['en',    'English',             'ltr'],
  ['es',    'Spanish',             'ltr'],
  ['pt',    'Portuguese',          'ltr'],
  ['fr',    'French',              'ltr'],
  ['it',    'Italian',             'ltr'],
  ['de',    'German',              'ltr'],
  ['hi',    'Hindi',               'ltr'],
  ['ar',    'Arabic',              'rtl'],
  ['zh-cn', 'Chinese Simplified',  'ltr'],
  ['ja',    'Japanese',            'ltr'],
  ['ru',    'Russian',             'ltr'],
  ['id',    'Indonesian',          'ltr'],
  ['ko',    'Korean',              'ltr'],
  ['tr',    'Turkish',             'ltr'],
  ['bn',    'Bengali',             'ltr'],
  ['ur',    'Urdu',                'rtl'],
  ['vi',    'Vietnamese',          'ltr'],
  ['th',    'Thai',                'ltr'],
  ['fa',    'Persian',             'rtl'],
  ['ms',    'Malay',               'ltr'],
  ['fil',   'Filipino',            'ltr'],
  ['nl',    'Dutch',               'ltr'],
  ['pl',    'Polish',              'ltr'],
  ['ta',    'Tamil',               'ltr'],
  ['te',    'Telugu',              'ltr'],
  ['mr',    'Marathi',             'ltr'],
  ['gu',    'Gujarati',            'ltr'],
  ['kn',    'Kannada',             'ltr'],
  ['ml',    'Malayalam',           'ltr'],
  ['pa',    'Punjabi',             'ltr'],
  ['ne',    'Nepali',              'ltr'],
  ['uk',    'Ukrainian',           'ltr'],
  ['ro',    'Romanian',            'ltr'],
  ['el',    'Greek',               'ltr'],
  ['cs',    'Czech',               'ltr'],
  ['sv',    'Swedish',             'ltr'],
  ['he',    'Hebrew',              'rtl'],
  ['zh-tw', 'Chinese Traditional', 'ltr'],
  ['no',    'Norwegian',           'ltr'],
  ['da',    'Danish',              'ltr'],
  ['fi',    'Finnish',             'ltr'],
  ['hu',    'Hungarian',           'ltr'],
  ['sk',    'Slovak',              'ltr'],
  ['bg',    'Bulgarian',           'ltr'],
  ['hr',    'Croatian',            'ltr'],
  ['sr',    'Serbian',             'ltr'],
  ['sl',    'Slovenian',           'ltr'],
  ['lt',    'Lithuanian',          'ltr'],
  ['lv',    'Latvian',             'ltr'],
  ['et',    'Estonian',            'ltr'],
  ['ka',    'Georgian',            'ltr'],
  ['hy',    'Armenian',            'ltr'],
  ['az',    'Azerbaijani',         'ltr'],
  ['kk',    'Kazakh',              'ltr'],
  ['uz',    'Uzbek',               'ltr'],
  ['mn',    'Mongolian',           'ltr'],
  ['my',    'Burmese',             'ltr'],
  ['km',    'Khmer',               'ltr'],
  ['si',    'Sinhala',             'ltr'],
  ['am',    'Amharic',             'ltr'],
  ['sw',    'Swahili',             'ltr'],
  ['yo',    'Yoruba',              'ltr'],
  ['ig',    'Igbo',                'ltr'],
  ['ha',    'Hausa',               'ltr'],
  ['zu',    'Zulu',                'ltr'],
  ['af',    'Afrikaans',           'ltr'],
  ['sq',    'Albanian',            'ltr'],
  ['bs',    'Bosnian',             'ltr'],
  ['mk',    'Macedonian',          'ltr'],
  ['mt',    'Maltese',             'ltr'],
  ['cy',    'Welsh',               'ltr'],
  ['gl',    'Galician',            'ltr'],
  ['ca',    'Catalan',             'ltr'],
  ['eu',    'Basque',              'ltr'],
  ['is',    'Icelandic',           'ltr'],
  ['ga',    'Irish',               'ltr'],
  ['be',    'Belarusian',          'ltr'],
  ['ps',    'Pashto',              'rtl'],
  ['sd',    'Sindhi',              'rtl'],
  ['ku',    'Kurdish',             'ltr'],
  ['so',    'Somali',              'ltr'],
  ['mg',    'Malagasy',            'ltr'],
  ['ht',    'Haitian Creole',      'ltr'],
  ['ceb',   'Cebuano',             'ltr'],
  ['jv',    'Javanese',            'ltr'],
  ['su',    'Sundanese',           'ltr'],
  ['xh',    'Xhosa',               'ltr'],
  ['st',    'Sesotho',             'ltr'],
  ['fy',    'Frisian',             'ltr'],
  ['lb',    'Luxembourgish',       'ltr'],
  ['tk',    'Turkmen',             'ltr'],
  ['ky',    'Kyrgyz',              'ltr'],
  ['lo',    'Lao',                 'ltr'],
  ['ti',    'Tigrinya',            'ltr'],
  ['rw',    'Kinyarwanda',         'ltr'],
  ['or',    'Odia',                'ltr'],
  ['as',    'Assamese',            'ltr'],
  ['ug',    'Uyghur',              'rtl'],
  ['sn',    'Shona',               'ltr'],
  ['ny',    'Chichewa',            'ltr'],

  // ── Africa ──────────────────────────────────────────────────
  ['om',    'Oromo',               'ltr'],
  ['ff',    'Fula',                'ltr'],
  ['ln',    'Lingala',             'ltr'],
  ['bm',    'Bambara',             'ltr'],
  ['ak',    'Twi',                 'ltr'],
  ['wo',    'Wolof',               'ltr'],
  ['lg',    'Luganda',             'ltr'],
  ['ee',    'Ewe',                 'ltr'],
  ['tn',    'Tswana',              'ltr'],
  ['ts',    'Tsonga',              'ltr'],
  ['nr',    'Ndebele',             'ltr'],
  ['ve',    'Venda',               'ltr'],
  ['bem',   'Bemba',               'ltr'],
  ['zgh',   'Tamazight',           'ltr'],

  // ── Asia ────────────────────────────────────────────────────
  ['yue',   'Cantonese',           'ltr'],
  ['mai',   'Maithili',            'ltr'],
  ['ks',    'Kashmiri',            'rtl'],
  ['sat',   'Santali',             'ltr'],
  ['kok',   'Konkani',             'ltr'],
  ['doi',   'Dogri',               'ltr'],
  ['mni',   'Manipuri',            'ltr'],
  ['brx',   'Bodo',                'ltr'],
  ['tcy',   'Tulu',                'ltr'],
  ['bo',    'Tibetan',             'ltr'],
  ['tg',    'Tajik',               'ltr'],
  ['bal',   'Balochi',             'rtl'],
  ['prs',   'Dari',                'rtl'],
  ['ilo',   'Ilocano',             'ltr'],
  ['hil',   'Hiligaynon',          'ltr'],
  ['tpi',   'Tok Pisin',           'ltr'],
  ['dv',    'Dhivehi',             'rtl'],
  ['dz',    'Dzongkha',            'ltr'],
  ['syr',   'Assyrian',            'rtl'],

  // ── Americas ────────────────────────────────────────────────
  ['qu',    'Quechua',             'ltr'],
  ['gn',    'Guaraní',             'ltr'],
  ['ay',    'Aymara',              'ltr'],
  ['nah',   'Nahuatl',             'ltr'],

  // ── Europe ──────────────────────────────────────────────────
  ['oc',    'Occitan',             'ltr'],
  ['br',    'Breton',              'ltr'],
  ['co',    'Corsican',            'ltr'],
  ['fo',    'Faroese',             'ltr'],
  ['gd',    'Scots Gaelic',        'ltr'],
  ['rm',    'Romansh',             'ltr'],
  ['cnr',   'Montenegrin',         'ltr'],
  ['an',    'Aragonese',           'ltr'],

  // ── Pacific ─────────────────────────────────────────────────
  ['mi',    'Maori',               'ltr'],
  ['sm',    'Samoan',              'ltr'],
  ['fj',    'Fijian',              'ltr'],
  ['to',    'Tongan',              'ltr'],
  ['haw',   'Hawaiian',            'ltr'],
]

const SANSKRIT_TERMS = [
  'nakshatra','dasha','rashi','vedic','vimshottari','mahadasha',
  'antardasha','kundali','jyotish','graha','lagna','ascendant',
  'chaldean','pythagorean','numerology','astrology','karma',
  'dharma','pada','atmakaraka','khagatara','nakshatras'
]

// ─── Already translated — skip these ─────────────────────────────────────────
const ALREADY_DONE = new Set(['en','es','pt','fr','it','de','hi','ar'])

// ─── English source strings ───────────────────────────────────────────────────

const CALC_EN = {
  placeholderName:  'Enter your full name',
  placeholderDob:   'Select your birth date',
  placeholderPlace: 'Place of birth (e.g. Thrissur, India)',
  labelTimeUnknown: "I don't know my exact birth time",
  genderMale:       'Male',
  genderFemale:     'Female',
  genderOther:      'Prefer not to say',
  disclaimerText:   'Some readings may be approximate due to missing birth details. For accurate Nakshatra, Pada, Lagna, and Dasha calculations, exact birth time and birthplace are recommended.',
  btnCalculate:     'Calculate My Path',
  btnCalculating:   'Calculating...',
  gridLifePath:     'Life Path',
  gridNameNumber:   'Name Number',
  gridSoulUrge:     'Soul Urge',
  gridPersonality:  'Personality',
  titleVedic:       'Vedic Reading',
  labelMoonSign:    'Moon Sign',
  labelBirthStar:   'Birth Star',
  labelCurrentDasha:'Current Dasha',
  labelPada:        'Pada',
  labelYears:       'yrs',
  premiumText:      'Your full Vedic report includes complete relationship compatibility, supportive planetary energies, detailed time cycle (Dasha) analysis, and your complete personal soul blueprint PDF.',
  btnReport:        'Get Full Report — €2.99',
  btnLoading:       'Loading...',
  paymentNote:      'Instant PDF download • Secure payment',
  errorText:        'Something went wrong. Please try again.',
  errorPayment:     'Payment failed. Please try again.',
}

const BOOK_EN = {
  title:       'The Cosmic Geometry: A Guide to Vedic Mindfulness',
  bullet1:     'Explore the mathematical symmetry of the 27 Nakshatras',
  bullet2:     'Simple, daily reflection rituals for peace and focus',
  bullet3:     'How to align your morning intentions with lunar cycles',
  bullet4:     'Traditional Vedic frameworks for patience and self-growth',
  bullet5:     'Includes printable 30-day spiritual journal and checklist',
  btnText:     'Grab Your Copy — €4.99',
  paymentNote: 'Instant PDF download • Secure Checkout',
}

// ─── Sanskrit/brand term restorer ────────────────────────────────────────────

function restoreSanskrit(text) {
  for (const term of SANSKRIT_TERMS) {
    const re = new RegExp(term, 'gi')
    text = text.replace(re, term)
  }
  return text
}

// ─── Translation providers ────────────────────────────────────────────────────

async function tryMyMemory(text, targetLang) {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    const res  = await fetch(url)
    const data = await res.json()
    if (data?.responseStatus === 200 && data.responseData.translatedText !== text) {
      return data.responseData.translatedText
    }
    return null
  } catch { return null }
}

async function tryGoogleFree(text, targetLang) {
  try {
    const url  = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    const res  = await fetch(url)
    const data = await res.json()
    if (data && data[0]) return data[0].map(s => s[0]).join('')
    return null
  } catch { return null }
}

async function translateText(text, targetLang) {
  if (!text || text.trim() === '') return text
  const mymemory = await tryMyMemory(text, targetLang)
  if (mymemory) return restoreSanskrit(mymemory)
  const google = await tryGoogleFree(text, targetLang)
  if (google) return restoreSanskrit(google)
  return text
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── Translate all keys of an object ─────────────────────────────────────────

async function translateObject(obj, lang) {
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = await translateText(value, lang)
    await delay(DELAY_MS)
  }
  return result
}

// ─── Cache helpers ────────────────────────────────────────────────────────────

function loadCache(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return {} }
}

function saveCache(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8')
}

// ─── Output writers ───────────────────────────────────────────────────────────

function escapeStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
}

function writeCalculatorOutput(allLangs) {
  const lines = [
    '// AUTO-GENERATED by translate-ui.js — do not edit manually',
    '// Paste this as CALC_LOCALIZATION in Calculator.tsx',
    '',
    'export const CALC_LOCALIZATION: Record<string, Record<string, string>> = {',
  ]

  for (const [code, strings] of Object.entries(allLangs)) {
    lines.push(`  '${code}': {`)
    for (const [key, val] of Object.entries(strings)) {
      // titleVedic needs ✦ prefix restored
      const finalVal = key === 'titleVedic' ? `✦ ${val}` : val
      lines.push(`    ${key}: \`${escapeStr(finalVal)}\`,`)
    }
    lines.push(`  },`)
  }

  lines.push('}')
  const outFile = path.join(OUTPUT_DIR, 'calculator-localization.ts')
  fs.writeFileSync(outFile, lines.join('\n'), 'utf8')
  console.log(`\n✅ Written: ${outFile}`)
}

function writeBookConfigOutput(allLangs) {
  const lines = [
    '// AUTO-GENERATED by translate-ui.js — do not edit manually',
    '// Paste this as the translations block in book-config.ts',
    '',
    'export const BOOK_TRANSLATIONS = {',
  ]

  for (const [code, t] of Object.entries(allLangs)) {
    lines.push(`  '${code}': {`)
    lines.push(`    title: \`📘 ${escapeStr(t.title)}\`,`)
    lines.push(`    bullets: [`)
    lines.push(`      \`${escapeStr(t.bullet1)}\`,`)
    lines.push(`      \`${escapeStr(t.bullet2)}\`,`)
    lines.push(`      \`${escapeStr(t.bullet3)}\`,`)
    lines.push(`      \`${escapeStr(t.bullet4)}\`,`)
    lines.push(`      \`${escapeStr(t.bullet5)}\`,`)
    lines.push(`    ],`)
    lines.push(`    btnText: \`${escapeStr(t.btnText)}\`,`)
    lines.push(`    paymentNote: \`${escapeStr(t.paymentNote)}\`,`)
    lines.push(`  },`)
  }

  lines.push('}')
  const outFile = path.join(OUTPUT_DIR, 'book-config-translations.ts')
  fs.writeFileSync(outFile, lines.join('\n'), 'utf8')
  console.log(`✅ Written: ${outFile}`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const calcCacheFile = path.join(OUTPUT_DIR, 'calc-cache.json')
  const bookCacheFile = path.join(OUTPUT_DIR, 'book-cache.json')
  const calcCache     = loadCache(calcCacheFile)
  const bookCache     = loadCache(bookCacheFile)

  // Determine which languages to process
  const targetArg  = process.argv.slice(2)
  const allCodes   = LANGUAGE_CONFIG.map(([code]) => code).filter(c => c !== 'en')
  const toLang     = targetArg.length > 0 ? targetArg : allCodes

  console.log(`\n🌍 Translating UI strings for ${toLang.length} languages...\n`)

  let done = 0
  const total = toLang.filter(c => !ALREADY_DONE.has(c)).length * 2 // calc + book

  for (const code of toLang) {
    const [, langName] = LANGUAGE_CONFIG.find(([c]) => c === code) || [code, code]
    console.log(`\n=== [${code.toUpperCase()}] ${langName} ===`)

    // ── Calculator ──
    if (calcCache[code]) {
      console.log(`  ✅ Calculator already cached`)
    } else if (ALREADY_DONE.has(code)) {
      console.log(`  ⏭  Calculator already translated (hardcoded)`)
    } else {
      process.stdout.write(`  🔄 Calculator strings...`)
      calcCache[code] = await translateObject(CALC_EN, code)
      saveCache(calcCacheFile, calcCache)
      done++
      console.log(` ✅ [${done}/${total}]`)
    }

    // ── Book promo ──
    if (bookCache[code]) {
      console.log(`  ✅ BookPromo already cached`)
    } else if (ALREADY_DONE.has(code)) {
      console.log(`  ⏭  BookPromo already translated (hardcoded)`)
    } else {
      process.stdout.write(`  🔄 BookPromo strings...`)
      bookCache[code] = await translateObject(BOOK_EN, code)
      saveCache(bookCacheFile, bookCache)
      done++
      console.log(` ✅ [${done}/${total}]`)
    }

    await delay(200)
  }

  // ── Merge hardcoded + cached into final output ──

  // Calculator: start with hardcoded 8 languages, merge cache
  const calcHardcoded = {
    en:  { ...CALC_EN, titleVedic: 'Vedic Reading' },
    es:  { placeholderName:'Ingresa tu nombre completo', placeholderDob:'Selecciona tu fecha de nacimiento', placeholderPlace:'Lugar de nacimiento (ej. Madrid, España)', labelTimeUnknown:'No sé mi hora exacta de nacimiento', genderMale:'Masculino', genderFemale:'Femenino', genderOther:'Prefiero no decirlo', disclaimerText:'Algunas lecturas pueden ser aproximadas. Para cálculos precisos de Nakshatra, Pada, Lagna y Dasha, se recomienda la hora y lugar exactos de nacimiento.', btnCalculate:'Calcular Mi Camino', btnCalculating:'Calculando...', gridLifePath:'Camino de Vida', gridNameNumber:'Número del Nombre', gridSoulUrge:'Impulso del Alma', gridPersonality:'Personalidad', titleVedic:'Lectura Védica', labelMoonSign:'Signo Lunar', labelBirthStar:'Estrella Natal', labelCurrentDasha:'Ciclo Actual (Dasha)', labelPada:'Pada', labelYears:'años', premiumText:'Tu informe védico completo incluye compatibilidad de relaciones, energías planetarias, análisis detallado del ciclo de tiempo (Dasha) y tu PDF del mapa del alma.', btnReport:'Obtener Informe Completo — €2.99', btnLoading:'Cargando...', paymentNote:'Descarga PDF instantánea • Pago seguro', errorText:'Algo salió mal. Por favor intenta de nuevo.', errorPayment:'El pago falló. Por favor intenta de nuevo.' },
    pt:  { placeholderName:'Insira seu nome completo', placeholderDob:'Selecione sua data de nascimento', placeholderPlace:'Local de nascimento (ex. Lisboa, Portugal)', labelTimeUnknown:'Não sei meu horário exato de nascimento', genderMale:'Masculino', genderFemale:'Feminino', genderOther:'Prefiro não dizer', disclaimerText:'Algumas leituras podem ser aproximadas. Para cálculos precisos de Nakshatra, Pada, Lagna e Dasha, recomenda-se hora e local exatos de nascimento.', btnCalculate:'Calcular Meu Caminho', btnCalculating:'Calculando...', gridLifePath:'Caminho de Vida', gridNameNumber:'Número do Nome', gridSoulUrge:'Desejo da Alma', gridPersonality:'Personalidade', titleVedic:'Leitura Védica', labelMoonSign:'Signo Lunar', labelBirthStar:'Estrela de Nascimento', labelCurrentDasha:'Ciclo Atual (Dasha)', labelPada:'Pada', labelYears:'anos', premiumText:'Seu relatório védico completo inclui compatibilidade de relacionamento, energias planetárias, análise detalhada do ciclo de tempo (Dasha) e o PDF do seu mapa da alma.', btnReport:'Obter Relatório Completo — €2.99', btnLoading:'Carregando...', paymentNote:'Download instantâneo em PDF • Pagamento seguro', errorText:'Algo deu errado. Por favor, tente novamente.', errorPayment:'Falha no pagamento. Por favor, tente novamente.' },
    fr:  { placeholderName:'Entrez votre nom complet', placeholderDob:'Sélectionnez votre date de naissance', placeholderPlace:'Lieu de naissance (ex. Paris, France)', labelTimeUnknown:"Je ne connais pas mon heure exacte de naissance", genderMale:'Homme', genderFemale:'Femme', genderOther:'Préfère ne pas dire', disclaimerText:"Certaines lectures peuvent être approximatives. Pour des calculs précis de Nakshatra, Pada, Lagna et Dasha, l'heure et le lieu exacts de naissance sont recommandés.", btnCalculate:'Calculer Mon Chemin', btnCalculating:'Calcul en cours...', gridLifePath:'Chemin de Vie', gridNameNumber:'Nombre du Nom', gridSoulUrge:"Désir de l'Âme", gridPersonality:'Personnalité', titleVedic:'Lecture Védique', labelMoonSign:'Signe Lunaire', labelBirthStar:'Étoile de Naissance', labelCurrentDasha:'Cycle Actuel (Dasha)', labelPada:'Pada', labelYears:'ans', premiumText:"Votre rapport védique complet comprend la compatibilité relationnelle, les énergies planétaires, l'analyse du cycle temporel (Dasha) et votre PDF du plan de l'âme.", btnReport:'Obtenir le Rapport Complet — 2,99 €', btnLoading:'Chargement...', paymentNote:'Téléchargement PDF instantané • Paiement sécurisé', errorText:'Une erreur est survenue. Veuillez réessayer.', errorPayment:'Échec du paiement. Veuillez réessayer.' },
    it:  { placeholderName:'Inserisci il tuo nome completo', placeholderDob:'Seleziona la tua data di nascita', placeholderPlace:'Luogo di nascita (es. Roma, Italia)', labelTimeUnknown:'Non conosco la mia ora esatta di nascita', genderMale:'Maschio', genderFemale:'Femmina', genderOther:'Preferisco non dirlo', disclaimerText:'Alcune letture potrebbero essere approssimative. Per calcoli precisi di Nakshatra, Pada, Lagna e Dasha, si consiglia ora e luogo esatti di nascita.', btnCalculate:'Calcola il Mio Cammino', btnCalculating:'Calcolo in corso...', gridLifePath:'Cammino di Vita', gridNameNumber:'Numero del Nome', gridSoulUrge:"Desiderio dell'Anima", gridPersonality:'Personalità', titleVedic:'Lettura Vedica', labelMoonSign:'Segno Lunare', labelBirthStar:'Stella di Nascita', labelCurrentDasha:'Ciclo Attuale (Dasha)', labelPada:'Pada', labelYears:'anni', premiumText:"Il tuo rapporto vedico completo include compatibilità relazionale, energie planetarie, analisi del ciclo temporale (Dasha) e il PDF della tua mappa dell'anima.", btnReport:'Ottieni il Rapporto Completo — €2.99', btnLoading:'Caricamento...', paymentNote:'Download istantaneo in PDF • Pagamento sicuro', errorText:'Qualcosa è andato storto. Riprova.', errorPayment:'Pagamento fallito. Riprova.' },
    de:  { placeholderName:'Geben Sie Ihren vollständigen Namen ein', placeholderDob:'Wählen Sie Ihr Geburtsdatum', placeholderPlace:'Geburtsort (z.B. Berlin, Deutschland)', labelTimeUnknown:'Ich kenne meine genaue Geburtszeit nicht', genderMale:'Männlich', genderFemale:'Weiblich', genderOther:'Keine Angabe', disclaimerText:'Einige Lesungen können ungefähr sein. Für genaue Nakshatra-, Pada-, Lagna- und Dasha-Berechnungen werden genaue Geburtszeit und -ort empfohlen.', btnCalculate:'Meinen Weg Berechnen', btnCalculating:'Berechnung läuft...', gridLifePath:'Lebenszahl', gridNameNumber:'Namenszahl', gridSoulUrge:'Seelenimpuls', gridPersonality:'Persönlichkeit', titleVedic:'Vedische Lesung', labelMoonSign:'Mondzeichen', labelBirthStar:'Geburtsstern', labelCurrentDasha:'Aktueller Dasha-Zyklus', labelPada:'Pada', labelYears:'Jahre', premiumText:'Ihr vollständiger vedischer Bericht enthält Beziehungsanalyse, Planetenenergien, detaillierte Dasha-Analyse und Ihr persönliches Seelen-Blueprint-PDF.', btnReport:'Vollständigen Bericht anfordern — 2,99 €', btnLoading:'Laden...', paymentNote:'Sofortiger PDF-Download • Sichere Zahlung', errorText:'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.', errorPayment:'Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.' },
    hi:  { placeholderName:'अपना पूरा नाम दर्ज करें', placeholderDob:'अपनी जन्म तिथि चुनें', placeholderPlace:'जन्म स्थान (जैसे मुंबई, भारत)', labelTimeUnknown:'मुझे अपना सटीक जन्म समय नहीं पता', genderMale:'पुरुष', genderFemale:'महिला', genderOther:'बताना नहीं चाहता', disclaimerText:'कुछ पठन अनुमानित हो सकते हैं। सटीक Nakshatra, Pada, Lagna और Dasha गणना के लिए सटीक जन्म समय और स्थान आवश्यक है।', btnCalculate:'मेरा पथ खोजें', btnCalculating:'गणना हो रही है...', gridLifePath:'जीवन पथ', gridNameNumber:'नाम अंक', gridSoulUrge:'आत्मा इच्छा', gridPersonality:'व्यक्तित्व', titleVedic:'वैदिक पठन', labelMoonSign:'चंद्र राशि', labelBirthStar:'जन्म Nakshatra', labelCurrentDasha:'वर्तमान Dasha', labelPada:'Pada', labelYears:'वर्ष', premiumText:'आपकी संपूर्ण वैदिक रिपोर्ट में संबंध अनुकूलता, सहायक ऊर्जाएं, विस्तृत Dasha विश्लेषण और आत्मा का ब्लूप्रिंट PDF शामिल है।', btnReport:'पूर्ण रिपोर्ट प्राप्त करें — €2.99', btnLoading:'लोड हो रहा है...', paymentNote:'तत्काल PDF डाउनलोड • सुरक्षित भुगतान', errorText:'कुछ गलत हो गया। कृपया पुनः प्रयास करें।', errorPayment:'भुगतान विफल रहा। कृपया पुनः प्रयास करें।' },
    ar:  { placeholderName:'أدخل اسمك الكامل', placeholderDob:'اختر تاريخ ميلادك', placeholderPlace:'مكان الميلاد (مثال: القاهرة، مصر)', labelTimeUnknown:'لا أعرف وقت ميلادي بالضبط', genderMale:'ذكر', genderFemale:'أنثى', genderOther:'أفضل عدم الإفصاح', disclaimerText:'قد تكون بعض القراءات تقريبية. للحصول على حسابات دقيقة لـ Nakshatra و Pada و Lagna و Dasha، يُوصى بمعرفة وقت ومكان الميلاد بدقة.', btnCalculate:'احسب مسار حياتي', btnCalculating:'جاري الحساب...', gridLifePath:'مسار الحياة', gridNameNumber:'رقم الاسم', gridSoulUrge:'رغبة الروح', gridPersonality:'الشخصية', titleVedic:'القراءة الفيدية', labelMoonSign:'البرج القمري', labelBirthStar:'نجم الميلاد', labelCurrentDasha:'دورة الوقت الحالية (Dasha)', labelPada:'Pada', labelYears:'سنوات', premiumText:'يتضمن تقريرك الفيدي الكامل توافق العلاقات، الطاقات الكوكبية، تحليل مفصل لدورة الوقت (Dasha)، وكتيب PDF لمخطط روحك.', btnReport:'احصل على التقرير الكامل — 2.99 €', btnLoading:'جاري التحميل...', paymentNote:'تحميل PDF فوري • دفع آمن', errorText:'حدث خطأ ما. يرجى المحاولة مرة أخرى.', errorPayment:'فشل الدفع. يرجى المحاولة مرة أخرى.' },
  }

  const calcAllLangs = { ...calcHardcoded }
  for (const [code, strings] of Object.entries(calcCache)) {
    if (!calcAllLangs[code]) calcAllLangs[code] = strings
  }

  // Book: start with hardcoded 8, merge cache
  const bookHardcoded = {
    en:  { title:'The Cosmic Geometry: A Guide to Vedic Mindfulness', bullet1:'Explore the mathematical symmetry of the 27 Nakshatras', bullet2:'Simple, daily reflection rituals for peace and focus', bullet3:'How to align your morning intentions with lunar cycles', bullet4:'Traditional Vedic frameworks for patience and self-growth', bullet5:'Includes printable 30-day spiritual journal and checklist', btnText:'Grab Your Copy — €4.99', paymentNote:'Instant PDF download • Secure Checkout' },
    es:  { title:'Geometría Cósmica: Guía de Atención Plena Védica', bullet1:'Explora la simetría matemática de los 27 Nakshatras', bullet2:'Rituales sencillos de reflexión diaria para la paz y el enfoque', bullet3:'Cómo alinear tus intenciones matutinas con los ciclos lunares', bullet4:'Marcos védicos tradicionales para la paciencia y el crecimiento', bullet5:'Incluye un diario espiritual de 30 días para imprimir', btnText:'Obtener Mi Copia — €4.99', paymentNote:'Descarga instantánea en PDF • Pago Seguro' },
    pt:  { title:'Geometria Cósmica: Guia de Atenção Plena Védica', bullet1:'Explore a simetria matemática dos 27 Nakshatras', bullet2:'Rituais simples de reflexão diária para paz e foco', bullet3:'Como alinhar suas intenções matinais com os ciclos lunares', bullet4:'Abordagens védicas tradicionais para paciência e autoconhecimento', bullet5:'Inclui um diário espiritual de 30 dias para imprimir', btnText:'Garantir Minha Cópia — €4.99', paymentNote:'Download instantâneo em PDF • Pago Seguro' },
    fr:  { title:'La Géométrie Cosmique : Guide de Pleine Conscience Védique', bullet1:'Explorez la symétrie mathématique des 27 Nakshatras', bullet2:'Rituels simples de réflexion quotidienne pour la paix et la clarté', bullet3:'Comment aligner vos intentions matinales sur les cycles lunaires', bullet4:'Méthodes védiques traditionnelles pour la patience et le développement', bullet5:'Comprend un journal spirituel imprimable de 30 jours', btnText:'Obtenir Mon Exemplaire — €4.99', paymentNote:'Téléchargement PDF immédiat • Paiement Sécurisé' },
    it:  { title:'La Geometria Cosmica: Guida alla Consapevolezza Vedica', bullet1:'Esplora la simmetria matematica delle 27 Nakshatras', bullet2:'Semplici rituali di riflessione quotidiana per pace e concentrazione', bullet3:'Come allineare le tue intenzioni mattutine con i cicli lunari', bullet4:"Metodi vedici tradizionali per la pazienza e l'auto-crescita", bullet5:'Include un diario spirituale stampabile di 30 giorni', btnText:'Ottieni la Tua Copia — €4.99', paymentNote:'Download istantaneo in PDF • Pagamento Sicuro' },
    de:  { title:'Kosmische Geometrie: Leitfaden für vedische Achtsamkeit', bullet1:'Entdecken Sie die mathematische Symmetrie der 27 Nakshatras', bullet2:'Einfache tägliche Reflexionsrituale für Frieden und Fokus', bullet3:'Wie Sie Ihre morgendlichen Absichten auf die Mondzyklen abstimmen', bullet4:'Traditionelle vedische Ansätze für Geduld und Selbstwachstum', bullet5:'Enthält ein druckbares 30-tägiges spirituelles Tagebuch', btnText:'Jetzt Exemplar Sichern — €4.99', paymentNote:'Sofortiger PDF-Download • Sichere Zahlung' },
    hi:  { title:'ब्रह्मांडीय ज्यामिति: वैदिक माइंडफुलनेस गाइड', bullet1:'२७ Nakshatras की पूर्ण गणितीय समरूपता को समझें', bullet2:'शांति और एकाग्रता के लिए सरल दैनिक आत्म-चिंतन अनुष्ठान', bullet3:'चंद्र चक्रों के साथ अपने सुबह के इरादों को कैसे संरेखित करें', bullet4:'धैर्य और आत्म-विकास के लिए पारंपरिक वैदिक दृष्टिकोण', bullet5:'प्रिंट करने योग्य ३०-दिवसीय आध्यात्मिक जर्नल शामिल है', btnText:'अपनी प्रति प्राप्त करें — €4.99', paymentNote:'तत्काल PDF डाउनलोड • सुरक्षित भुगतान' },
    ar:  { title:'الهندسة الكونية: دليل اليقظة الذهنية الفيدية', bullet1:'استكشف التناظر الرياضي لـ 27 Nakshatra', bullet2:'طقوس بسيطة للتأمل اليومي من أجل السلام والتركيز العميق', bullet3:'كيفية مواءمة نواياك الصباحية مع دورات القمر الطبيعية', bullet4:'الأساليب الفيدية التقليدية للصبر والنمو الذاتي الروحي', bullet5:'يتضمن دفتر يوميات روحي وجدول متابعة قابل للطباعة لمدة 30 يومًا', btnText:'احصل على نسختك — €4.99', paymentNote:'تحميل PDF فوري • دفع آمن بالكامل' },
  }

  const bookAllLangs = { ...bookHardcoded }
  for (const [code, strings] of Object.entries(bookCache)) {
    if (!bookAllLangs[code]) bookAllLangs[code] = strings
  }

  writeCalculatorOutput(calcAllLangs)
  writeBookConfigOutput(bookAllLangs)

  console.log('\n🎉 Done! Files written to ui-output/')
  console.log('  → Copy calculator-localization.ts content into Calculator.tsx as CALC_LOCALIZATION')
  console.log('  → Copy book-config-translations.ts content into book-config.ts as the translations block')
}

run()