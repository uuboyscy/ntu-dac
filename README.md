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

## 模組化編輯方式

每個主題都是獨立的 HTML fragment，放在 `sections/`：

```text
sections/
├── 01-intro.html
├── 02-value-chain.html
├── 03-roles.html
├── 04-collaboration.html
├── 05-de-daily.html
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

`index.html` 是組裝後的可播放版本；`index.template.html` 是外層 shell。平常內容編輯優先修改 `sections/*.html`，不要直接改組裝後的 `index.html`。

## 統一視覺系統

這版採用「Apple-inspired Engineering Notes」方向：

- 白色、#f5f5f7 surface、黑底章節頁、單一 Apple blue signal color
- 大字級、充足留白與清楚的閱讀順序，讓每頁只留下一個主要觀點
- 系統字體處理標題與內文，等寬字保留系統狀態與技術語境
- 一張投影片只放一個主要觀點，再用案例、流程或責任表支撐
- 只在導覽列與浮動面板使用輕量 blur；投影片本身不使用漸層、裝飾性 icon 或沒有根據的數字
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
