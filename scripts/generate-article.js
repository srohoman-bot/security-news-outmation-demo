#!/usr/bin/env node
/**
 * セキュリティニュース記事自動生成スクリプト
 * 使い方: node scripts/generate-article.js
 *         node scripts/generate-article.js --url <URL> --template standard --style default --output <ファイル名>
 */

import { createInterface } from 'readline';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'util';

// ESM 環境での __dirname 相当
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

// ============================
// コマンドライン引数の解析
// ============================
const { values: args } = parseArgs({
  options: {
    url:      { type: 'string' },
    template: { type: 'string', default: 'standard' },
    style:    { type: 'string', default: 'default' },
    output:   { type: 'string' },
  },
  strict: false,
});

// ============================
// ユーザー入力ヘルパー
// ============================
const rl = createInterface({ input: process.stdin, output: process.stdout });

/**
 * ユーザーに質問して回答を受け取る
 * @param {string} question 質問文
 * @param {string} [defaultValue] 省略時のデフォルト値
 * @returns {Promise<string>}
 */
function ask(question, defaultValue = '') {
  const hint = defaultValue ? ` (デフォルト: ${defaultValue})` : '';
  return new Promise((resolve) => {
    rl.question(`\n${question}${hint}\n> `, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

/**
 * 選択肢から選ばせる
 * @param {string} question 質問文
 * @param {{ label: string, value: string }[]} choices 選択肢
 * @param {string} defaultValue デフォルト値
 * @returns {Promise<string>}
 */
async function askChoice(question, choices, defaultValue) {
  console.log(`\n${question}`);
  choices.forEach((c, i) => {
    const mark = c.value === defaultValue ? ' ← デフォルト' : '';
    console.log(`  ${i + 1}. ${c.label}${mark}`);
  });
  const answer = await ask('番号を入力してください', String(choices.findIndex(c => c.value === defaultValue) + 1));
  const idx = parseInt(answer, 10) - 1;
  if (idx >= 0 && idx < choices.length) return choices[idx].value;
  return defaultValue;
}

// ============================
// HTML 取得・タイトル抽出
// ============================

/**
 * URL から HTML を取得する
 * @param {string} url
 * @returns {Promise<string>} HTML 文字列
 */
async function fetchHtml(url) {
  console.log(`\n🔍 URL にアクセス中: ${url}`);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15秒タイムアウト
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 SecurityNewsBot/1.0' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * HTML からページタイトルを抽出する（正規表現ベース・依存なし）
 * @param {string} html
 * @returns {string}
 */
function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (m) return m[1].replace(/\s+/g, ' ').trim();
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1) return h1[1].replace(/\s+/g, ' ').trim();
  return 'タイトル不明';
}

/**
 * HTML から本文テキストを抽出する（簡易版）
 * @param {string} html
 * @returns {string}
 */
function extractText(html) {
  // スクリプト・スタイルを除去
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')  // タグを除去
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, ' ')
    .trim();
  // 先頭 3000 文字に絞る（Copilot へのコンテキスト制限を意識）
  return text.slice(0, 3000);
}

// ============================
// テンプレート読み込み
// ============================

/**
 * HTML テンプレートを読み込む
 * @param {string} templateName テンプレート名（standard / technical / executive）
 * @returns {string}
 */
function loadTemplate(templateName) {
  const names = { standard: 'article-template', technical: 'article-template', executive: 'executive-summary' };
  const fileName = names[templateName] || 'article-template';
  const path = join(ROOT_DIR, 'templates', `${fileName}.html`);
  if (!existsSync(path)) {
    console.warn(`⚠️ テンプレート ${fileName}.html が見つかりません。デフォルトを使用します。`);
    return readFileSync(join(ROOT_DIR, 'templates', 'article-template.html'), 'utf-8');
  }
  return readFileSync(path, 'utf-8');
}

/**
 * CSS スタイルを読み込む
 * @param {string} styleName スタイル名（default / dark / minimal）
 * @returns {string}
 */
function loadStyle(styleName) {
  const names = { default: 'article', dark: 'dark-theme', minimal: 'minimal' };
  const fileName = names[styleName] || 'article';
  const path = join(ROOT_DIR, 'templates', 'styles', `${fileName}.css`);
  if (!existsSync(path)) {
    console.warn(`⚠️ スタイル ${fileName}.css が見つかりません。デフォルトを使用します。`);
    return readFileSync(join(ROOT_DIR, 'templates', 'styles', 'article.css'), 'utf-8');
  }
  return readFileSync(path, 'utf-8');
}

// ============================
// コンテンツ生成（プレースホルダー置換）
// ============================

/**
 * 記事データからプレースホルダーを置換して HTML を生成する
 * @param {string} template
 * @param {object} data
 * @returns {string}
 */
function buildHtml(template, data) {
  return template
    .replace('{{INLINE_CSS}}', data.css)
    .replace(/\{\{ARTICLE_TITLE\}\}/g, escapeHtml(data.title))
    .replace(/\{\{GENERATED_DATE\}\}/g, data.generatedDate)
    .replace(/\{\{SOURCE_URL\}\}/g, escapeHtml(data.sourceUrl))
    .replace(/\{\{SOURCE_DOMAIN\}\}/g, escapeHtml(data.sourceDomain))
    .replace(/\{\{SEVERITY_LEVEL\}\}/g, data.severityLevel)
    .replace(/\{\{SEVERITY_LABEL\}\}/g, escapeHtml(data.severityLabel))
    .replace('{{SUMMARY}}', escapeHtml(data.summary))
    .replace('{{KEY_POINTS}}', data.keyPoints.map(p => `<li>${escapeHtml(p)}</li>`).join('\n        '))
    .replace('{{AFFECTED_SYSTEMS}}', escapeHtml(data.affectedSystems))
    .replace('{{RECOMMENDED_ACTIONS}}', data.actions.map(a => `<li>${escapeHtml(a)}</li>`).join('\n        '))
    .replace('{{REFERENCES}}', `<li><a href="${escapeHtml(data.sourceUrl)}" target="_blank" rel="noopener noreferrer">元記事: ${escapeHtml(data.sourceDomain)}</a></li>`);
}

/**
 * HTML エスケープ
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================
// メイン処理
// ============================
async function main() {
  console.log('\n═══════════════════════════════════════════');
  console.log('  🛡️  セキュリティニュース記事自動生成ツール');
  console.log('═══════════════════════════════════════════\n');

  // --- 1. URL の取得 ---
  let url = args.url;
  if (!url) {
    url = await ask('記事を生成したいセキュリティニュースの URL を入力してください');
  }
  if (!url) {
    console.error('❌ URL が入力されていません。終了します。');
    process.exit(1);
  }

  // URL の簡易バリデーション
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('http または https の URL を入力してください');
    }
  } catch (e) {
    console.error(`❌ 無効な URL です: ${e.message}`);
    process.exit(1);
  }

  // --- 2. テンプレート選択 ---
  let templateName = args.template;
  if (!args.url) { // 対話モードの場合のみ聞く
    templateName = await askChoice('記事テンプレートを選んでください', [
      { label: '標準テンプレート（デフォルト）', value: 'standard' },
      { label: '技術者向け詳細レポート', value: 'technical' },
      { label: 'エグゼクティブサマリー', value: 'executive' },
    ], 'standard');
  }

  // --- 3. スタイル選択 ---
  let styleName = args.style;
  if (!args.url) {
    styleName = await askChoice('デザインテーマを選んでください', [
      { label: 'デフォルト（白背景）', value: 'default' },
      { label: 'ダークテーマ', value: 'dark' },
      { label: 'シンプルミニマル', value: 'minimal' },
    ], 'default');
  }

  // --- 4. 出力ファイル名 ---
  const defaultFileName = `${parsedUrl.hostname.replace(/\./g, '-')}-${new Date().toISOString().slice(0, 10)}`;
  let outputName = args.output;
  if (!args.url) {
    outputName = await ask('出力ファイル名（.html は自動付与）', defaultFileName);
  }
  outputName = outputName || defaultFileName;

  rl.close();

  // --- 5. HTML 取得 ---
  let html;
  try {
    html = await fetchHtml(url);
  } catch (err) {
    console.error(`\n❌ URL へのアクセスに失敗しました: ${err.message}`);
    console.error('   プロキシ設定や URL が正しいか確認してください。');
    process.exit(1);
  }

  const rawTitle = extractTitle(html);
  const bodyText = extractText(html);

  console.log(`\n✅ コンテンツ取得成功`);
  console.log(`   タイトル: ${rawTitle}`);
  console.log(`   本文文字数: ${bodyText.length} 文字`);

  // --- 6. 記事データを組み立て（デモ用プレースホルダー） ---
  const now = new Date();
  const data = {
    title: rawTitle,
    generatedDate: now.toLocaleString('ja-JP'),
    sourceUrl: url,
    sourceDomain: parsedUrl.hostname,
    severityLevel: 'high',
    severityLabel: '🟠 高',
    summary: `この記事は「${rawTitle}」についての情報です。` +
      `取得元: ${parsedUrl.hostname}。` +
      `Copilot Chat で #news-article-generator スキルを使うと、内容の日本語要約が自動生成されます。`,
    keyPoints: [
      'セキュリティ情報を Copilot スキルで自動要約できます',
      `取得元ドメイン: ${parsedUrl.hostname}`,
      '重要ポイントは Copilot Chat の #news-article-generator で生成してください',
      '推奨アクションも同スキルで提案を受けられます',
    ],
    affectedSystems: `取得元: ${url}\n詳細は Copilot Chat で確認してください。`,
    actions: [
      '(高) Copilot Chat で #news-article-generator を実行して内容を確認する',
      '(中) 生成されたレポートを社内共有する',
      '(低) 対策状況をチェックリストで記録する',
    ],
    css: '',
  };

  // --- 7. テンプレートとスタイルを読み込んで組み立て ---
  const templateHtml = loadTemplate(templateName);
  data.css = loadStyle(styleName);

  const outputHtml = buildHtml(templateHtml, data);

  // --- 8. ファイルに書き出す ---
  const outputDir = join(ROOT_DIR, 'output');
  mkdirSync(outputDir, { recursive: true });

  const safeFileName = outputName.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const outputPath = join(outputDir, `${safeFileName}.html`);
  writeFileSync(outputPath, outputHtml, 'utf-8');

  console.log('\n═══════════════════════════════════════════');
  console.log('  ✅ 記事の生成が完了しました！');
  console.log(`  📄 ファイル: output/${safeFileName}.html`);
  console.log('───────────────────────────────────────────');
  console.log('  次のステップ:');
  console.log('  1. VS Code で output フォルダを開いて HTML を確認');
  console.log('  2. Copilot Chat で #news-article-generator を使って');
  console.log('     より詳細な日本語要約を生成する');
  console.log('  3. git add . && git commit -m "feat: 記事を追加"');
  console.log('═══════════════════════════════════════════\n');
}

main().catch((err) => {
  console.error(`\n❌ 予期しないエラー: ${err.message}`);
  process.exit(1);
});
