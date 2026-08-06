/**
 * translate-topic-meta.js
 * Translates per-topic SEO titles + descriptions (topic-meta.ts) for languages
 * missing coverage. Companion to translate-ui.js — same providers, same pattern.
 *
 * Outputs:
 *   ui-output/topic-meta-additions.ts -> merge these entries into src/app/topic-meta.ts
 *
 * Usage:
 *   node translate-topic-meta.js              -> all missing languages
 *   node translate-topic-meta.js zh-cn ja ru   -> specific languages only
 */

const fs   = require('fs')
const path = require('path')

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

// --- Already covered in topic-meta.ts - skip these -------------------------
const ALREADY_DONE = new Set(["af", "am", "ar", "as", "az", "be", "bg", "bn", "bs", "ca", "ceb", "cs", "cy", "da", "de", "el", "en", "es", "et", "eu", "fa", "fi", "fil", "fr", "fy", "ga", "gl", "gu", "ha", "he", "hi", "hr", "ht", "hu", "hy", "id", "ig", "is", "it", "ja", "jv", "ka", "kk", "km", "kn", "ko", "ku", "ky", "lb", "lo", "lt", "lv", "mg", "mk", "ml", "mn", "mr", "ms", "mt", "my", "ne", "nl", "no", "ny", "or", "pa", "pl", "ps", "pt", "ro", "ru", "rw", "sd", "si", "sk", "sl", "sn", "so", "sq", "sr", "st", "su", "sv", "sw", "ta", "te", "th", "ti", "tk", "tr", "ug", "uk", "ur", "uz", "vi", "xh", "yo", "zu"])

// --- Sanskrit/brand term restorer -------------------------------------------
const SANSKRIT_TERMS = [
  'Nakshatra','Nakshatras','Dasha','Rashi','Lagna','Jyotish','Vedic',
  'Moksha','dharma','pada','atmakaraka','khagatara'
]

function restoreSanskrit(text) {
  for (const term of SANSKRIT_TERMS) {
    const re = new RegExp(term, 'gi')
    text = text.replace(re, term)
  }
  return text
}

// --- English source: title + description per topic -------------------------
const TOPIC_SOURCE = {
  "numerology": {
    "title": "Free Numerology Reading \u2014 Life Path Number Calculator | Khagatara",
    "description": "Get a free numerology reading with your Life Path Number, name number, Vedic Moon sign and birth Nakshatra. Full PDF report available instantly."
  },
  "nameNumerology": {
    "title": "Numerology By Name \u2014 Discover Your Name Number | Khagatara",
    "description": "Calculate numerology by name and discover your expression number, soul urge and personality number with a Vedic numerology report."
  },
  "number11": {
    "title": "Meaning of Number 11 \u2014 Master Number Numerology | Khagatara",
    "description": "Learn the meaning of number 11 in numerology, love, career and spiritual purpose. Calculate whether 11 appears in your life path."
  },
  "vedicAstrology": {
    "title": "Free Vedic Astrology Reading \u2014 Jyotish Online | Khagatara",
    "description": "Get a free Vedic astrology reading with Moon sign, Nakshatra and Dasha period. Discover your Jyotish birth insights online."
  },
  "birthChart": {
    "title": "Free Birth Chart \u2014 Vedic Kundali Calculator | Khagatara",
    "description": "Generate your free birth chart using Vedic astrology. Discover your Moon sign, birth star, Dasha and personalized report."
  },
  "compatibility": {
    "title": "Numerology Compatibility \u2014 Love and Relationship Match | Khagatara",
    "description": "Check numerology compatibility for love, marriage and relationships using life path numbers and Vedic birth details."
  },
  "astrologyChart": {
    "title": "Free Astrology Chart \u2014 Vedic Birth Chart Online | Khagatara",
    "description": "Create a free astrology chart online with Vedic Moon sign, Nakshatra, planetary periods and personalized birth insights."
  }
}

// --- Translation providers (same as translate-ui.js) ------------------------
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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function escapeStr(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

async function main() {
  const args = process.argv.slice(2)
  const toLang = args.length > 0
    ? args
    : LANGUAGE_CONFIG.map(([code]) => code).filter(c => !ALREADY_DONE.has(c))

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const cacheFile = path.join(OUTPUT_DIR, 'topic-meta-cache.json')
  const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : {}

  const topicKeys = Object.keys(TOPIC_SOURCE)
  const total = toLang.length * topicKeys.length
  let done = 0

  const result = {}
  for (const key of topicKeys) result[key] = {}

  for (const code of toLang) {
    if (ALREADY_DONE.has(code)) { continue }
    const langEntry = LANGUAGE_CONFIG.find(([c]) => c === code)
    const langName = langEntry ? langEntry[1] : code
    console.log(`=== [${code.toUpperCase()}] ${langName} ===`)

    for (const key of topicKeys) {
      const cacheKey = `${code}:${key}`
      if (cache[cacheKey]) {
        result[key][code] = cache[cacheKey]
        done++
        console.log(`  cached: ${key} [${done}/${total}]`)
        continue
      }

      const src = TOPIC_SOURCE[key]
      const title = await translateText(src.title, code)
      await delay(DELAY_MS)
      const description = await translateText(src.description, code)
      await delay(DELAY_MS)

      const entry = { title, description }
      result[key][code] = entry
      cache[cacheKey] = entry
      fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8')

      done++
      console.log(`  done: ${key} [${done}/${total}]`)
    }
  }

  const lines = [
    '// AUTO-GENERATED by translate-topic-meta.js',
    '// Merge each language entry into the matching topic block in src/app/topic-meta.ts',
    '',
    'export const TOPIC_META_ADDITIONS = {',
  ]
  for (const key of topicKeys) {
    lines.push(`  ${key}: {`)
    for (const [code, entry] of Object.entries(result[key])) {
      lines.push(`    ${code}: { title: '${escapeStr(entry.title)}', description: '${escapeStr(entry.description)}' },`)
    }
    lines.push(`  },`)
  }
  lines.push('}')

  const outFile = path.join(OUTPUT_DIR, 'topic-meta-additions.ts')
  fs.writeFileSync(outFile, lines.join('\n'), 'utf8')
  console.log(`\nWritten: ${outFile}`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
