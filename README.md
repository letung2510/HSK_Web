# 中文 HSK Việt — Học tiếng Trung miễn phí

Website học tiếng Trung **100% miễn phí, tĩnh** (không cần server) dành cho người Việt, bám sát chương trình **HSK 3.0 (2026, cấp 1-9)**.

## Tính năng

- **Từ vựng**: 11.105 từ HSK 3.0 (1-9), nghĩa tiếng Việt/Anh, pinyin, từ loại, tìm kiếm nhanh, phát âm
- **Ngữ pháp**: 70 chủ điểm HSK 1-4, giải thích tiếng Việt kèm ví dụ có pinyin + phát âm
- **Flashcard**: ôn tập lật thẻ, tự lưu tiến độ trên trình duyệt (localStorage)
- **Quiz**: trắc nghiệm 4 dạng câu hỏi, chấm điểm, xem lại đáp án, lưu điểm cao
- **Luyện nói**: đọc theo từ mẫu, nhận dạng giọng nói (Web Speech API) và chấm điểm phát âm
- **Phát âm**: Web Speech API — chạy ngay trong trình duyệt, không cần API key

## Công nghệ

- React 19 + Vite + react-router-dom
- CSS thuần (mobile-first, hỗ trợ dark mode)
- Deploy tĩnh lên GitHub Pages (`base: './'`)

## Chạy local

```bash
npm install --include=dev   # máy có npm config omit=dev thì cần cờ này
npm run dev                 # http://localhost:5173
npm run build               # build ra dist/
npm run lint                # oxlint
npm run deploy              # build + push lên GitHub Pages
```

## Deploy lên GitHub Pages

1. Tạo repo công khai trên GitHub (ví dụ `hsk-web`)
2. Đẩy code lên repo đó
3. Chạy `npm run deploy` (dùng package `gh-pages` — build và push nhánh `gh-pages`)
4. Vào GitHub → repo → Settings → Pages → chọn branch `gh-pages`
5. Website có địa chỉ: `https://<tên-người-dùng>.github.io/<tên-repo>/`

## Nguồn dữ liệu & bản quyền

- **Từ vựng HSK 3.0 (2026)**: repo nguồn mở [Punpuf/hsk-syllabus-vocabulary-parser](https://github.com/Punpuf/hsk-syllabus-vocabulary-parser) (MIT license) — trích xuất từ giáo trình chính thức, nghĩa tiếng Anh gốc từ **CC-CEDICT** (CC BY-SA 4.0).
- **Nghĩa tiếng Việt**: kế thừa bản dịch HSK 2.0 cũ cho các từ trùng; từ mới hiển thị nghĩa tiếng Anh.
- **Ngữ pháp**: tự biên soạn.
