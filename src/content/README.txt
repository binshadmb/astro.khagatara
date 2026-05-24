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