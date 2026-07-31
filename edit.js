'use strict';

/* =========================================================
   在线编辑器逻辑（站内置）
   - 读取线上 content.js → 渲染成表单
   - 修改后通过 GitHub API 提交，GitHub Pages 自动重建发布
   - GitHub 令牌只保存在你本机浏览器(localStorage)，不写进源码
   ========================================================= */

const REPO = 'TLing10/my-personal-site';
const BRANCH = 'main';
const FILE_PATH = 'content.js';
const RAW_URL = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${FILE_PATH}`;
const API_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

/* 编辑密码：防止路人误改。想换密码就改下面这行。 */
const PASSCODE = 'elaine2026';

/* ---- 下方为 content.js 里必须保留的「自动填充」代码（不要改） ---- */
const FILLER = `/* ===== 下面这段会自动把上面的文字填进页面，无需改动 ===== */
(function fillContent() {
    const c = SITE_CONTENT;
    const q = (s) => document.querySelector(s);
    const qa = (s) => document.querySelectorAll(s);

    if (c.navName) q('.nav-name').textContent = c.navName;
    if (c.heroSubtitle) q('.hero-subtitle').textContent = c.heroSubtitle;

    const tags = qa('.hero-tags .tag');
    c.heroTags.forEach((t, i) => { if (tags[i]) tags[i].textContent = t; });

    const main = q('.main-card');
    if (main) {
        const hs = main.querySelectorAll('h3, p');
        if (hs[0]) hs[0].textContent = c.aboutTitle;
        if (hs[1]) hs[1].innerHTML = c.aboutP1;
        if (hs[2]) hs[2].innerHTML = c.aboutP2;
    }

    const sc = qa('.small-card');
    c.smallCards.forEach((s, i) => {
        if (sc[i]) {
            const e = sc[i];
            if (e.querySelector('.card-icon')) e.querySelector('.card-icon').textContent = s.icon;
            if (e.querySelector('h4')) e.querySelector('h4').textContent = s.title;
            if (e.querySelector('p')) e.querySelector('p').textContent = s.text;
        }
    });

    const sk = qa('.skill-bubble');
    c.skills.forEach((s, i) => {
        if (sk[i]) {
            const e = sk[i];
            if (e.querySelector('.skill-icon')) e.querySelector('.skill-icon').textContent = s.icon;
            if (e.querySelector('.skill-name')) e.querySelector('.skill-name').textContent = s.name;
            if (e.querySelector('.skill-note')) e.querySelector('.skill-note').textContent = s.note;
        }
    });

    const wk = qa('.work-card');
    c.works.forEach((s, i) => {
        if (wk[i]) {
            const e = wk[i];
            if (e.querySelector('h3')) e.querySelector('h3').textContent = s.title;
            if (e.querySelector('p')) e.querySelector('p').textContent = s.text;
            const tg = e.querySelectorAll('.work-tags span');
            (s.tags || []).forEach((t, j) => { if (tg[j]) tg[j].textContent = t; });
        }
    });

    const tl = qa('.timeline-item');
    c.timeline.forEach((s, i) => {
        if (tl[i]) {
            const e = tl[i];
            if (e.querySelector('.timeline-date')) e.querySelector('.timeline-date').textContent = s.date;
            if (e.querySelector('h3')) e.querySelector('h3').textContent = s.title;
            if (e.querySelector('p')) e.querySelector('p').textContent = s.text;
        }
    });

    const cc = q('.contact-card');
    if (cc) {
        if (cc.querySelector('h3')) cc.querySelector('h3').textContent = c.contactTitle;
        if (cc.querySelector('p')) cc.querySelector('p').textContent = c.contactText;
        const em = cc.querySelector('.email-pill');
        if (em) { em.textContent = '✉️ ' + c.email; em.href = 'mailto:' + c.email; }
    }

    if (q('.footer-logo span')) q('.footer-logo span').textContent = c.footerCopy;
    if (q('.footer-quote')) q('.footer-quote').textContent = c.footerQuote;
})();
`;

/* ---- 表单结构定义：决定页面上出现哪些输入框 ---- */
const SCHEMA = [
    {
        title: '🌟 主页',
        fields: [
            { key: 'typewriter', label: '打字机名字', hint: '每行一个，主页名字会在它们之间来回切换', type: 'lines', rows: 2 },
            { key: 'navName', label: '导航栏名字', type: 'input' },
            { key: 'heroSubtitle', label: '主页副标题', type: 'input' },
            { key: 'heroTags', label: '主页标签', hint: '每行一个', type: 'lines', rows: 4 },
        ]
    },
    {
        title: '💫 关于我',
        fields: [
            { key: 'aboutTitle', label: '小标题', type: 'input' },
            { key: 'aboutP1', label: '第一段', hint: '可用 &lt;strong&gt;文字&lt;/strong&gt; 加粗', type: 'textarea', rows: 4 },
            { key: 'aboutP2', label: '第二段', hint: '可用 &lt;strong&gt;文字&lt;/strong&gt; 加粗', type: 'textarea', rows: 4 },
            {
                key: 'smallCards', label: '三张小卡', type: 'list', itemLabel: '小卡', fields: [
                    { key: 'icon', label: '图标 emoji', type: 'input' },
                    { key: 'title', label: '标题', type: 'input' },
                    { key: 'text', label: '内容', type: 'textarea', rows: 2 },
                ]
            },
        ]
    },
    {
        title: '🎨 兴趣爱好',
        fields: [
            {
                key: 'skills', label: '兴趣爱好气泡', type: 'list', itemLabel: '兴趣', fields: [
                    { key: 'icon', label: '图标 emoji', type: 'input' },
                    { key: 'name', label: '名称', type: 'input' },
                    { key: 'note', label: '说明', type: 'input' },
                ]
            },
        ]
    },
    {
        title: '📚 我的经历',
        fields: [
            {
                key: 'works', label: '经历卡片', type: 'list', itemLabel: '经历', fields: [
                    { key: 'title', label: '标题', type: 'input' },
                    { key: 'text', label: '内容', type: 'textarea', rows: 3 },
                    { key: 'tags', label: '标签', hint: '每行一个', type: 'lines', rows: 2 },
                ]
            },
        ]
    },
    {
        title: '🗓 我的历程',
        fields: [
            {
                key: 'timeline', label: '时间线条目', hint: '从上到下为时间顺序', type: 'list', itemLabel: '节点', fields: [
                    { key: 'date', label: '时间', type: 'input' },
                    { key: 'title', label: '标题', type: 'input' },
                    { key: 'text', label: '内容', type: 'textarea', rows: 3 },
                ]
            },
        ]
    },
    {
        title: '✉️ 联系 & 页脚',
        fields: [
            { key: 'contactTitle', label: '联系标题', type: 'input' },
            { key: 'contactText', label: '联系说明', type: 'textarea', rows: 2 },
            { key: 'email', label: '邮箱', type: 'input' },
            { key: 'footerCopy', label: '页脚版权', type: 'input' },
            { key: 'footerQuote', label: '页脚一句话', type: 'input' },
        ]
    },
];

/* ---------------- 工具函数 ---------------- */
function $(s, r = document) { return r.querySelector(s); }
function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function toBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    bytes.forEach(b => bin += String.fromCharCode(b));
    return btoa(bin);
}
function getPath(obj, path) { return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj); }
function setPath(obj, path, val) {
    const ks = path.split('.'); const last = ks.pop(); let o = obj;
    ks.forEach(k => { if (o[k] == null || typeof o[k] !== 'object') o[k] = {}; o = o[k]; });
    o[last] = val;
}

/* ---------------- 序列化回 content.js ---------------- */
function serializeValue(v, indent) {
    if (typeof v === 'string') return JSON.stringify(v);
    if (Array.isArray(v)) {
        if (v.length === 0) return '[]';
        const inner = indent + '  ';
        return '[\n' + v.map(x => inner + serializeValue(x, inner)).join(',\n') + '\n' + indent + ']';
    }
    if (v && typeof v === 'object') {
        const keys = Object.keys(v);
        if (keys.length === 0) return '{}';
        const inner = indent + '  ';
        return '{\n' + keys.map(k => inner + JSON.stringify(k) + ': ' + serializeValue(v[k], inner)).join(',\n') + '\n' + indent + '}';
    }
    return String(v);
}
function buildFile(obj) {
    const header = `/* =========================================================
   网站文字内容 —— 你只改这个文件就够了！
   修改后刷新页面即可生效。
   （本文件由站内「在线编辑器」生成，下面填充代码请勿手动破坏）
   ========================================================= */

`;
    const decl = 'const SITE_CONTENT = ' + serializeValue(obj, '') + ';\n\n';
    return header + decl + FILLER;
}

/* ---------------- 读取线上内容 ---------------- */
async function loadRaw() {
    const r = await fetch(RAW_URL);
    if (!r.ok) throw new Error('无法读取线上内容 (HTTP ' + r.status + ')');
    const txt = await r.text();
    const marker = 'const SITE_CONTENT = ';
    const start = txt.indexOf(marker) + marker.length;
    const end = txt.indexOf(';\n\n/* =====');
    if (start < marker.length || end < 0) throw new Error('内容格式无法解析');
    const literal = txt.slice(start, end);
    return (new Function('return ' + literal))();
}

/* ---------------- 渲染表单 ---------------- */
let STATE = null;
let TOKEN = '';

function fieldControl(field, path) {
    if (field.type === 'textarea') {
        const t = el('textarea', 'f-input'); t.rows = field.rows || 3;
        t.value = getPath(STATE, path) ?? '';
        t.oninput = () => setPath(STATE, path, t.value);
        return t;
    }
    if (field.type === 'lines') {
        const arr = getPath(STATE, path);
        const t = el('textarea', 'f-input'); t.rows = field.rows || 3;
        t.value = Array.isArray(arr) ? arr.join('\n') : '';
        t.oninput = () => {
            const lines = t.value.split('\n').map(s => s.replace(/^\s+|\s+$/g, ''));
            setPath(STATE, path, lines.filter(s => s !== ''));
        };
        return t;
    }
    const i = el('input', 'f-input'); i.type = 'text';
    i.value = getPath(STATE, path) ?? '';
    i.oninput = () => setPath(STATE, path, i.value);
    return i;
}

function renderField(container, field, path) {
    const wrap = el('div', 'f-field');
    const lab = el('label', 'f-label', field.label + (field.hint ? ` <span class="f-hint">${field.hint}</span>` : ''));
    wrap.appendChild(lab);
    if (field.type === 'list') {
        renderList(wrap, path, field);
    } else {
        wrap.appendChild(fieldControl(field, path));
    }
    container.appendChild(wrap);
}

function renderList(container, path, field) {
    const listBox = el('div', 'list-box');
    buildListItems(listBox, path, field);
    const addBtn = el('button', 'add-btn', `➕ 添加${field.itemLabel}`);
    addBtn.onclick = () => {
        let arr = getPath(STATE, path);
        if (!Array.isArray(arr)) { arr = []; setPath(STATE, path, arr); }
        const empty = {};
        field.fields.forEach(f => empty[f.key] = (f.type === 'lines') ? [] : '');
        arr.push(empty);
        buildListItems(listBox, path, field);
    };
    container.appendChild(listBox);
    container.appendChild(addBtn);
}

function buildListItems(listBox, path, field) {
    listBox.innerHTML = '';
    const items = getPath(STATE, path) || [];
    items.forEach((it, i) => {
        const card = el('div', 'item-card');
        const head = el('div', 'item-head');
        head.appendChild(el('span', 'item-title', `${field.itemLabel} ${i + 1}`));
        const ctrl = el('div', 'item-ctrl');
        const up = el('button', 'mini', '↑'); up.title = '上移';
        up.onclick = () => { move(path, i, -1); buildListItems(listBox, path, field); };
        const down = el('button', 'mini', '↓'); down.title = '下移';
        down.onclick = () => { move(path, i, 1); buildListItems(listBox, path, field); };
        const del = el('button', 'mini del', '✕'); del.title = '删除';
        del.onclick = () => { getPath(STATE, path).splice(i, 1); buildListItems(listBox, path, field); };
        ctrl.append(up, down, del);
        head.appendChild(ctrl);
        card.appendChild(head);
        field.fields.forEach(sub => {
            const sw = el('div', 'f-field');
            sw.appendChild(el('label', 'f-label', sub.label));
            sw.appendChild(fieldControl(sub, `${path}.${i}.${sub.key}`));
            card.appendChild(sw);
        });
        listBox.appendChild(card);
    });
    if (items.length === 0) listBox.appendChild(el('div', 'empty-note', '（暂无，点击下方按钮添加）'));
}

function move(path, i, dir) {
    const arr = getPath(STATE, path);
    const j = i + dir;
    if (!arr || j < 0 || j >= arr.length) return;
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
}

function renderApp() {
    const form = $('#form'); form.innerHTML = '';
    SCHEMA.forEach(sec => {
        const secEl = el('section', 'edit-section');
        secEl.appendChild(el('h2', 'sec-title', sec.title));
        sec.fields.forEach(f => renderField(secEl, f, f.key));
        form.appendChild(secEl);
    });
}

/* ---------------- 提交到 GitHub ---------------- */
async function commit() {
    const meta = await fetch(API_URL, {
        headers: { Authorization: 'Bearer ' + TOKEN, Accept: 'application/vnd.github+json' }
    }).then(r => r.json());
    if (!meta.sha) throw new Error('未取得文件版本号');
    const content = buildFile(STATE);
    const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + TOKEN, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '✨ 在线编辑器更新网站内容', content: toBase64(content), sha: meta.sha })
    });
    if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || ('HTTP ' + res.status));
    }
    return res.json();
}

/* ---------------- 交互流程 ---------------- */
function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 3600);
}
function setBusy(on, msg) {
    ['#loadBtn', '#saveBtn', '#resetBtn'].forEach(s => { const b = $(s); if (b) b.disabled = on; });
    const s = $('#saveBtn'); if (s && on && msg) s.textContent = msg; else if (s) s.textContent = '💾 保存并发布';
    const l = $('#loadBtn'); if (l && on && msg && s && s.textContent === msg) l.textContent = '…';
}

window.addEventListener('DOMContentLoaded', () => {
    $('#unlock').onclick = () => {
        if ($('#pass').value === PASSCODE) {
            $('#gate').style.display = 'none';
            $('#app').style.display = 'block';
            const saved = localStorage.getItem('elaine_gh_token');
            if (saved) $('#token').value = saved;
        } else {
            toast('密码不正确 ✦');
        }
    };
    $('#pass').addEventListener('keydown', e => { if (e.key === 'Enter') $('#unlock').click(); });
    $('#loadBtn').onclick = doLoad;
    $('#saveBtn').onclick = doSave;
    $('#resetBtn').onclick = () => { if (STATE && confirm('放弃未保存的修改，重新从线上载入？')) doLoad(); };
});

async function doLoad() {
    TOKEN = $('#token').value.trim();
    if (!TOKEN) { toast('请先填入 GitHub 令牌'); return; }
    if ($('#remember').checked) localStorage.setItem('elaine_gh_token', TOKEN);
    else localStorage.removeItem('elaine_gh_token');
    setBusy(true, '载入中…');
    try {
        STATE = await loadRaw();
        renderApp();
        $('#editorBody').style.display = 'block';
        toast('已载入最新内容 ✦');
    } catch (err) {
        toast('载入失败：' + err.message);
    }
    setBusy(false);
}

async function doSave() {
    if (!STATE) { toast('请先载入内容'); return; }
    if (!TOKEN) { toast('令牌缺失，请先载入'); return; }
    setBusy(true, '发布中…');
    try {
        await commit();
        toast('已发布！约 1–2 分钟后生效，请硬刷新查看 ✦');
    } catch (err) {
        toast('发布失败：' + err.message);
    }
    setBusy(false);
}
