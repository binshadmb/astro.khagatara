// ─── /read Hub — Master Slug Registry ────────────────────────────────────────
// 50 reading pages, grouped by category
// price: 9 | 19 | 29 (INR)

export interface ReadingDef {
  slug:     string
  title:    string
  category: string
  price:    9 | 19 | 29
  gender?:  'f' | 'm' | null   // null = universal
}

export const READING_DEFS: ReadingDef[] = [

  // ── Attraction / Desire ──────────────────────────────────────────────────
  { slug: 'why-men-are-drawn-to-certain-body-types',    title: 'Why Men Are Drawn to Certain Body Types',       category: 'Attraction',  price: 19, gender: null },
  { slug: 'why-some-women-attract-obsession',           title: 'Why Some Women Attract Obsession Instantly',    category: 'Attraction',  price: 19, gender: 'f'  },
  { slug: 'face-types-that-dominate-attention',         title: 'Which Face Types Naturally Dominate Attention', category: 'Attraction',  price: 9,  gender: null },
  { slug: 'what-your-eyes-reveal-about-desire',         title: 'What Your Eyes Reveal About Hidden Desire',     category: 'Attraction',  price: 9,  gender: null },
  { slug: 'body-signs-linked-to-irresistible-attraction', title: 'The Body Signs Linked to Irresistible Attraction', category: 'Attraction', price: 19, gender: null },
  { slug: 'birth-stars-that-create-magnetic-chemistry', title: 'Which Birth Stars Create Magnetic Chemistry',   category: 'Attraction',  price: 19, gender: null },
  { slug: 'who-secretly-desires-you',                   title: 'Who Secretly Desires You Based on Your Chart',  category: 'Attraction',  price: 29, gender: null },
  { slug: 'what-makes-someone-unforgettable-in-love',   title: 'What Makes Someone Unforgettable in Love',      category: 'Attraction',  price: 19, gender: null },
  { slug: 'why-some-people-look-younger',               title: 'Why Some People Look Younger Than Their Age',   category: 'Attraction',  price: 9,  gender: null },

  // ── Marriage / Relationship ──────────────────────────────────────────────
  { slug: 'when-will-i-get-married',                    title: 'When Will You Actually Get Married',            category: 'Marriage',    price: 29, gender: null },
  { slug: 'why-marriage-gets-delayed',                  title: 'Why Marriage Gets Delayed for Some People',     category: 'Marriage',    price: 19, gender: null },
  { slug: 'why-relationships-keep-failing',             title: 'The Real Reason Your Relationships Keep Failing', category: 'Marriage',  price: 19, gender: null },
  { slug: 'who-you-should-never-marry',                 title: 'Who You Should Never Marry',                    category: 'Marriage',    price: 29, gender: null },
  { slug: 'signs-that-destroy-compatibility',           title: 'Which Signs Destroy Compatibility Slowly',      category: 'Marriage',    price: 19, gender: null },
  { slug: 'why-emotionally-unavailable-people-attract-you', title: 'Why Emotionally Unavailable People Attract You', category: 'Marriage', price: 19, gender: null },
  { slug: 'your-hidden-karmic-relationship-pattern',    title: 'Your Hidden Karmic Relationship Pattern',       category: 'Marriage',    price: 29, gender: null },
  { slug: 'one-marriage-or-many',                       title: 'Are You Meant for One Marriage or Many',        category: 'Marriage',    price: 29, gender: null },
  { slug: 'dangerous-ages-for-relationships',           title: 'Which Ages Are Dangerous for Relationships',    category: 'Marriage',    price: 19, gender: null },
  { slug: 'who-will-regret-leaving-you',                title: 'Who Will Regret Leaving You Later',             category: 'Marriage',    price: 29, gender: null },

  // ── Dangerous / Forbidden ────────────────────────────────────────────────
  { slug: 'who-you-should-never-trust',                 title: 'Who You Should Never Trust',                    category: 'Forbidden',   price: 19, gender: null },
  { slug: 'birth-patterns-linked-to-betrayal',          title: 'The Birth Patterns Linked to Betrayal',         category: 'Forbidden',   price: 29, gender: null },
  { slug: 'personalities-that-secretly-manipulate',     title: 'Which Personalities Secretly Manipulate Others', category: 'Forbidden',  price: 19, gender: null },
  { slug: 'emotional-traits-of-dangerous-lovers',       title: 'The Emotional Traits of Dangerous Lovers',      category: 'Forbidden',   price: 19, gender: null },
  { slug: 'people-who-drain-your-energy',               title: 'Which People Drain Your Energy the Fastest',    category: 'Forbidden',   price: 9,  gender: null },
  { slug: 'signs-someone-is-emotionally-fake',          title: 'Signs Someone Is Emotionally Fake',             category: 'Forbidden',   price: 9,  gender: null },
  { slug: 'the-dark-side-of-your-personality',          title: 'The Dark Side of Your Personality Type',        category: 'Forbidden',   price: 29, gender: null },

  // ── Health / Beauty ──────────────────────────────────────────────────────
  { slug: 'what-to-eat-before-bed',                     title: 'What to Eat Before Bed for Better Skin and Sleep', category: 'Beauty',   price: 9,  gender: null },
  { slug: 'why-your-face-changes-after-certain-ages',   title: 'Why Your Face Changes After Certain Ages',       category: 'Beauty',    price: 19, gender: null },
  { slug: 'foods-that-increase-attraction-energy',      title: 'Which Foods Increase Attraction Energy',         category: 'Beauty',    price: 9,  gender: null },
  { slug: 'sleep-habits-linked-to-beauty',              title: 'The Sleep Habits Linked to Beauty',              category: 'Beauty',    price: 9,  gender: null },
  { slug: 'which-body-types-age-slower',                title: 'Which Body Types Age Slower',                    category: 'Beauty',    price: 19, gender: null },
  { slug: 'what-your-skin-reveals-emotionally',         title: 'What Your Skin Reveals Emotionally',             category: 'Beauty',    price: 9,  gender: null },

  // ── Birth / Spiritual Mystery ────────────────────────────────────────────
  { slug: 'what-your-birth-type-reveals',               title: 'What Your Birth Type Reveals (C-section vs Natural)', category: 'Spiritual', price: 19, gender: null },
  { slug: 'why-some-births-carry-heavier-karma',        title: 'Why Some Births Carry Heavier Karma',            category: 'Spiritual',  price: 29, gender: null },
  { slug: 'the-hidden-meaning-of-your-birth-time',      title: 'The Hidden Meaning of Your Birth Time',          category: 'Spiritual',  price: 29, gender: null },
  { slug: 'what-recurring-dreams-reveal',               title: 'What Recurring Dreams May Indicate Spiritually', category: 'Spiritual',  price: 19, gender: null },
  { slug: 'why-some-people-attract-strange-coincidences', title: 'Why Some People Attract Strange Coincidences', category: 'Spiritual',  price: 19, gender: null },
  { slug: 'what-childhood-patterns-reveal-about-destiny', title: 'What Your Childhood Patterns Reveal About Destiny', category: 'Spiritual', price: 29, gender: null },

  // ── Male-Specific ────────────────────────────────────────────────────────
  { slug: 'why-some-men-command-respect',               title: 'Why Some Men Naturally Command Respect',         category: 'Male',       price: 19, gender: 'm' },
  { slug: 'what-makes-a-man-emotionally-unforgettable', title: 'What Makes a Man Emotionally Unforgettable',     category: 'Male',       price: 19, gender: 'm' },
  { slug: 'habits-that-weaken-masculine-energy',        title: 'Which Habits Weaken Masculine Energy',           category: 'Male',       price: 19, gender: 'm' },
  { slug: 'what-your-voice-says-about-confidence',      title: 'What Your Voice Says About Your Confidence',     category: 'Male',       price: 9,  gender: 'm' },
  { slug: 'the-hidden-psychology-of-dominance',         title: 'The Hidden Psychology Behind Dominance',         category: 'Male',       price: 29, gender: 'm' },

  // ── Female-Specific ──────────────────────────────────────────────────────
  { slug: 'why-some-women-become-unforgettable',        title: 'Why Some Women Become Unforgettable',            category: 'Female',     price: 19, gender: 'f' },
  { slug: 'feminine-energy-men-secretly-notice',        title: 'What Feminine Energy Men Secretly Notice',       category: 'Female',     price: 19, gender: 'f' },
  { slug: 'why-women-attract-emotionally-unavailable-men', title: 'Why Some Women Attract Emotionally Unavailable Men', category: 'Female', price: 29, gender: 'f' },
  { slug: 'what-your-smile-reveals-emotionally',        title: 'What Your Smile Reveals Emotionally',            category: 'Female',     price: 9,  gender: 'f' },
  { slug: 'women-who-become-magnetic-with-age',         title: 'Women Who Naturally Become Magnetic With Age',   category: 'Female',     price: 19, gender: 'f' },

  // ── Truth Reveal ─────────────────────────────────────────────────────────
  { slug: 'the-hidden-reason-your-life-feels-blocked',  title: 'The Hidden Reason Your Life Feels Blocked',      category: 'Truth',      price: 29, gender: null },
  { slug: 'the-emotional-wound-controlling-your-decisions', title: 'The Emotional Wound Controlling Your Decisions', category: 'Truth',   price: 29, gender: null },
  { slug: 'what-people-secretly-notice-about-you-first', title: 'What People Secretly Notice About You First',   category: 'Truth',      price: 19, gender: null },
  { slug: 'the-one-trait-holding-you-back',             title: 'The One Trait Holding You Back',                 category: 'Truth',      price: 19, gender: null },
  { slug: 'your-secret-attraction-style',               title: 'Your Secret Attraction Style',                   category: 'Truth',      price: 19, gender: null },

]

// ─── Category order for /read hub ────────────────────────────────────────────
export const CATEGORY_ORDER = [
  'Attraction',
  'Marriage',
  'Forbidden',
  'Beauty',
  'Spiritual',
  'Male',
  'Female',
  'Truth',
]
