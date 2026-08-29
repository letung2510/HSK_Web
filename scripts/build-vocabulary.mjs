// Chuyển hsk_word_list.tsv (HSK 3.0 2026 + CC-CEDICT) → src/data/vocabulary.json
// Nghĩa tiếng Việt:
//   1. Khớp hanzi với vocabulary.json cũ (HSK 2.0) nếu có
//   2. Bản dịch googletrans có sẵn (nếu có)
//   3. Còn lại dùng nghĩa tiếng Anh CC-CEDICT gốc
// Cách dùng:
//   1. node scripts/build-vocabulary.mjs prep    → tạo defs-to-translate.json (không bắt buộc)
//   2. node scripts/build-vocabulary.mjs build   → tạo src/data/vocabulary.json
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const SCRATCH = 'C:/Users/Hp/AppData/Local/Temp/commandcode/C--Users-Hp-hsk-web/353dd39c-151d-48c9-b312-5258909bc118/scratchpad'
const TSV = `${SCRATCH}/hsk_word_list.tsv`
const OUT = 'src/data/vocabulary.json'
const OLD_VOCAB = 'src/data/vocabulary.old.json'
const CHECKPOINT = `${SCRATCH}/vi-translations.json`

const lines = readFileSync(TSV, 'utf8').split(/\r?\n/).filter((l) => l.trim())
const raw = lines.slice(1).map((l) => l.split('\t'))

// Tách cấp 7-9 thành 7/8/9 ước lượng (chia đều theo thứ tự)
const count79 = raw.filter((r) => r[1] === '7-9').length
const third = Math.ceil(count79 / 3)
let idx79 = 0
const rows = raw.map((c) => {
  let level = c[1]
  if (level === '7-9') {
    level = idx79 < third ? '7' : idx79 < third * 2 ? '8' : '9'
    idx79++
  }
  return {
    hanzi: c[2].replace(/\d+$/, ''), // bỏ sense suffix 点1 → 点
    pinyin: c[3],
    pos: c[4] ? c[4].split(/[、/]/).filter(Boolean) : [],
    meaningEn: c[8], // definition_cc-cedict (nghĩa tiếng Anh)
    hsk: parseInt(level, 10),
    traditional: c[7], // traditional_cc-cedict (chữ Hán phồn thể)
  }
})

const mode = process.argv[2] || 'build'

if (mode === 'prep') {
  const uniqueDefs = [...new Set(rows.map((r) => r.meaningEn).filter(Boolean))]
  writeFileSync(`${SCRATCH}/defs-to-translate.json`, JSON.stringify(uniqueDefs, null, 0))
  console.log('Unique defs to translate:', uniqueDefs.length)
  console.log('Rows:', rows.length)
  const lv = {}
  for (const r of rows) lv[r.hsk] = (lv[r.hsk] ?? 0) + 1
  console.log('Level counts:', JSON.stringify(lv))
} else if (mode === 'build') {
  // Nghĩa Việt cũ theo hanzi (HSK 2.0)
  const oldVi = {}
  if (existsSync(OLD_VOCAB)) {
    const old = JSON.parse(readFileSync(OLD_VOCAB, 'utf8'))
    for (const w of old) if (w.meaningVi) oldVi[w.hanzi] = w.meaningVi
  }
  // Bản dịch googletrans đã có
  const translations = existsSync(CHECKPOINT) ? JSON.parse(readFileSync(CHECKPOINT, 'utf8')) : {}

  let fromOld = 0
  let fromGoogle = 0
  let fromEn = 0
  const vocab = rows.map((r) => {
    let meaningVi = ''
    if (oldVi[r.hanzi]) {
      meaningVi = oldVi[r.hanzi]
      fromOld++
    } else if (translations[r.meaningEn]) {
      meaningVi = translations[r.meaningEn]
      fromGoogle++
    } else {
      meaningVi = r.meaningEn
      fromEn++
    }
    return {
      hanzi: r.hanzi,
      pinyin: r.pinyin,
      pos: r.pos,
      meaningEn: r.meaningEn,
      meaningVi,
      hsk: r.hsk,
      traditional: r.traditional,
    }
  })
  writeFileSync(OUT, JSON.stringify(vocab))
  console.log('Wrote', vocab.length, 'words')
  console.log('meanings: from old VI:', fromOld, '| from google:', fromGoogle, '| from EN:', fromEn)
  const lv = {}
  for (const r of vocab) lv[r.hsk] = (lv[r.hsk] ?? 0) + 1
  console.log('Level counts:', JSON.stringify(lv))
}
