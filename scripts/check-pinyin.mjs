// Double-check pinyin: so sánh pinyin trong vocabulary.json với pinyin-pro (nguồn 2)
import { pinyin } from 'pinyin-pro'
import { readFileSync } from 'node:fs'

const vocab = JSON.parse(readFileSync('src/data/vocabulary.json', 'utf8'))

// Chuẩn hóa pinyin để so sánh: bỏ dấu cách, chuyển về không dấu
function norm(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[āáǎà]/g, 'a')
    .replace(/[ēéěè]/g, 'e')
    .replace(/[īíǐì]/g, 'i')
    .replace(/[ōóǒò]/g, 'o')
    .replace(/[ūúǔù]/g, 'u')
    .replace(/[ǖǘǚǜü]/g, 'v')
    .replace(/[ńň]/g, 'n')
    .replace(/[ḿ]/g, 'm')
    .replace(/ê/g, 'e')
}

const mismatches = []
const checked = []

for (const w of vocab) {
  if (!w.hanzi) continue
  // pinyin-pro: lấy pinyin từng từ (dạng gắn liền từng âm, có tone)
  const p2 = pinyin(w.hanzi, { toneType: 'symbol', type: 'array' }).join('')
  const p1 = w.pinyin.replace(/\s+/g, '')
  checked.push(w.hanzi)
  if (norm(p1) !== norm(p2)) {
    mismatches.push({ hanzi: w.hanzi, pinyin1: w.pinyin, pinyin2: p2, hsk: w.hsk })
  }
}

console.log('Checked:', checked.length, 'words')
console.log('Mismatches:', mismatches.length)

// In các từ sai lệch, ưu tiên từ HSK 1-2 (phổ biến nhất)
const sorted = [...mismatches].sort((a, b) => a.hsk - b.hsk)
for (const m of sorted.slice(0, 60)) {
  console.log(`HSK${m.hsk}\t${m.hanzi}\t${m.pinyin1}\t→\t${m.pinyin2}`)
}

// Lưu đầy đủ để xử lý
import { writeFileSync } from 'node:fs'
writeFileSync(
  'C:/Users/Hp/AppData/Local/Temp/commandcode/C--Users-Hp/3accb13f-7c52-4828-a01e-2947a784322b/scratchpad/pinyin-mismatches.json',
  JSON.stringify(sorted, null, 2),
)
