# 數據職涯導覽｜NTU DAC

給臺大資料分析與決策社的職涯分享投影片。

## 這一版的主軸

內容從真實工作問題出發，帶大家看：

1. 分享者的背景與跨產業職涯路徑
2. 資料如何沿著產業鏈產生價值，以及資料職位為什麼變重要
3. DA、DS、DE 的責任差異與合作方式
4. 資料工程師日常遇到的取捨、維運與系統問題
5. 去識別化的資料工程案例
6. AI 時代學生可以怎麼準備
7. Q&A

## 簡報架構與章節（共 22 頁 / 22 個講者備註）

本簡報共 22 頁，各章節範圍如下：

- **01 自我介紹**（第 1–3 頁，共 3 頁）：`#intro-cover`、`#intro-now`、`#intro-path`
- **02 資料價值產業鏈**（第 4–6 頁，共 3 頁）：`#value-divider`、`#value-chain-map`、`#value-why-now`
- **03 初步認識 DA／DS／DE**（第 7–8 頁，共 2 頁）：`#roles-divider`、`#roles-map`（三角色常問問題、決定交付與主要風險比較表）
- **04 資料工作實務**（第 9–11 頁，共 3 頁）：`#work-divider`、`#work-collaboration`、`#work-de-daily`
- **05 我的路徑**（第 12–14 頁，共 3 頁）：`#career-divider`、`#career-timeline`（融合數學、大數據、後端、大規模處理、架構帶領五階段）、`#career-lessons`
- **06 實際案例分享**（第 15–17 頁，共 3 頁）：`#cases-divider`、`#case-ingestion`（標準化入口）、`#case-compute`（效能改善與驗證）
- **07 AI 時代該怎麼準備**（第 18–21 頁，共 4 頁）：`#ai-divider`、`#ai-changes`、`#ai-prep`、`#ai-90days`
- **08 Q&A**（第 22 頁，共 1 頁）：`#qa`

> **注意**：`sections/05-de-daily.html` 為歷史拆分留存檔案，目前未載入於 `deck-order.json`（DE 日常工作與取捨已整合進 04 章 `sections/04-collaboration.html` 的 `#work-de-daily`）。不變更檔名與載入順序。

## 模組化編輯方式

每個主題都是獨立的 HTML fragment，放在 `sections/`：

```text
sections/
├── 01-intro.html
├── 02-value-chain.html
├── 03-roles.html
├── 04-collaboration.html
├── 05-de-daily.html（未載入於 deck-order.json）
├── 06-career-path.html
├── 07-cases.html
├── 08-ai-era.html
└── 09-qa.html
```

投影片順序集中在 `deck-order.json`。要調整順序，只需要修改這個檔案中的 section 名稱，不用在大型 HTML 裡搬動整段內容。

修改後重新組裝：

```bash
python3 scripts/build_deck.py
```

`index.html` 是分享用、移除講者備註的版本；`index_note.html` 保留講者備註，供講者查看。兩者都由 `python3 scripts/build_deck.py` 產生；`index.template.html` 是外層 shell。平常內容編輯優先修改 `sections/*.html`，不要直接改組裝後的 HTML。

## 統一視覺系統

這版採用「Google 簡約設計風格（Google Material-inspired）」：

- 以 Google 簡約風格與配色為主，沿用 Google 字體（Google Sans / Roboto / Roboto Mono）與經典藍色標題（`#1a73e8` / `#4285f4`）
- 角色以 DA 藍（`#4285f4`）、DS 紅（`#ea4335`）、DE 綠（`#34a853`）點綴
- 白色與 `#f8f9fa` 背景、乾淨表格線條與自然留白
- 大字級、充足留白與清楚的閱讀順序，讓每頁只留下一個主要觀點
- 一張投影片只放一個主要觀點，再用案例、流程或責任表支撐
- 案例頁保留真實工程判斷，但不放公司名稱、客戶名稱、敏感欄位或未確認的內部數字

所有視覺規則集中在 `assets/style.css`；導覽、備註面板、hash、localStorage 與列印規則集中在 `assets/deck.js`。

## 開啟與操作

直接開啟 `index.html`，或在本機啟動靜態伺服器：

```bash
python3 -m http.server 8765
```

快捷鍵：

- `→`、`↓`、`PageDown`、空白鍵：下一張
- `←`、`↑`、`PageUp`：上一張
- `Home` / `End`：第一張／最後一張
- `1`–`9`、`0`：跳到前 10 張
- `N`：講者備註
- `F`：全螢幕
- `?` 或 `H`：快捷鍵說明
- 支援 URL hash，例如 `#12`
- 目前投影片位置會保存在瀏覽器 `localStorage`
- `⌘`／`Ctrl` + `P`：列印或輸出 PDF

## 內容安全邊界

投影片中的案例使用可公開、去識別化的技術情境。正式分享前，如果要放入更具體的公司案例、績效數字或架構圖，需先確認：

- 是否可以對外公開
- 是否需要移除公司、客戶與欄位資訊
- 數字的背景與口徑是否能被說明
- 是否仍然服務「職涯分享」主軸，而不是變成技術課程
