// Script: trích xuất từ vựng HSK 2.0 (old-1 → old-4) từ complete.json
// Nguồn: https://github.com/drkameleon/complete-hsk-vocabulary (MIT)
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const raw = JSON.parse(readFileSync(path.join(__dirname, 'complete.json'), 'utf8'))
const words = raw.words ?? raw

const POS_VI = {
  a: 'adj', ad: 'adv', ag: 'adj', an: 'adj', b: 'adj', c: 'conj', d: 'adv',
  dg: 'adv', e: 'int', f: 'n', g: 'morph', h: 'pref', i: 'idiom', j: 'abbr',
  k: 'suf', l: 'expr', m: 'num', mg: 'num', n: 'n', ng: 'n', nr: 'n',
  ns: 'n', nt: 'n', nx: 'n', nz: 'n', o: 'onom', p: 'prep', q: 'classifier',
  r: 'pron', rg: 'pron', s: 'n', t: 'time', tg: 'time', u: 'aux', v: 'v',
  vd: 'v', vg: 'v', vn: 'v', w: 'sym', x: 'x', y: 'part', z: 'adj',
}

const result = []
for (const w of words) {
  const levels = w.level ?? w.l ?? []
  let hsk = null
  for (let i = 1; i <= 4; i++) {
    if (levels.includes(`old-${i}`)) { hsk = i; break }
  }
  if (!hsk) continue
  const forms = w.forms ?? w.f ?? []
  const firstForm = forms[0] ?? {}
  const transcriptions = firstForm.transcriptions ?? firstForm.i ?? {}
  const pinyin = transcriptions.pinyin ?? transcriptions.y ?? ''
  const meanings = firstForm.meanings ?? firstForm.m ?? []
  const posCodes = w.pos ?? w.p ?? []
  const pos = posCodes.map((c) => POS_VI[c] ?? c).filter((x, i, arr) => arr.indexOf(x) === i)
  result.push({
    hanzi: w.simplified ?? w.s,
    pinyin,
    pos,
    meaningEn: meanings.join('; '),
    hsk,
  })
}

// sắp theo cấp rồi theo thứ tự trong nguồn
result.sort((a, b) => a.hsk - b.hsk)

// ghi ra src/data/vocabulary.json (chưa có nghĩa Việt — sẽ gắn sau)
writeFileSync(
  path.join(__dirname, '..', 'src', 'data', 'vocabulary.json'),
  JSON.stringify(result, null, 0) + '\n',
)
console.log('total words:', result.length)
for (let i = 1; i <= 4; i++) {
  console.log(`HSK${i}:`, result.filter((w) => w.hsk === i).length)
}
