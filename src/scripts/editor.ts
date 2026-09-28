import "@shoelace-style/shoelace/dist/shoelace.js";

type BlockType = "heading" | "paragraph" | "image" | "link";
type ReviewStatus = "pending" | "approved" | "needs-work";
type Severity = "error" | "warning" | "info";

interface CommentReply {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

interface CommentItem {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  resolved: boolean;
  replies: CommentReply[];
}

interface ContentBlock {
  id: string;
  type: BlockType;
  text: string;
  accessibleText: string;
  headingLevel?: number;
  imageSrc?: string;
  imageAlt?: string;
  linkHref?: string;
  changeReason: string;
  reviewStatus: ReviewStatus;
  comments: CommentItem[];
}

interface GlossaryTerm {
  id: string;
  source: string;
  preferred: string;
  note: string;
}

interface VersionSnapshot {
  id: string;
  label: string;
  createdAt: string;
  blocks: ContentBlock[];
  glossary: GlossaryTerm[];
}

interface ChapterProject {
  id: string;
  title: string;
  subject: string;
  grade: string;
  blocks: ContentBlock[];
  glossary: GlossaryTerm[];
  versions: VersionSnapshot[];
  updatedAt: string;
}

interface AccessibilityIssue {
  id: string;
  blockId: string;
  type: "heading" | "link" | "image" | "glossary" | "sentence";
  severity: Severity;
  title: string;
  detail: string;
  suggestion: string;
}

const STORAGE_KEY = "sologsb-1009-accessible-textbook-v1";
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function createSeedProject(): ChapterProject {
  const blocks: ContentBlock[] = [
    {
      id: "block-h1",
      type: "heading",
      headingLevel: 1,
      text: "第三章 水循环与城市",
      accessibleText: "第三章 水循环与城市",
      changeReason: "",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-p1",
      type: "paragraph",
      text: "城市中的水并非取之不尽，由于其会通过蒸发、降水以及地表径流等若干复杂过程在自然界中持续循环，因此理解这些过程对于建设具有韧性的城市具有十分重要的意义。",
      accessibleText: "城市里的水会不断循环。它经过蒸发、降水并沿地面流动。了解这些过程，可以帮助我们建设更能适应变化的城市。",
      changeReason: "拆分长句，把抽象表述改为更直接的说明。",
      reviewStatus: "pending",
      comments: [],
    },
    {
      id: "block-h2",
      type: "heading",
      headingLevel: 2,
      text: "一、水从哪里来",
      accessibleText: "一、水从哪里来",
      changeReason: "保留原章节结构。",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-img",
      type: "image",
      text: "图 3-1 城市水循环示意",
      imageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='420'%3E%3Crect width='800' height='420' fill='%23dcecf3'/%3E%3Ccircle cx='650' cy='85' r='45' fill='%23f4c95d'/%3E%3Cpath d='M0 300 Q180 240 340 300 T800 280 V420 H0Z' fill='%2389b7d0'/%3E%3Cpath d='M130 285 Q220 170 330 285' fill='none' stroke='%233a7c9e' stroke-width='12'/%3E%3C/svg%3E",
      imageAlt: "",
      accessibleText: "",
      changeReason: "",
      reviewStatus: "needs-work",
      comments: [],
    },
    {
      id: "block-p2",
      type: "paragraph",
      text: "当太阳照射到水面时，水会受热变成水蒸气升到空中。水蒸气冷却后形成云，再以雨或雪的形式落回地面。",
      accessibleText: "太阳照在水面上，水会变成水蒸气升到空中。水蒸气冷却后变成云，最后以雨或雪落回地面。",
      changeReason: "使用较短句子，并明确每个步骤的先后顺序。",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-link",
      type: "link",
      text: "点击这里",
      linkHref: "/resources/water-cycle",
      accessibleText: "打开水循环互动实验",
      changeReason: "改为说明链接目标的独立文案。",
      reviewStatus: "pending",
      comments: [],
    },
    {
      id: "block-h3",
      type: "heading",
      headingLevel: 3,
      text: "雨水花园怎样工作",
      accessibleText: "雨水花园怎样工作",
      changeReason: "",
      reviewStatus: "approved",
      comments: [],
    },
    {
      id: "block-p3",
      type: "paragraph",
      text: "雨水花园利用土壤和植物的共同作用暂时储存雨水，同时通过下渗补给地下水，并在降雨较集中时减轻城市排水管道所承受的压力。",
      accessibleText: "雨水花园用土壤和植物暂时存住雨水。雨水还会慢慢渗入地下，补充地下水。雨很大时，它可以减轻排水管的压力。",
      changeReason: "把并列成分拆成短句，减少专业术语密度。",
      reviewStatus: "pending",
      comments: [],
    },
  ];

  return {
    id: "accessible-textbook-1009",
    title: "科学（五年级下册）·无障碍改写稿",
    subject: "科学",
    grade: "五年级",
    blocks,
    glossary: [
      { id: "term-1", source: "水循环", preferred: "水循环", note: "全书统一使用" },
      { id: "term-2", source: "地表径流", preferred: "沿地面流动的水", note: "首次出现时使用通俗解释" },
      { id: "term-3", source: "下渗", preferred: "渗入地下", note: "避免单独使用专业词" },
    ],
    versions: [],
    updatedAt: new Date().toISOString(),
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseImportedChapter(input: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push(blankBlock("heading", heading[2], { headingLevel: heading[1].length }));
      continue;
    }
    const image = /^!\[([^\]]*)\]\(([^)]+)\)(?:\s+(.+))?$/.exec(line);
    if (image) {
      blocks.push(blankBlock("image", image[3] || "未命名图片", { imageSrc: image[2], imageAlt: image[1] }));
      continue;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(line);
    if (link) {
      blocks.push(blankBlock("link", link[1], { linkHref: link[2] }));
      continue;
    }
    blocks.push(blankBlock("paragraph", line));
  }
  return blocks.length ? blocks : [blankBlock("paragraph", input.trim() || "请输入章节内容")];
}

function blankBlock(type: BlockType, text: string, extra: Partial<ContentBlock> = {}): ContentBlock {
  return {
    id: uid("block"),
    type,
    text,
    accessibleText: type === "image" ? extra.imageAlt ?? "" : text,
    changeReason: "",
    reviewStatus: "pending",
    comments: [],
    ...extra,
  };
}

function sentenceLength(text: string) {
  const normalized = text.replace(/\s+/g, "");
  return /[A-Za-z]/.test(text) ? text.trim().split(/\s+/).length : normalized.length;
}

function analyze(project: ChapterProject): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  let lastHeading = 0;
  for (const block of project.blocks) {
    if (block.type === "heading") {
      const level = block.headingLevel ?? 2;
      if (lastHeading && level > lastHeading + 1) {
        issues.push({
          id: `heading-${block.id}`,
          blockId: block.id,
          type: "heading",
          severity: "error",
          title: "标题层级跳跃",
          detail: `从 H${lastHeading} 直接到 H${level}，读屏用户会失去清晰的章节结构。`,
          suggestion: `改为 H${lastHeading + 1}，或补上中间的上级标题。`,
        });
      }
      lastHeading = level;
    }
    if (block.type === "image" && !(block.imageAlt ?? block.accessibleText).trim()) {
      issues.push({
        id: `image-${block.id}`,
        blockId: block.id,
        type: "image",
        severity: "error",
        title: "图片缺少替代文本",
        detail: "视觉用户能看到的图表信息，读屏用户目前无法获得。",
        suggestion: "说明图中主体、变化和结论；纯装饰图片应标记为空替代文本。",
      });
    }
    if (block.type === "link") {
      const label = block.accessibleText || block.text;
      if (/^(点击这里|这里|链接|更多|here|click here|read more)$/i.test(label.trim())) {
        issues.push({
          id: `link-${block.id}`,
          blockId: block.id,
          type: "link",
          severity: "error",
          title: "链接文案缺少目的",
          detail: `“${label}”单独朗读时无法说明会前往哪里。`,
          suggestion: "改成“打开水循环互动实验”等可独立理解的文案。",
        });
      }
    }
    const text = block.type === "image" ? block.text : block.text;
    const sentences = text.split(/(?<=[。！？!?])\s*/).filter(Boolean);
    for (const [index, sentence] of sentences.entries()) {
      if (sentenceLength(sentence) > (/[A-Za-z]/.test(sentence) ? 28 : 42)) {
        issues.push({
          id: `sentence-${block.id}-${index}`,
          blockId: block.id,
          type: "sentence",
          severity: "warning",
          title: "句子过长",
          detail: `该句约 ${sentenceLength(sentence)} ${/[A-Za-z]/.test(sentence) ? "个词" : "个字"}，一次理解的信息较多。`,
          suggestion: "按动作或因果关系拆成 2—3 个短句。",
        });
      }
    }
    const source = `${block.text} ${block.accessibleText}`;
    for (const term of project.glossary) {
      if (source.includes(term.source) && block.accessibleText && !block.accessibleText.includes(term.preferred)) {
        issues.push({
          id: `term-${block.id}-${term.id}`,
          blockId: block.id,
          type: "glossary",
          severity: "info",
          title: `术语“${term.source}”尚未统一`,
          detail: `全书建议表述为“${term.preferred}”。${term.note}`,
          suggestion: `将无障碍文本调整为“${term.preferred}”。`,
        });
      }
    }
  }
  return issues;
}

function simplifyText(input: string, glossary: GlossaryTerm[]) {
  let result = input
    .replaceAll("由于其", "因为")
    .replaceAll("因此", "所以")
    .replaceAll("具有十分重要的意义", "很重要")
    .replaceAll("利用", "使用")
    .replaceAll("共同作用", "一起作用")
    .replaceAll("暂时储存", "暂时存住")
    .replaceAll("所承受的压力", "受到的压力")
    .replace(/([^。！？]{38,}?)[，、]([^。！？]{12,}?[。！？])/g, "$1。$2");
  for (const term of glossary) {
    if (result.includes(term.source)) result = result.replaceAll(term.source, term.preferred);
  }
  result = result
    .split(/(?<=[。！？!?])\s*/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .join("\n");
  return result;
}

function blockRole(block: ContentBlock) {
  if (block.type === "heading") return `H${block.headingLevel ?? 2} 标题`;
  if (block.type === "image") return "图片 / 替代文本";
  if (block.type === "link") return "链接";
  return "正文段落";
}

function statusLabel(status: ReviewStatus) {
  if (status === "approved") return "已通过";
  if (status === "needs-work") return "需修改";
  return "待审核";
}

function severityLabel(severity: Severity) {
  if (severity === "error") return "必须修复";
  if (severity === "warning") return "建议优化";
  return "一致性提醒";
}

interface ReviewSummary {
  total: number;
  approved: number;
  pending: number;
  needsWork: number;
  errors: number;
  warnings: number;
  infos: number;
  totalIssues: number;
}

function buildReviewSummary(project: ChapterProject, list: AccessibilityIssue[] = analyze(project)): ReviewSummary {
  return {
    total: project.blocks.length,
    approved: project.blocks.filter((block) => block.reviewStatus === "approved").length,
    pending: project.blocks.filter((block) => block.reviewStatus === "pending").length,
    needsWork: project.blocks.filter((block) => block.reviewStatus === "needs-work").length,
    errors: list.filter((issue) => issue.severity === "error").length,
    warnings: list.filter((issue) => issue.severity === "warning").length,
    infos: list.filter((issue) => issue.severity === "info").length,
    totalIssues: list.length,
  };
}

function visibleIssues(project: ChapterProject, list: AccessibilityIssue[]) {
  const blockById = new Map(project.blocks.map((block) => [block.id, block]));
  return list.filter((issue) => {
    if (issueSeverityFilter !== "all" && issue.severity !== issueSeverityFilter) return false;
    if (issueStatusFilter !== "all" && blockById.get(issue.blockId)?.reviewStatus !== issueStatusFilter) return false;
    return true;
  });
}

function exportHtml(project: ChapterProject) {
  const list = analyze(project);
  const summary = buildReviewSummary(project, list);
  const issuesByBlock = new Map<string, AccessibilityIssue[]>();
  for (const issue of list) {
    issuesByBlock.set(issue.blockId, [...(issuesByBlock.get(issue.blockId) ?? []), issue]);
  }
  const body = project.blocks.map((block) => {
    if (block.type === "heading") {
      const level = Math.min(6, Math.max(1, block.headingLevel ?? 2));
      return `<h${level}>${escapeHtml(block.accessibleText || block.text)}</h${level}>`;
    }
    if (block.type === "image") {
      return `<figure><img src="${escapeHtml(block.imageSrc ?? "")}" alt="${escapeHtml(block.imageAlt || block.accessibleText)}"><figcaption>${escapeHtml(block.text)}</figcaption></figure>`;
    }
    if (block.type === "link") {
      return `<p><a href="${escapeHtml(block.linkHref ?? "#")}">${escapeHtml(block.accessibleText || block.text)}</a></p>`;
    }
    return `<p>${escapeHtml(block.accessibleText || block.text)}</p>`;
  }).join("\n      ");
  const summaryRows = project.blocks.map((block, index) => {
    const blockIssues = issuesByBlock.get(block.id) ?? [];
    const issueText = blockIssues.length
      ? blockIssues.map((issue) => `${severityLabel(issue.severity)}：${issue.title} — ${escapeHtml(issue.detail)}`).join("<br>")
      : "无未解决问题";
    const headingExtra = block.type === "heading" ? `（H${block.headingLevel ?? 2}）` : "";
    return `<tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(blockRole(block))}${headingExtra}</td>
      <td><span class="summary-status status-${block.reviewStatus}">${statusLabel(block.reviewStatus)}</span></td>
      <td>${escapeHtml(block.changeReason || "（未记录改写原因）")}</td>
      <td class="summary-issues">${issueText}</td>
    </tr>`;
  }).join("\n        ");
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(project.title)} · 无障碍版本</title>
  <style>
    :root { font-family: "Noto Sans SC", sans-serif; font-size: 20px; line-height: 1.85; color: #17231f; background: #fffdf7; }
    body { max-width: 860px; margin: 0 auto; padding: 32px 24px 80px; }
    a { color: #075c9d; text-decoration-thickness: 2px; text-underline-offset: 3px; }
    a:focus-visible, [tabindex]:focus-visible { outline: 4px solid #d08a00; outline-offset: 3px; }
    h1, h2, h3, h4, h5, h6 { line-height: 1.4; margin-top: 1.8em; }
    figure { margin: 2em 0; } img { max-width: 100%; height: auto; } figcaption { font-size: .86em; color: #46554f; }
    .skip { position: absolute; left: -9999px; } .skip:focus { position: static; display: inline-block; padding: .5em; background: #fff; }
    .handoff-summary { margin-top: 3.5em; border-top: 3px solid #1f4a3e; padding-top: 1.4em; }
    .handoff-summary h2 { margin-top: 0; }
    .summary-meta { color: #46554f; font-size: .82em; }
    .summary-stats { display: flex; flex-wrap: wrap; gap: 10px; margin: 1em 0; }
    .summary-stats span { border-radius: 999px; padding: 5px 12px; font-size: .8em; font-weight: 700; background: #eef2f0; color: #2a3a35; }
    .summary-stats .stat-approved { background: #e2f3ea; color: #1f6b48; }
    .summary-stats .stat-pending { background: #fdf0d6; color: #8a5209; }
    .summary-stats .stat-needs { background: #fbe9e7; color: #98261f; }
    .summary-stats .stat-issues { background: #e7f1f8; color: #1f5e8b; }
    table { width: 100%; border-collapse: collapse; margin-top: 1em; font-size: .78em; }
    caption { text-align: left; font-weight: 700; margin-bottom: .5em; }
    th, td { border: 1px solid #d7ddd9; padding: 8px 10px; vertical-align: top; text-align: left; }
    th { background: #f1f3f0; }
    .summary-status { display: inline-block; border-radius: 999px; padding: 2px 10px; font-size: .92em; white-space: nowrap; }
    .status-approved { background: #e2f3ea; color: #1f6b48; }
    .status-pending { background: #fdf0d6; color: #8a5209; }
    .status-needs-work { background: #fbe9e7; color: #98261f; }
    .summary-issues { color: #3a4944; }
  </style>
</head>
<body>
  <a class="skip" href="#main">跳到正文</a>
  <main id="main" tabindex="-1">
      ${body}

      <section class="handoff-summary" aria-labelledby="handoff-title">
        <h2 id="handoff-title">审校摘要（交接复审）</h2>
        <p class="summary-meta">教材：${escapeHtml(project.title)}（${escapeHtml(project.subject)} · ${escapeHtml(project.grade)}）<br>
          导出生成时间：${escapeHtml(new Date().toLocaleString())}。以下数字与编辑工作台页面进度一致。</p>
        <div class="summary-stats">
          <span>内容块总数：${summary.total}</span>
          <span class="stat-approved">已通过：${summary.approved}/${summary.total}</span>
          <span class="stat-pending">待审核：${summary.pending}</span>
          <span class="stat-needs">需修改：${summary.needsWork}</span>
          <span class="stat-issues">剩余问题：${summary.totalIssues}（必须修复 ${summary.errors} · 建议优化 ${summary.warnings} · 一致性提醒 ${summary.infos}）</span>
        </div>
        <table>
          <caption>各内容块的审校状态、改写原因与剩余问题</caption>
          <thead>
            <tr><th scope="col">序号</th><th scope="col">内容块</th><th scope="col">审校状态</th><th scope="col">改写原因</th><th scope="col">剩余问题</th></tr>
          </thead>
          <tbody>
        ${summaryRows}
          </tbody>
        </table>
      </section>
  </main>
</body>
</html>`;
}

function download(filename: string, content: string, type = "text/html;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function loadProject(): ChapterProject {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "") as { schema: number; project: ChapterProject };
    if (stored.schema === 1 && stored.project?.blocks?.length) return stored.project;
  } catch {
    // Fall back to the bundled sample.
  }
  return createSeedProject();
}

const rootElement = document.querySelector<HTMLDivElement>("#app");
if (!rootElement) throw new Error("Application root was not found");
const app: HTMLDivElement = rootElement;

let project = loadProject();
let activeBlockId = project.blocks[0]?.id ?? "";
let activeIssueId = "";
let previewMode: "normal" | "assisted" = "normal";
let selectedVersionId = "";
let showGlossary = false;
let issueSeverityFilter: "all" | Severity = "all";
let issueStatusFilter: "all" | ReviewStatus = "all";
let showVersionCompare = false;
let showRestoreConfirm = false;
let restoreVersionId = "";
let undoStack: ChapterProject[] = [];
let redoStack: ChapterProject[] = [];
let saveTimer = 0;

const activeBlock = () => project.blocks.find((block) => block.id === activeBlockId) ?? project.blocks[0];
const issues = () => analyze(project);

function saveSoon() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ schema: 1, project }));
  }, 320);
}

function commit(label: string, update: (draft: ChapterProject) => void, renderAfter = true) {
  undoStack = [...undoStack.slice(-49), structuredClone(project)];
  redoStack = [];
  const draft = structuredClone(project);
  update(draft);
  draft.updatedAt = new Date().toISOString();
  project = draft;
  document.documentElement.dataset.lastAction = label;
  saveSoon();
  if (renderAfter) render();
}

function undo() {
  const previous = undoStack.pop();
  if (!previous) return;
  redoStack = [structuredClone(project), ...redoStack].slice(0, 50);
  project = previous;
  if (!project.blocks.some((block) => block.id === activeBlockId)) activeBlockId = project.blocks[0]?.id ?? "";
  saveSoon();
  render();
}

function redo() {
  const next = redoStack.shift();
  if (!next) return;
  undoStack = [...undoStack.slice(-49), structuredClone(project)];
  project = next;
  saveSoon();
  render();
}

/** 以块 id 对齐两个块序列；当前稿独有块保留在原相邻位置。 */
function mergeBlockLists(snapshot: ContentBlock[], current: ContentBlock[]): ContentBlock[] {
  const restored: ContentBlock[] = [];
  const placed = new Set<string>();
  snapshot.forEach((oldBlock, index) => {
    // 同 id 块一律以快照内容替换该块自身；当前稿中找不到同 id 时即为插回的缺失块。
    restored.push(structuredClone(oldBlock));
    placed.add(oldBlock.id);
    const nextOldId = snapshot[index + 1]?.id;
    const end = nextOldId ? current.findIndex((block) => block.id === nextOldId) : current.length;
    const start = current.findIndex((block) => block.id === oldBlock.id);
    for (let cursor = start + 1; cursor >= 0 && cursor < end; cursor++) {
      const candidate = current[cursor];
      if (!placed.has(candidate.id) && !snapshot.some((item) => item.id === candidate.id)) {
        restored.push(structuredClone(candidate));
        placed.add(candidate.id);
      }
    }
  });
  current.forEach((block) => {
    if (!placed.has(block.id)) restored.push(structuredClone(block));
  });
  return restored;
}

/**
 * 按块 id 从快照恢复整章：
 * - 同 id 块：仅替换该块自身内容，按快照顺序排列；
 * - 快照独有块：按快照位置插回；
 * - 当前稿独有块：保留不动，绝不被错位覆盖或删除。
 */
function mergeRestoreVersion(versionId: string) {
  const version = project.versions.find((item) => item.id === versionId);
  if (!version) return;
  showRestoreConfirm = false;
  showVersionCompare = false;
  restoreVersionId = "";
  commit("从快照恢复整章", (draft) => {
    draft.blocks = mergeBlockLists(version.blocks, draft.blocks);
    draft.glossary = structuredClone(version.glossary);
  });
  if (!project.blocks.some((block) => block.id === activeBlockId)) activeBlockId = project.blocks[0]?.id ?? "";
}

function updateActiveBlock(update: (block: ContentBlock, draft: ChapterProject) => void, label = "修改无障碍文本", renderAfter = true) {
  commit(label, (draft) => {
    const block = draft.blocks.find((item) => item.id === activeBlockId);
    if (block) update(block, draft);
  }, renderAfter);
}

function render() {
  const list = issues();
  const summary = buildReviewSummary(project, list);
  const active = activeBlock();
  const activeIssues = list.filter((issue) => issue.blockId === active.id);
  const approved = summary.approved;
  const shownIssues = visibleIssues(project, list);
  const version = project.versions.find((item) => item.id === selectedVersionId) ?? project.versions[0];

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand"><span>无障碍</span><b>1009</b></div>
        <div class="title-block">
          <input id="project-title" aria-label="教材名称" value="${escapeHtml(project.title)}" />
          <div class="meta"><span>${escapeHtml(project.subject)}</span><span>${escapeHtml(project.grade)}</span><span class="save-dot">本地自动保存</span></div>
        </div>
        <div class="top-actions">
          <span class="online-pill">${navigator.onLine ? "在线" : "离线可编辑"}</span>
          <sl-button size="small" variant="default" ${undoStack.length ? "" : "disabled"} data-action="undo">撤销</sl-button>
          <sl-button size="small" variant="default" ${redoStack.length ? "" : "disabled"} data-action="redo">重做</sl-button>
          <sl-button size="small" variant="default" data-action="glossary">术语表</sl-button>
          <sl-button size="small" variant="primary" data-action="save-version">保存版本</sl-button>
          <sl-button size="small" variant="success" data-action="export">导出无障碍 HTML</sl-button>
        </div>
      </header>

      <div class="progress-strip">
        <div class="progress-copy"><b>${approved}/${project.blocks.length}</b><span>内容块已审核通过</span></div>
        <div class="progress-bar"><i style="width:${Math.round((approved / Math.max(1, project.blocks.length)) * 100)}%"></i></div>
        <div class="issue-counts">
          <button type="button" class="filter-chip ${issueSeverityFilter === "all" ? "active" : ""}" data-action="filter-severity" data-value="all">全部问题 ${list.length}</button>
          <button type="button" class="filter-chip error ${issueSeverityFilter === "error" ? "active" : ""}" data-action="filter-severity" data-value="error">${summary.errors} 必须修复</button>
          <button type="button" class="filter-chip warning ${issueSeverityFilter === "warning" ? "active" : ""}" data-action="filter-severity" data-value="warning">${summary.warnings} 建议优化</button>
          <button type="button" class="filter-chip info ${issueSeverityFilter === "info" ? "active" : ""}" data-action="filter-severity" data-value="info">${summary.infos} 术语提醒</button>
        </div>
      </div>

      <div class="workspace">
        <aside class="outline-panel">
          <div class="panel-title"><span>章节结构</span><sl-badge>${project.blocks.length} 块</sl-badge></div>
          <div class="block-list">
            ${project.blocks.map((block, index) => {
              const blockIssues = list.filter((issue) => issue.blockId === block.id);
              return `<button class="block-item ${block.id === active.id ? "active" : ""}" data-action="select-block" data-block-id="${block.id}">
                <span class="block-order">${index + 1}</span>
                <span class="block-copy"><b>${block.type === "heading" ? `H${block.headingLevel}` : blockRole(block)}</b><span>${escapeHtml(block.accessibleText || block.text || "（空）")}</span></span>
                <i class="status-${block.reviewStatus}" title="${statusLabel(block.reviewStatus)}"></i>
                ${blockIssues.length ? `<em>${blockIssues.length}</em>` : ""}
              </button>`;
            }).join("")}
          </div>
          <input id="chapter-file" type="file" accept=".txt,.md,.markdown" hidden />
          <sl-button class="import-button" variant="default" data-action="import">导入章节文本</sl-button>
          <div class="keyboard-note"><b>键盘</b><span><kbd>J</kbd><kbd>K</kbd> 跳转问题</span><span><kbd>E</kbd> 自动改写</span><span><kbd>⌘ Z</kbd> 撤销</span><span><kbd>1</kbd><kbd>2</kbd> 预览模式</span></div>
        </aside>

        <main class="editor-panel">
          <div class="editor-head">
            <div><span class="eyebrow">当前内容块</span><h1>${blockRole(active)}</h1></div>
            <div class="review-actions">
              <sl-button size="small" variant="${active.reviewStatus === "approved" ? "success" : "default"}" data-action="approve">${active.reviewStatus === "approved" ? "✓ 已通过" : "审核通过"}</sl-button>
              <sl-button size="small" variant="${active.reviewStatus === "needs-work" ? "danger" : "default"}" data-action="needs-work">需修改</sl-button>
            </div>
          </div>

          ${activeIssues.length ? `<div class="active-issues">${activeIssues.map((issue) => `
            <div class="issue-card ${issue.severity}">
              <div><sl-badge variant="${issue.severity === "error" ? "danger" : issue.severity === "warning" ? "warning" : "primary"}">${severityLabel(issue.severity)}</sl-badge><strong>${escapeHtml(issue.title)}</strong></div>
              <p>${escapeHtml(issue.detail)}</p><small>${escapeHtml(issue.suggestion)}</small>
            </div>`).join("")}</div>` : `<div class="issue-clear">✓ 当前内容块没有新的无障碍问题</div>`}

          <section class="edit-card source-card">
            <div class="section-heading"><div><span class="eyebrow">原教材</span><h2>${active.type === "image" ? "图片信息" : active.type === "link" ? "链接信息" : "原文"}</h2></div><sl-badge variant="neutral">${active.type}</sl-badge></div>
            ${renderSourceEditor(active)}
          </section>

          <section class="edit-card rewrite-card">
            <div class="section-heading">
              <div><span class="eyebrow">Accessible rewrite</span><h2>无障碍表达</h2></div>
              <sl-button size="small" variant="primary" outline data-action="generate">生成易读版本</sl-button>
            </div>
            ${renderAccessibleEditor(active)}
            <label class="field-label" for="reason-${active.id}">改写原因（每处改写必须记录）</label>
            <sl-textarea id="reason-${active.id}" data-field="reason" rows="2" value="${escapeHtml(active.changeReason)}" placeholder="例如：拆分长句、替换专业表达、补充链接目的"></sl-textarea>
          </section>

          <section class="edit-card">
            <div class="section-heading"><div><span class="eyebrow">Review discussion</span><h2>批注与回复</h2></div><sl-badge variant="warning">${active.comments.length} 条</sl-badge></div>
            <div class="comment-compose"><sl-textarea id="new-comment" rows="2" placeholder="记录改写依据、审核意见或术语讨论…"></sl-textarea><sl-button size="small" variant="primary" data-action="add-comment">添加批注</sl-button></div>
            <div class="comment-list">
              ${active.comments.length ? active.comments.map((comment) => `
                <article class="comment ${comment.resolved ? "resolved" : ""}">
                  <header><b>${escapeHtml(comment.author)}</b><time>${new Date(comment.createdAt).toLocaleString()}</time></header>
                  <p>${escapeHtml(comment.body)}</p>
                  ${comment.replies.map((reply) => `<div class="reply"><b>${escapeHtml(reply.author)}</b><span>${escapeHtml(reply.body)}</span></div>`).join("")}
                  <div class="reply-row"><sl-input size="small" id="reply-${comment.id}" placeholder="回复…"></sl-input><sl-button size="small" data-action="reply" data-comment-id="${comment.id}">回复</sl-button><sl-button size="small" variant="text" data-action="resolve-comment" data-comment-id="${comment.id}">${comment.resolved ? "重新打开" : "解决"}</sl-button></div>
                </article>`).join("") : `<div class="empty-note">当前内容块还没有批注。</div>`}
            </div>
          </section>
        </main>

        <aside class="review-panel">
          <section class="preview-card">
            <div class="section-heading"><div><span class="eyebrow">Reader preview</span><h2>阅读预览</h2></div><div class="mode-switch"><button class="${previewMode === "normal" ? "active" : ""}" data-action="preview-normal">普通</button><button class="${previewMode === "assisted" ? "active" : ""}" data-action="preview-assisted">辅助</button></div></div>
            <div class="reader-preview mode-${previewMode}">${renderPreview()}</div>
          </section>

          <section class="order-card">
            <div class="section-heading"><div><span class="eyebrow">Screen reader order</span><h2>读屏阅读顺序</h2></div><sl-badge>从上到下</sl-badge></div>
            <ol class="reading-order">
              ${project.blocks.map((block, index) => `<li class="${block.id === active.id ? "active" : ""}"><b>${index + 1}</b><div><strong>${blockRole(block)}</strong><span>${escapeHtml(block.accessibleText || block.text || "（无内容）")}</span></div></li>`).join("")}
            </ol>
          </section>

          <section class="issues-panel">
            <div class="section-heading"><div><span class="eyebrow">All checks</span><h2>全章问题</h2></div><sl-button size="small" variant="default" outline data-action="approve-all">全部通过</sl-button></div>
            <div class="issue-filters" role="group" aria-label="问题筛选">
              <div class="filter-row">
                <span>严重程度</span>
                <button type="button" class="${issueSeverityFilter === "all" ? "active" : ""}" data-action="filter-severity" data-value="all">全部 ${list.length}</button>
                <button type="button" class="error ${issueSeverityFilter === "error" ? "active" : ""}" data-action="filter-severity" data-value="error">必须 ${summary.errors}</button>
                <button type="button" class="warning ${issueSeverityFilter === "warning" ? "active" : ""}" data-action="filter-severity" data-value="warning">建议 ${summary.warnings}</button>
                <button type="button" class="info ${issueSeverityFilter === "info" ? "active" : ""}" data-action="filter-severity" data-value="info">提醒 ${summary.infos}</button>
              </div>
              <div class="filter-row">
                <span>审核状态</span>
                <button type="button" class="${issueStatusFilter === "all" ? "active" : ""}" data-action="filter-status" data-value="all">全部</button>
                <button type="button" class="${issueStatusFilter === "pending" ? "active" : ""}" data-action="filter-status" data-value="pending">待审核</button>
                <button type="button" class="${issueStatusFilter === "needs-work" ? "active" : ""}" data-action="filter-status" data-value="needs-work">需修改</button>
                <button type="button" class="${issueStatusFilter === "approved" ? "active" : ""}" data-action="filter-status" data-value="approved">已通过</button>
              </div>
            </div>
            <div class="issue-list">
              ${shownIssues.length ? shownIssues.map((issue) => {
                const issueBlock = project.blocks.find((block) => block.id === issue.blockId);
                return `<button class="${issue.id === activeIssueId ? "active" : ""} ${issue.severity}" data-action="jump-issue" data-issue-id="${issue.id}" data-block-id="${issue.blockId}"><span>${severityLabel(issue.severity)} · <i class="inline-status status-${issueBlock?.reviewStatus ?? "pending"}"></i> ${statusLabel(issueBlock?.reviewStatus ?? "pending")}</span><b>${escapeHtml(issue.title)}</b><small>段 ${project.blocks.findIndex((block) => block.id === issue.blockId) + 1} · ${escapeHtml(issue.suggestion)}</small></button>`;
              }).join("") : `<div class="issue-clear">✓ 当前筛选下没有问题</div>`}
            </div>
          </section>

          <section class="version-card">
            <div class="section-heading"><div><span class="eyebrow">Version compare</span><h2>版本比较</h2></div><sl-badge>${project.versions.length} 版</sl-badge></div>
            ${project.versions.length ? `
              <sl-select id="version-select" size="small" value="${version?.id ?? ""}">${project.versions.map((item) => `<sl-option value="${item.id}">${escapeHtml(item.label)} · ${new Date(item.createdAt).toLocaleTimeString()}</sl-option>`).join("")}</sl-select>
              ${version ? (() => {
                const rows = alignVersionBlocks(version, project);
                const changed = rows.filter((row) => row.state === "changed").length;
                const missing = rows.filter((row) => row.state === "snapshot-only").length;
                const added = rows.filter((row) => row.state === "current-only").length;
                return `<div class="version-summary"><span>整章：变化 <b>${changed}</b> · 快照独有 <b>${missing}</b> · 当前新增 <b>${added}</b> · 共 ${rows.length} 块</span></div>`;
              })() : ""}
              <div class="version-diff">${version ? renderVersionDiff(version, active) : ""}</div>
              <div class="version-actions">
                <sl-button size="small" variant="primary" outline data-action="open-version-compare">整章并排对照</sl-button>
                <sl-button size="small" variant="warning" outline data-action="open-restore">恢复此版本…</sl-button>
              </div>
            ` : `<div class="empty-note">保存版本后，可整章并排对照，并在确认影响块后恢复。</div>`}
          </section>
        </aside>
      </div>

      <footer class="statusbar"><span>最近操作：${escapeHtml(document.documentElement.dataset.lastAction || "示例章节已载入")}</span><span>${project.blocks.length} 个内容块 · ${list.length} 个待处理问题</span></footer>
    </div>

    <sl-dialog label="全书术语表" ${showGlossary ? "open" : ""} data-dialog="glossary">
      <div class="glossary-editor">
        ${project.glossary.map((term) => `<div class="term-row"><div><b>${escapeHtml(term.source)}</b><sl-input size="small" value="${escapeHtml(term.preferred)}" data-term-id="${term.id}"></sl-input><small>${escapeHtml(term.note)}</small></div><sl-button size="small" variant="danger" outline data-action="remove-term" data-term-id="${term.id}">删除</sl-button></div>`).join("")}
      </div>
      <div class="term-add"><sl-input id="new-term-source" placeholder="原文术语"></sl-input><sl-input id="new-term-preferred" placeholder="统一表达"></sl-input><sl-button variant="primary" data-action="add-term">添加术语</sl-button></div>
      <sl-button slot="footer" variant="primary" data-action="close-glossary">完成</sl-button>
    </sl-dialog>
    ${renderVersionCompareDialog()}
    ${renderRestoreDialog()}`;

  wireLiveFields();
}

function renderSourceEditor(block: ContentBlock) {
  if (block.type === "image") {
    return `<div class="image-source"><img src="${escapeHtml(block.imageSrc ?? "")}" alt="" /><div><b>图注</b><p>${escapeHtml(block.text)}</p><b>现有替代文本</b><p>${escapeHtml(block.imageAlt || "（空）")}</p></div></div>
      <sl-input id="source-${block.id}" data-field="source" label="图注" value="${escapeHtml(block.text)}"></sl-input>
      <sl-input id="image-alt-${block.id}" data-field="image-alt" label="替代文本" value="${escapeHtml(block.imageAlt ?? "")}" help-text="描述图片传达的信息，不写“图片”二字。"></sl-input>`;
  }
  if (block.type === "link") {
    return `<sl-input id="source-${block.id}" data-field="source" label="原链接文案" value="${escapeHtml(block.text)}"></sl-input><sl-input id="link-href-${block.id}" data-field="link-href" label="链接地址" value="${escapeHtml(block.linkHref ?? "")}"></sl-input>`;
  }
  if (block.type === "heading") {
    return `<div class="heading-edit"><sl-select id="heading-level-${block.id}" data-field="heading-level" label="标题层级" value="${String(block.headingLevel ?? 2)}"><sl-option value="1">H1</sl-option><sl-option value="2">H2</sl-option><sl-option value="3">H3</sl-option><sl-option value="4">H4</sl-option></sl-select><sl-input id="source-${block.id}" data-field="source" label="标题文本" value="${escapeHtml(block.text)}"></sl-input></div>`;
  }
  return `<sl-textarea id="source-${block.id}" data-field="source" rows="4" value="${escapeHtml(block.text)}"></sl-textarea>`;
}

function renderAccessibleEditor(block: ContentBlock) {
  if (block.type === "image") {
    return `<sl-textarea id="accessible-${block.id}" data-field="accessible" rows="3" label="图片替代文本" value="${escapeHtml(block.imageAlt || block.accessibleText)}" help-text="读屏软件会朗读这里的内容。"></sl-textarea>`;
  }
  return `<sl-textarea id="accessible-${block.id}" data-field="accessible" rows="6" value="${escapeHtml(block.accessibleText)}"></sl-textarea>`;
}

function renderPreview() {
  return project.blocks.map((block, index) => {
    const content = escapeHtml(block.accessibleText || block.text);
    if (block.type === "heading") {
      const tag = `h${Math.min(6, Math.max(1, block.headingLevel ?? 2))}`;
      return `<${tag} class="${block.id === activeBlockId ? "active-block" : ""}"><span class="order-marker">${index + 1}</span>${content}</${tag}>`;
    }
    if (block.type === "image") {
      return `<figure class="${block.id === activeBlockId ? "active-block" : ""}"><img src="${escapeHtml(block.imageSrc ?? "")}" alt="${escapeHtml(block.imageAlt || block.accessibleText)}"><figcaption><span class="order-marker">${index + 1}</span>${escapeHtml(block.text)}</figcaption></figure>`;
    }
    if (block.type === "link") {
      return `<p class="${block.id === activeBlockId ? "active-block" : ""}"><span class="order-marker">${index + 1}</span><a href="${escapeHtml(block.linkHref ?? "#")}" onclick="return false">${content}</a><span class="link-role">链接</span></p>`;
    }
    return `<p class="${block.id === activeBlockId ? "active-block" : ""}"><span class="order-marker">${index + 1}</span>${content}</p>`;
  }).join("");
}

function renderVersionDiff(version: VersionSnapshot, current: ContentBlock) {
  const oldBlock = version.blocks.find((block) => block.id === current.id);
  if (!oldBlock) return `<div class="empty-note">当前内容块不在该版本中。</div>`;
  return `<div class="diff-column"><span>旧版</span><p>${escapeHtml(oldBlock.accessibleText || oldBlock.text)}</p></div><div class="diff-column current"><span>当前</span><p>${escapeHtml(current.accessibleText || current.text)}</p></div>`;
}

type DiffState = "same" | "changed" | "snapshot-only" | "current-only";

interface DiffRow {
  key: string;
  state: DiffState;
  old?: ContentBlock;
  current?: ContentBlock;
}

function blockSignature(block: ContentBlock) {
  return JSON.stringify({
    type: block.type,
    text: block.text,
    accessibleText: block.accessibleText,
    headingLevel: block.headingLevel ?? null,
    imageAlt: block.imageAlt ?? "",
    linkHref: block.linkHref ?? "",
    changeReason: block.changeReason,
    reviewStatus: block.reviewStatus,
  });
}

/** 以块 id 对齐整章，缺失块保留空列，绝不按位置强行配对而错位覆盖。 */
function alignVersionBlocks(version: VersionSnapshot, current: ChapterProject): DiffRow[] {
  const currentById = new Map(current.blocks.map((block) => [block.id, block]));
  const rows: DiffRow[] = [];
  const pushed = new Set<string>();
  version.blocks.forEach((oldBlock, index) => {
    const currentBlock = currentById.get(oldBlock.id);
    const row: DiffRow = {
      key: oldBlock.id,
      old: oldBlock,
      current: currentBlock,
      state: currentBlock
        ? blockSignature(currentBlock) === blockSignature(oldBlock) ? "same" : "changed"
        : "snapshot-only",
    };
    rows.push(row);
    pushed.add(oldBlock.id);
    // 当前稿中夹在两个旧块之间的新增块，按其位置插入，避免错位。
    const nextOldId = version.blocks[index + 1]?.id;
    const end = nextOldId ? current.blocks.findIndex((block) => block.id === nextOldId) : current.blocks.length;
    for (let cursor = current.blocks.findIndex((block) => block.id === oldBlock.id) + 1; cursor >= 0 && cursor < end; cursor++) {
      const candidate = current.blocks[cursor];
      if (!pushed.has(candidate.id) && !version.blocks.some((item) => item.id === candidate.id)) {
        rows.push({ key: candidate.id, state: "current-only", current: candidate });
        pushed.add(candidate.id);
      }
    }
  });
  current.blocks.forEach((block) => {
    if (!pushed.has(block.id)) rows.push({ key: block.id, state: "current-only", current: block });
  });
  return rows;
}

function renderDiffCell(block: ContentBlock | undefined, emptyLabel: string) {
  if (!block) return `<div class="diff-cell missing"><span class="diff-missing">${escapeHtml(emptyLabel)}</span></div>`;
  const extra = block.type === "heading"
    ? `<small class="diff-meta">H${block.headingLevel ?? 2}</small>`
    : block.type === "image"
      ? `<small class="diff-meta">替代文本：${escapeHtml(block.imageAlt || block.accessibleText || "（空）")}</small>`
      : block.type === "link"
        ? `<small class="diff-meta">链接：${escapeHtml(block.linkHref ?? "")}</small>`
        : "";
  return `<div class="diff-cell">
    <div class="diff-cell-head"><b>${blockRole(block)}</b><i class="status-${block.reviewStatus}" title="${statusLabel(block.reviewStatus)}"></i></div>
    <p>${escapeHtml(block.accessibleText || block.text || "（空）")}</p>
    ${extra}
    <small class="diff-reason">改写原因：${escapeHtml(block.changeReason || "（未记录）")}</small>
  </div>`;
}

function renderVersionCompareDialog() {
  const version = project.versions.find((item) => item.id === selectedVersionId);
  if (!showVersionCompare || !version) return "";
  const rows = alignVersionBlocks(version, project);
  const changed = rows.filter((row) => row.state === "changed").length;
  const snapshotOnly = rows.filter((row) => row.state === "snapshot-only").length;
  const currentOnly = rows.filter((row) => row.state === "current-only").length;
  const same = rows.filter((row) => row.state === "same").length;
  return `<sl-dialog class="wide-dialog" label="整章并排对照" open data-dialog="version-compare">
    <div class="compare-meta">
      <span>快照：<b>${escapeHtml(version.label)}</b> · ${new Date(version.createdAt).toLocaleString()}</span>
      <span class="compare-legend">
        <em class="dot changed"></em> 变化 ${changed}
        <em class="dot snapshot-only"></em> 快照独有 ${snapshotOnly}
        <em class="dot current-only"></em> 当前独有 ${currentOnly}
        <em class="dot same"></em> 一致 ${same}
      </span>
    </div>
    <div class="compare-grid" role="table" aria-label="整章快照与当前稿对照">
      <div class="compare-col-head compare-col-old">快照版本</div>
      <div class="compare-col-head compare-col-current">当前稿件</div>
      ${rows.map((row, index) => `
        <div class="compare-row state-${row.state}" role="row">
          <div class="compare-index">${index + 1}<small>${row.state === "changed" ? "变化" : row.state === "snapshot-only" ? "快照独有" : row.state === "current-only" ? "当前独有" : "一致"}</small></div>
          ${renderDiffCell(row.old, row.state === "snapshot-only" ? "快照之外，当前稿已无此块" : "")}
          ${renderDiffCell(row.current, row.state === "current-only" ? "当前稿新增，快照中没有此块" : "")}
        </div>`).join("")}
    </div>
    <sl-button slot="footer" variant="default" data-action="close-version-compare">关闭</sl-button>
    <sl-button slot="footer" variant="warning" outline data-action="open-restore">从此快照恢复…</sl-button>
  </sl-dialog>`;
}

function restoreChangeLine(block: ContentBlock, prefix: string) {
  const text = block.accessibleText || block.text || "（空）";
  return `<li><b>${prefix}</b><span>${escapeHtml(blockRole(block))}：${escapeHtml(text.length > 46 ? `${text.slice(0, 46)}…` : text)}</span><i class="status-${block.reviewStatus}" title="${statusLabel(block.reviewStatus)}"></i></li>`;
}

function renderRestoreDialog() {
  const version = project.versions.find((item) => item.id === restoreVersionId);
  if (!showRestoreConfirm || !version) return "";
  const rows = alignVersionBlocks(version, project);
  const changedRows = rows.filter((row) => row.state === "changed" && row.old);
  const addedRows = rows.filter((row) => row.state === "snapshot-only" && row.old);
  const keptRows = rows.filter((row) => row.state === "current-only" && row.current);
  return `<sl-dialog class="narrow-dialog" label="确认从快照恢复" open data-dialog="restore-confirm">
    <div class="restore-intro">将以块 id 对齐恢复，共涉及 ${changedRows.length + addedRows.length} 个块。替换前请确认以下影响范围。</div>
    <div class="restore-group">
      <b>将被快照内容替换（${changedRows.length}）</b>
      ${changedRows.length ? `<ul>${changedRows.map((row) => restoreChangeLine(row.old!, "替换")).join("")}</ul>` : `<p class="empty-note">没有内容发生变化的块。</p>`}
    </div>
    <div class="restore-group">
      <b>快照缺失后新增、将重新插回（${addedRows.length}）</b>
      ${addedRows.length ? `<ul>${addedRows.map((row) => restoreChangeLine(row.old!, "插回")).join("")}</ul>` : `<p class="empty-note">没有需要插回的块。</p>`}
    </div>
    <div class="restore-group">
      <b>当前稿独有、会原样保留（${keptRows.length}）</b>
      ${keptRows.length ? `<ul>${keptRows.map((row) => restoreChangeLine(row.current!, "保留")).join("")}</ul>` : `<p class="empty-note">无。</p>`}
    </div>
    <div class="restore-warn">仅按 id 覆盖同一块的内容；快照中没有的块不会被删除或错位覆盖。术语表会一并恢复到该快照。</div>
    <sl-button slot="footer" variant="default" data-action="cancel-restore">取消</sl-button>
    <sl-button slot="footer" variant="warning" data-action="confirm-restore">确认替换 ${changedRows.length + addedRows.length} 个块</sl-button>
  </sl-dialog>`;
}

function wireLiveFields() {
  app.querySelectorAll<HTMLElement>("sl-input[data-field], sl-textarea[data-field], sl-select[data-field]").forEach((element) => {
    element.addEventListener("sl-input", () => {
      const value = (element as HTMLElement & { value: string }).value;
      updateActiveBlock((block) => {
        const field = element.dataset.field;
        if (field === "source") block.text = value;
        if (field === "accessible") {
          block.accessibleText = value;
          if (block.type === "image") block.imageAlt = value;
        }
        if (field === "image-alt") {
          block.imageAlt = value;
          block.accessibleText = value;
        }
        if (field === "link-href") block.linkHref = value;
        if (field === "reason") block.changeReason = value;
        block.reviewStatus = "pending";
      }, "编辑无障碍文本", false);
    });
    element.addEventListener("sl-change", () => render());
  });
}

app.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "undo") undo();
  if (action === "redo") redo();
  if (action === "select-block") {
    activeBlockId = target.dataset.blockId ?? activeBlockId;
    activeIssueId = "";
    render();
  }
  if (action === "jump-issue") {
    activeIssueId = target.dataset.issueId ?? "";
    activeBlockId = target.dataset.blockId ?? activeBlockId;
    render();
    requestAnimationFrame(() => {
      app.querySelector<HTMLElement>(".editor-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      const sourceCard = app.querySelector<HTMLElement>(".source-card");
      sourceCard?.scrollIntoView({ behavior: "smooth", block: "center" });
      sourceCard?.classList.add("flash-locate");
    });
  }
  if (action === "filter-severity") {
    const value = target.dataset.value ?? "all";
    issueSeverityFilter = issueSeverityFilter === value && value !== "all" ? "all" : value as "all" | Severity;
    render();
  }
  if (action === "filter-status") {
    const value = target.dataset.value ?? "all";
    issueStatusFilter = issueStatusFilter === value && value !== "all" ? "all" : value as "all" | ReviewStatus;
    render();
  }
  if (action === "open-version-compare") {
    showVersionCompare = true;
    render();
  }
  if (action === "close-version-compare") {
    showVersionCompare = false;
    render();
  }
  if (action === "open-restore") {
    const targetVersion = project.versions.find((item) => item.id === selectedVersionId) ?? project.versions[0];
    if (!targetVersion) return;
    restoreVersionId = targetVersion.id;
    showRestoreConfirm = true;
    showVersionCompare = false;
    render();
  }
  if (action === "cancel-restore") {
    showRestoreConfirm = false;
    restoreVersionId = "";
    render();
  }
  if (action === "confirm-restore") {
    mergeRestoreVersion(restoreVersionId);
  }
  if (action === "generate") {
    const block = activeBlock();
    const suggestion = block.type === "link"
      ? "打开水循环互动实验"
      : simplifyText(block.type === "image" ? block.imageAlt || block.text : block.text, project.glossary);
    updateActiveBlock((current) => {
      if (current.type === "image") current.imageAlt = suggestion;
      current.accessibleText = suggestion;
      current.changeReason ||= "拆分长句并替换复杂表达，保留原有知识信息。";
      current.reviewStatus = "pending";
    }, "生成易读版本");
  }
  if (action === "approve") updateActiveBlock((block) => { block.reviewStatus = "approved"; }, "审核通过");
  if (action === "needs-work") updateActiveBlock((block) => { block.reviewStatus = "needs-work"; }, "标记需修改");
  if (action === "add-comment") {
    const input = app.querySelector<HTMLElement & { value: string }>("#new-comment");
    const body = input?.value.trim();
    if (body) updateActiveBlock((block) => {
      block.comments.unshift({ id: uid("comment"), author: "当前编辑", body, createdAt: new Date().toISOString(), resolved: false, replies: [] });
    }, "添加批注");
  }
  if (action === "reply") {
    const commentId = target.dataset.commentId ?? "";
    const input = app.querySelector<HTMLElement & { value: string }>(`#reply-${CSS.escape(commentId)}`);
    const body = input?.value.trim();
    if (body) updateActiveBlock((block) => {
      block.comments.find((comment) => comment.id === commentId)?.replies.push({ id: uid("reply"), author: "当前编辑", body, createdAt: new Date().toISOString() });
    }, "回复批注");
  }
  if (action === "resolve-comment") {
    const commentId = target.dataset.commentId ?? "";
    updateActiveBlock((block) => {
      const comment = block.comments.find((item) => item.id === commentId);
      if (comment) comment.resolved = !comment.resolved;
    }, "更新批注状态");
  }
  if (action === "preview-normal") { previewMode = "normal"; render(); }
  if (action === "preview-assisted") { previewMode = "assisted"; render(); }
  if (action === "glossary") { showGlossary = true; render(); }
  if (action === "close-glossary") { showGlossary = false; render(); }
  if (action === "add-term") {
    const source = app.querySelector<HTMLElement & { value: string }>("#new-term-source");
    const preferred = app.querySelector<HTMLElement & { value: string }>("#new-term-preferred");
    if (source?.value.trim() && preferred?.value.trim()) {
      commit("添加术语", (draft) => { draft.glossary.push({ id: uid("term"), source: source.value.trim(), preferred: preferred.value.trim(), note: "编辑新增术语" }); });
    }
  }
  if (action === "remove-term") {
    const termId = target.dataset.termId;
    commit("删除术语", (draft) => { draft.glossary = draft.glossary.filter((term) => term.id !== termId); });
  }
  if (action === "save-version") {
    const versionId = uid("version");
    commit("保存版本快照", (draft) => {
      draft.versions.unshift({ id: versionId, label: `版本 ${draft.versions.length + 1}`, createdAt: new Date().toISOString(), blocks: structuredClone(draft.blocks), glossary: structuredClone(draft.glossary) });
      draft.versions = draft.versions.slice(0, 10);
    });
    selectedVersionId = versionId;
    render();
  }
  if (action === "approve-all") {
    commit("全部审核通过", (draft) => { draft.blocks.forEach((block) => { block.reviewStatus = "approved"; }); });
  }
  if (action === "export") {
    download(`${project.title}-无障碍版.html`, exportHtml(project));
    document.documentElement.dataset.lastAction = "已导出无障碍 HTML";
    render();
  }
  if (action === "import") app.querySelector<HTMLInputElement>("#chapter-file")?.click();
});

app.addEventListener("sl-change", (event) => {
  const element = event.target as HTMLElement;
  if (element.id === "chapter-file") return;
  if (element.id.startsWith("heading-level-")) {
    const level = Number((element as HTMLElement & { value: string }).value);
    updateActiveBlock((block) => { block.headingLevel = level; block.reviewStatus = "pending"; }, "修改标题层级");
  }
  if (element.id === "version-select") {
    selectedVersionId = (element as HTMLElement & { value: string }).value;
    render();
  }
  if (element.matches("[data-term-id]")) {
    const termId = element.dataset.termId;
    const value = (element as HTMLElement & { value: string }).value;
    commit("修改术语表", (draft) => { const term = draft.glossary.find((item) => item.id === termId); if (term) term.preferred = value; });
  }
});

app.addEventListener("sl-request-close", (event) => {
  const dialog = (event.target as HTMLElement).dataset.dialog;
  if (dialog === "glossary") { showGlossary = false; render(); }
  if (dialog === "version-compare") { showVersionCompare = false; render(); }
  if (dialog === "restore-confirm") { showRestoreConfirm = false; restoreVersionId = ""; render(); }
});

app.addEventListener("change", (event) => {
  const input = event.target as HTMLInputElement;
  if (input.id !== "chapter-file" || !input.files?.[0]) return;
  void input.files[0].text().then((text) => {
    commit("导入章节文本", (draft) => {
      draft.blocks = parseImportedChapter(text);
      activeBlockId = draft.blocks[0]?.id ?? "";
      activeIssueId = "";
    });
  });
});

app.addEventListener("input", (event) => {
  const input = event.target as HTMLInputElement;
  if (input.id === "project-title") {
    project.title = input.value;
    saveSoon();
  }
});

window.addEventListener("online", render);
window.addEventListener("offline", render);
window.addEventListener("keydown", (event) => {
  const target = event.target as HTMLElement;
  if (target.matches("input, textarea, sl-input, sl-textarea, [contenteditable='true']")) return;
  const command = event.metaKey || event.ctrlKey;
  if (command && event.key.toLowerCase() === "z") {
    event.preventDefault();
    event.shiftKey ? redo() : undo();
    return;
  }
  if (command && event.key.toLowerCase() === "s") {
    event.preventDefault();
    const versionId = uid("version");
    commit("键盘保存版本", (draft) => { draft.versions.unshift({ id: versionId, label: `版本 ${draft.versions.length + 1}`, createdAt: new Date().toISOString(), blocks: structuredClone(draft.blocks), glossary: structuredClone(draft.glossary) }); });
    selectedVersionId = versionId;
    return;
  }
  if (event.key.toLowerCase() === "j" || event.key.toLowerCase() === "k") {
    const list = visibleIssues(project, issues());
    if (!list.length) return;
    const current = Math.max(0, list.findIndex((issue) => issue.id === activeIssueId));
    const next = (current + (event.key.toLowerCase() === "j" ? 1 : -1) + list.length) % list.length;
    activeIssueId = list[next].id;
    activeBlockId = list[next].blockId;
    render();
  }
  if (event.key.toLowerCase() === "e") {
    const button = app.querySelector<HTMLElement>('[data-action="generate"]');
    button?.click();
  }
  if (event.key === "1") { previewMode = "normal"; render(); }
  if (event.key === "2") { previewMode = "assisted"; render(); }
});

render();
