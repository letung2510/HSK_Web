# 中文 HSK Việt — Học tiếng Trung miễn phí

Website học tiếng Trung **100% miễn phí, tĩnh** (không cần server) dành cho người Việt, bám sát chương trình **HSK 1-4 (chuẩn HSK 2.0)**.

## Tính năng

- **Từ vựng**: 1193 từ HSK 1-4, nghĩa tiếng Việt, pinyin, từ loại, tìm kiếm nhanh, phát âm
- **Ngữ pháp**: 70 chủ điểm HSK 1-4, giải thích tiếng Việt kèm ví dụ có pinyin + phát âm
- **Flashcard**: ôn tập lật thẻ, tự lưu tiến độ trên trình duyệt (localStorage)
- **Quiz**: trắc nghiệm 4 dạng câu hỏi, chấm điểm, xem lại đáp án, lưu điểm cao
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

- **Từ vựng HSK 2.0**: repo nguồn mở [drkameleon/complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary) (MIT license); nghĩa tiếng Anh gốc từ **CC-CEDICT**.
- **Nghĩa tiếng Việt**: tự dịch, rà soát thủ công.
- **Ngữ pháp**: tự biên soạn.
