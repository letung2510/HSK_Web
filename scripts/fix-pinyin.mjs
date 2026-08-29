// Sửa pinyin sai trong vocabulary.json (đã double-check với pinyin-pro + phân tích ngữ cảnh)
import { readFileSync, writeFileSync } from 'node:fs'

const path = 'src/data/vocabulary.json'
const vocab = JSON.parse(readFileSync(path, 'utf8'))

// Map: hanzi -> pinyin đúng (đã xác minh theo nghĩa tiếng Việt hiển thị)
const FIXES = {
  // Sai rõ ràng
  '听': 'tīng',       // nghe (trước: yǐn)
  '读': 'dú',         // đọc (trước: dòu)
  '便宜': 'piányi',   // rẻ (trước: biàn yí)
  '鸟': 'niǎo',       // chim (trước: diǎo)
  '胖': 'pàng',       // béo (trước: pán)
  '骑': 'qí',         // cưỡi (trước: jì)
  '万': 'wàn',        // vạn (trước: mò)
  '离': 'lí',         // rời (trước: chī)
  '角': 'jiǎo',       // góc, sừng (trước: Jué)
  '假': 'jiǎ',        // giả (trước: gēi)
  '底': 'dǐ',         // đáy (trước: de)
  '弄': 'nòng',       // ngõ, hẻm (trước: lòng)
  '页': 'yè',         // trang (trước: xié)
  '大夫': 'dàifu',    // bác sĩ (trước: dà fū)
  '重点': 'zhòngdiǎn', // trọng điểm (trước: chóng diǎn)
  '都': 'dōu',        // đều (trước: Dū)
  '还': 'hái',        // vẫn, còn (trước: Huán)
  '着': 'zhe',        // đang (trợ từ) (trước: zhāo)
  '谁': 'shuí',       // ai (chuẩn phổ thông; shéi là biến thể khẩu ngữ)
  '一会儿': 'yíhuìr', // một lúc (trước: yī huì r — thiếu biến âm)
}

let fixed = 0
for (const w of vocab) {
  if (FIXES[w.hanzi]) {
    const old = w.pinyin
    w.pinyin = FIXES[w.hanzi]
    fixed++
    console.log(`✓ ${w.hanzi}: ${old} → ${w.pinyin}`)
  }
}

writeFileSync(path, JSON.stringify(vocab, null, 0) + '\n')
console.log(`\nĐã sửa ${fixed}/${Object.keys(FIXES).length} từ`)

// Các từ GIỮ NGUYÊN vì đúng theo nghĩa hiển thị:
// 了 (le - trợ từ), 地 (de - trợ từ), 行 (háng - hàng/ngành), 弹 (dàn - đạn)
const KEEP = ['了', '地', '行', '弹']
console.log('\nGiữ nguyên (đúng theo nghĩa hiển thị):', KEEP.join(', '))
