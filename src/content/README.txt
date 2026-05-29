One place to add new content

src/content/master/

Currently has 7 files:

src/content/master/
  numerology.md
  birthChart.md
  vedicAstrology.md
  compatibility.md
  astrologyChart.md
  nameNumerology.md
  number11.md

To add new content:

Create new file in master/ folder:

src/content/master/moonSign.md

Write content in English only
Run scripts:

bashnode translate.js all
node fix_leaks.js

Scripts auto-detect new file → translate to all 100 languages → done!
Push to git ✅


That's it — master folder is your single source of truth forever! 🎯

=================================
What happens automatically:
src/content/master/moonSign.md  ← you add this ONE file
        ↓
node translate.js all
        ↓
src/content/af/moonSign.md   ✅ auto created
src/content/ar/moonSign.md   ✅ auto created
src/content/bn/moonSign.md   ✅ auto created
src/content/zh-cn/moonSign.md ✅ auto created
... all 100 languages ...
src/content/zu/moonSign.md   ✅ auto created
And fix_leaks.js auto detects it too because TOPICS reads from master folder dynamically — no hardcode! ✅

Full flow:
Write in English → master/moonSign.md
        ↓
translate.js all → 100 language files created
        ↓
fix_leaks.js → quality check + auto fix
        ↓
template_checker.js → final confirm
        ↓
git push → live in all 100 languages! 🌍
One English file → whole world covered! 🎯

xx===================================================================================================xx
xx===================================================================================================xx

Step 1 — translate all master content to all 150 languages:

node scripts/translate.js all
Step 2 — quality check and auto-fix any leaks/gaps:

node scripts/fix_leaks.js
Step 3 — final confirm (if template_checker exists):

node scripts/template_checker.js
Step 4 — push:

git add -A && git commit -m "feat: expand to 150 languages + translate all content" && git push
One thing to be aware of — the 50 new languages you added (om, ff, ln, etc.) don't have slugs in seo-config.ts yet. They'll fall back to the defaultSlug (e.g. free-numerology-reading) which works fine for routing, but if you want localized URLs for them you'd need to run translate-seo.js too:

node scripts/translate-seo.js all
That generates the localized slug entries for the new languages in seo.ts and seo-config.ts.