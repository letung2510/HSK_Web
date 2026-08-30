// Gộp dữ liệu ngữ pháp HSK 3.0 (krmanik/HSK-3.0) + dữ liệu cũ (70 điểm tiếng Việt)
// Dữ liệu mới: { 类别, 类别名称, 细目, 语法内容 } — chỉ có tiếng Trung, không ví dụ
// Dữ liệu cũ: giàu nội dung tiếng Việt (title, structure, explanation, examples)
// Cách dùng: node scripts/build-grammar.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const TEMP = process.env.TEMP
const OLD = 'src/data/grammar.json'
const OUT = 'src/data/grammar.json'

// Đọc dữ liệu cũ — chỉ lấy các điểm không phải hsk30 (idempotent: chạy lại không nhân đôi)
const oldGrammar = JSON.parse(readFileSync(OLD, 'utf8')).filter((g) => g.source !== 'hsk30')

// Đọc dữ liệu mới từng cấp
const LEVEL_FILES = [
  ['hsk1', 1],
  ['grammar_HSK%202', 2],
  ['grammar_HSK%203', 3],
  ['grammar_HSK%204', 4],
  ['grammar_HSK%205', 5],
  ['grammar_HSK%206', 6],
  ['grammar_HSK%207-9', 7],
]

// Map tiếng Việt cho các danh mục chính (để hiển thị thân thiện hơn)
const CATEGORY_VI = {
  语素: 'Hình vị',
  词类: 'Từ loại',
  短语: 'Cụm từ',
  句子成分: 'Thành phần câu',
  句子的类型: 'Các loại câu',
  动作的态: 'Thể của động từ',
  特殊表达法: 'Cách diễn đạt đặc biệt',
  复句: 'Câu phức',
  固定格式: 'Khuôn mẫu cố định',
  修辞手法: 'Biện pháp tu từ',
  '语段（句群）': 'Đoạn văn (cụm câu)',
}

// Map tiếng Việt cho các danh mục phụ (thuật ngữ ngữ pháp)
const SUBCATEGORY_VI = {
  前缀: 'Tiền tố',
  后缀: 'Hậu tố',
  类前缀: 'Tiền tố loại',
  类后缀: 'Hậu tố loại',
  名词: 'Danh từ',
  动词: 'Động từ',
  形容词: 'Tính từ',
  代词: 'Đại từ',
  数词: 'Số từ',
  量词: 'Lượng từ',
  副词: 'Phó từ',
  介词: 'Giới từ',
  连词: 'Liên từ',
  助词: 'Trợ từ',
  叹词: 'Thán từ',
  结构类型: 'Loại cấu trúc',
  功能类型: 'Loại chức năng',
  主语: 'Chủ ngữ',
  谓语: 'Vị ngữ',
  宾语: 'Tân ngữ',
  定语: 'Định ngữ',
  状语: 'Trạng ngữ',
  补语: 'Bổ ngữ',
  句型: 'Kiểu câu',
  句类: 'Loại câu',
  特殊句型: 'Kiểu câu đặc biệt',
  特殊句式: 'Cấu trúc câu đặc biệt',
  复句: 'Câu phức',
  简单复句: 'Câu phức đơn giản',
  多重复句: 'Câu phức nhiều tầng',
  固定短语: 'Cụm từ cố định',
  数的表达法: 'Cách biểu đạt số',
  数的表示法: 'Cách biểu đạt số',
  时间表示法: 'Cách biểu đạt thời gian',
}

const newItems = []
let idCounter = 1000

for (const [file, level] of LEVEL_FILES) {
  const data = JSON.parse(readFileSync(`${TEMP}/${file}.json`, 'utf8'))
  for (const item of data) {
    const category = item['类别'] || ''
    const sub = item['类别名称'] || ''
    const detail = item['细目'] || ''
    const content = item['语法内容'] || ''
    // title: 语法内容 + (细目) nếu có
    const title = detail ? `${content}（${detail}）` : content
    idCounter++
    const subVi = SUBCATEGORY_VI[sub] || sub
    newItems.push({
      id: `hsk${level}-${String(idCounter).padStart(3, '0')}`,
      hsk: level,
      title,
      category,
      categoryVi: CATEGORY_VI[category] || category,
      subcategory: sub,
      subcategoryVi: subVi,
      structure: detail || sub,
      explanation: `Danh mục: ${CATEGORY_VI[category] || category} — ${subVi}`,
      content,
      examples: [],
      note: '',
      source: 'hsk30',
    })
  }
}

// Gộp: dữ liệu cũ (HSK 1-4, giàu tiếng Việt) + dữ liệu mới
// Với HSK 1-4: ưu tiên dữ liệu cũ (có ví dụ tiếng Việt), thêm dữ liệu mới bổ sung
// Với HSK 5-9: chỉ có dữ liệu mới
const merged = [...oldGrammar, ...newItems]

// Sắp xếp theo hsk
merged.sort((a, b) => a.hsk - b.hsk)

writeFileSync(OUT, JSON.stringify(merged))
console.log('Old grammar:', oldGrammar.length)
console.log('New HSK3.0 items:', newItems.length)
console.log('Total:', merged.length)

const counts = {}
for (const g of merged) counts[g.hsk] = (counts[g.hsk] ?? 0) + 1
console.log('Per level:', JSON.stringify(counts))
