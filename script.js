// ===== 星空背景 =====
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let width, height;

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = [
            'rgba(255, 214, 232, ', // pink
            'rgba(255, 242, 184, ', // yellow
            'rgba(212, 241, 249, ', // blue
            'rgba(255, 255, 255, ', // white
            'rgba(212, 245, 224, '  // mint
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += Math.sin(Date.now() * this.twinkleSpeed) * 0.005;
        this.opacity = Math.max(0.1, Math.min(0.8, this.opacity));

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();

        // 绘制十字光芒
        if (this.size > 1.5) {
            ctx.strokeStyle = this.color + (this.opacity * 0.5) + ')';
            ctx.lineWidth = 0.5;
            const glow = this.size * 2;
            ctx.beginPath();
            ctx.moveTo(this.x - glow, this.y);
            ctx.lineTo(this.x + glow, this.y);
            ctx.moveTo(this.x, this.y - glow);
            ctx.lineTo(this.x, this.y + glow);
            ctx.stroke();
        }
    }
}

function initStars() {
    stars = [];
    const starCount = Math.min(120, Math.floor((width * height) / 8000));
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }
}

function animateStars() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    requestAnimationFrame(animateStars);
}

resizeCanvas();
initStars();
animateStars();

window.addEventListener('resize', () => {
    resizeCanvas();
    initStars();
});

// ===== 鼠标跟随星光 =====
let mouseX = 0, mouseY = 0;
let trail = [];

class TrailParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.color = ['#FFD6E8', '#FFF2B8', '#D4F1F9', '#FFFFFF'][Math.floor(Math.random() * 4)];
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.size *= 0.97;
    }

    draw(context) {
        context.save();
        context.globalAlpha = this.life;
        context.fillStyle = this.color;
        context.translate(this.x, this.y);
        context.rotate(this.life * Math.PI);
        
        // 绘制四角星
        context.beginPath();
        for (let i = 0; i < 4; i++) {
            context.rotate(Math.PI / 2);
            context.lineTo(0, -this.size);
            context.lineTo(this.size * 0.3, -this.size * 0.3);
        }
        context.closePath();
        context.fill();
        context.restore();
    }
}

// 在星空画布上绘制鼠标轨迹
function addTrailParticle(x, y) {
    for (let i = 0; i < 2; i++) {
        trail.push(new TrailParticle(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10));
    }
}

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    addTrailParticle(mouseX, mouseY);
});

window.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    mouseX = touch.clientX;
    mouseY = touch.clientY;
    addTrailParticle(mouseX, mouseY);
}, { passive: true });

function animateTrail() {
    for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].update();
        if (trail[i].life <= 0) {
            trail.splice(i, 1);
        }
    }
}

// 扩展星空动画以包含轨迹
function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    // 绘制星星
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    // 绘制鼠标轨迹
    trail.forEach(particle => particle.draw(ctx));
    animateTrail();
    
    requestAnimationFrame(animateCanvas);
}

// 替换原来的动画循环
cancelAnimationFrame(animateStars);
animateCanvas();

// ===== 点击星星爆炸效果 =====
function createExplosion(x, y) {
    const colors = ['#FFD6E8', '#FFF2B8', '#D4F1F9', '#D4F5E0', '#E8E0F5'];
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.className = 'explosion-particle';
        particle.textContent = ['✦', '✧', '✨', '⭐', '🌟'][Math.floor(Math.random() * 5)];
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.fontSize = (Math.random() * 14 + 10) + 'px';
        particle.style.setProperty('--tx', (Math.random() - 0.5) * 150 + 'px');
        particle.style.setProperty('--ty', (Math.random() - 0.5) * 150 + 'px');
        particle.style.setProperty('--rot', (Math.random() - 0.5) * 720 + 'deg');
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

document.addEventListener('click', (e) => {
    createExplosion(e.clientX, e.clientY);
});

// 添加爆炸粒子样式
const explosionStyle = document.createElement('style');
explosionStyle.textContent = `
    .explosion-particle {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        animation: explode 1s ease-out forwards;
        text-shadow: 0 0 10px currentColor;
    }
    @keyframes explode {
        0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
        100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0) rotate(var(--rot)); opacity: 0; }
    }
`;
document.head.appendChild(explosionStyle);

// ===== 导航栏滚动效果 =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    updateActiveNav();
});

// 移动端菜单切换
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// 更新当前导航项
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ===== 滚动显示动画 =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animate-in')) {
            entry.target.classList.add('animate-in');
            
            // 如果是时间线区域，单独处理时间线项
            if (entry.target.id === 'timeline') {
                const items = entry.target.querySelectorAll('.timeline-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, index * 200);
                });
            }
            
            // 如果是技能区域，点亮星星
            if (entry.target.id === 'skills') {
                animateSkillStars();
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// 初始显示首页动画
setTimeout(() => {
    document.querySelector('.hero').classList.add('animate-in');
}, 100);

// ===== 打字机效果 =====
const typewriterElement = document.getElementById('typewriter');
const originalText = typewriterElement.textContent;
const texts = (typeof SITE_CONTENT !== 'undefined' && SITE_CONTENT.typewriter) ? SITE_CONTENT.typewriter : ['Elaine Fan', '范意聆'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isWaiting = false;

function typeWriter() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 80 : 150;
    
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeWriter, typeSpeed);
}

typeWriter();

// ===== 技能星星评分动画 =====
function animateSkillStars() {
    const skillBubbles = document.querySelectorAll('.skill-bubble:not(.add-skill)');
    skillBubbles.forEach((bubble, index) => {
        const stars = bubble.querySelectorAll('.skill-stars span');
        const level = Math.floor(Math.random() * 3) + 3; // 随机3-5星
        
        setTimeout(() => {
            stars.forEach((star, i) => {
                setTimeout(() => {
                    if (i < level) {
                        star.classList.add('active');
                    }
                }, i * 80);
            });
        }, index * 150);
    });
}

// 技能气泡点击效果
skillBubbles = document.querySelectorAll('.skill-bubble');
skillBubbles.forEach(bubble => {
    bubble.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // 重新点亮星星
        const stars = this.querySelectorAll('.skill-stars span');
        if (stars.length) {
            stars.forEach(star => star.classList.remove('active'));
            const level = Math.floor(Math.random() * 5) + 1;
            stars.forEach((star, i) => {
                setTimeout(() => {
                    if (i < level) star.classList.add('active');
                }, i * 50);
            });
        }
    });
});

// ===== 提示消息 =====
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== 添加卡片/技能占位提示 =====
document.querySelector('.add-skill')?.addEventListener('click', () => {
    showToast('复制一个技能气泡到 HTML 中，修改内容即可添加 ✦');
});

document.querySelector('.add-card')?.addEventListener('click', () => {
    showToast('复制一个 work-card 到 HTML 中，填入你的作品信息 ✦');
});

// ===== 平滑滚动增强 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== 表单输入动画 =====
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// ===== 视差效果 =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.float-item');
    
    parallaxElements.forEach((el, index) => {
        const speed = 0.2 + (index % 3) * 0.1;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== 页面加载完成后的欢迎动画 =====
window.addEventListener('load', () => {
    setTimeout(() => {
        showToast('欢迎来到你的小世界 ✦ 点击任意位置试试看！');
    }, 1500);
});

/* =========================================================
   留言星盘 / 留言墙
   留言存储在仓库的 data/messages.json（同源读取，永久保留）
   访客留言通过 GitHub API 提交（需用「仅本仓库」细粒度令牌）
   ========================================================= */
const MSG_REPO = 'TLing10/my-personal-site';
const MSG_PATH = 'data/messages.json';
let MSG_PAT = '__FINE_GRAINED_TOKEN__';   // ← 把这里替换成你的「仅本仓库」细粒度令牌
function getMsgPat() {
    return (window.__msgPatOverride && window.__msgPatOverride !== true) ? window.__msgPatOverride : MSG_PAT;
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function toBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    bytes.forEach(b => bin += String.fromCharCode(b));
    return btoa(bin);
}
function decodeBase64(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
}
function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
}
function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}
function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return '';
    return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0');
}
function embedVideo(url) {
    try {
        const u = new URL(url);
        let src = null;
        if (/youtube\.com|youtu\.be/.test(u.hostname)) {
            let id = u.searchParams.get('v');
            if (u.hostname === 'youtu.be') id = u.pathname.slice(1);
            if (id) src = 'https://www.youtube.com/embed/' + id;
        } else if (/bilibili\.com/.test(u.hostname)) {
            const bvid = u.searchParams.get('bvid') || (u.pathname.match(/\/(BV[\w]+)/) || [])[1];
            if (bvid) src = 'https://player.bilibili.com/player.html?bvid=' + bvid + '&autoplay=0';
        }
        if (src) {
            const f = document.createElement('iframe');
            f.src = src;
            f.style.cssText = 'width:100%;aspect-ratio:16/9;border:0;border-radius:14px;margin-top:12px';
            f.allowFullscreen = true;
            return f;
        }
    } catch (e) { /* ignore */ }
    return null;
}

async function loadMessages() {
    try {
        const r = await fetch(MSG_PATH + '?t=' + Date.now());
        if (!r.ok) return [];
        const data = await r.json();
        return Array.isArray(data) ? data : [];
    } catch (e) { return []; }
}

function renderStars(messages) {
    const field = document.getElementById('starField');
    if (!field) return;
    field.innerHTML = '';
    messages.forEach((m, i) => {
        const r = rng(hashStr(m.id || ('' + i)));
        const el = document.createElement('div');
        el.className = 'msg-star';
        el.style.left = (8 + r() * 80) + '%';
        el.style.top = (6 + r() * 84) + '%';
        el.style.fontSize = (1.2 + r() * 1.1) + 'rem';
        el.style.animationDelay = (r() * 3) + 's';
        el.innerHTML = '⭐<span class="msg-star-label">' + escapeHtml(m.name || '匿名') + '</span>';
        el.addEventListener('click', () => openMsgModal(m));
        field.appendChild(el);
    });
    const hint = document.querySelector('.starboard-sub');
    if (hint) hint.textContent = messages.length
        ? ('已收集 ' + messages.length + ' 颗星星，每一颗都是一位来过的朋友 ✦')
        : '还没有星星，做第一个留言的人吧 ✦';
}

function openMsgModal(m) {
    const body = document.getElementById('msgBody');
    body.innerHTML = '';
    const text = document.createElement('div');
    text.textContent = m.text || '';
    body.appendChild(text);
    if (m.image && /^https?:\/\//i.test(m.image)) {
        const img = document.createElement('img');
        img.src = m.image; img.alt = '留言图片'; img.loading = 'lazy';
        body.appendChild(img);
    }
    if (m.video && /^https?:\/\//i.test(m.video)) {
        const f = embedVideo(m.video);
        if (f) body.appendChild(f);
        else {
            const a = document.createElement('a');
            a.href = m.video; a.target = '_blank'; a.rel = 'noopener';
            a.textContent = '▶ 打开视频链接';
            body.appendChild(a);
        }
    }
    document.getElementById('msgMeta').textContent = (m.name || '匿名') + ' · ' + formatDate(m.createdAt);
    document.getElementById('msgModal').classList.add('show');
}

async function submitMessage() {
    const name = document.getElementById('msgName').value.trim();
    const text = document.getElementById('msgText').value.trim();
    const image = document.getElementById('msgImage').value.trim();
    const video = document.getElementById('msgVideo').value.trim();
    if (!text && !image && !video) { showToast('写点什么再发送吧 ✦'); return; }
    const pat = getMsgPat();
    if (pat.indexOf('__') === 0) { showToast('留言功能待配置：管理员在 script.js 填入细粒度令牌后即可 ✦'); return; }

    const btn = document.getElementById('submitMsg');
    btn.disabled = true;
    try {
        const url = `https://api.github.com/repos/${MSG_REPO}/contents/${MSG_PATH}`;
        const headers = { Authorization: 'Bearer ' + pat, Accept: 'application/vnd.github+json' };
        const meta = await fetch(url, { headers }).then(r => r.json());
        let arr = [];
        if (meta.content) arr = JSON.parse(decodeBase64(meta.content));
        if (!Array.isArray(arr)) arr = [];
        const msg = {
            id: 'm' + Date.now() + Math.floor(Math.random() * 1000),
            name: name || '匿名朋友',
            text, image: image || '', video: video || '',
            createdAt: new Date().toISOString()
        };
        arr.push(msg);
        const res = await fetch(url, {
            method: 'PUT',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: '💬 新留言 from ' + (name || '匿名'), content: toBase64(JSON.stringify(arr, null, 2)), sha: meta.sha })
        });
        if (!res.ok) {
            const e = await res.json().catch(() => ({}));
            throw new Error(e.message || ('HTTP ' + res.status));
        }
        showToast('这颗星星已挂上星盘 ✦');
        document.getElementById('writeModal').classList.remove('show');
        ['msgName', 'msgText', 'msgImage', 'msgVideo'].forEach(id => document.getElementById(id).value = '');
        const fresh = await loadMessages();
        renderStars(fresh);
    } catch (err) {
        let msg = err.message || String(err);
        if (/Failed to fetch|NetworkError|api\.github/i.test(msg)) msg += '（多为网络无法访问 api.github.com，请确认网络/代理）';
        showToast('发送失败：' + msg);
    }
    btn.disabled = false;
}

async function initMessageWall() {
    const msgs = await loadMessages();
    renderStars(msgs);

    const board = document.getElementById('starboard');
    document.getElementById('openStarboard').addEventListener('click', () => {
        board.classList.add('open');
        document.body.style.overflow = 'hidden';
        loadMessages().then(renderStars);
    });
    document.getElementById('closeStarboard').addEventListener('click', () => {
        board.classList.remove('open');
        document.body.style.overflow = '';
    });
    document.getElementById('openWrite').addEventListener('click', () => document.getElementById('writeModal').classList.add('show'));
    document.getElementById('closeWrite').addEventListener('click', () => document.getElementById('writeModal').classList.remove('show'));
    document.getElementById('closeMsg').addEventListener('click', () => document.getElementById('msgModal').classList.remove('show'));
    document.getElementById('submitMsg').addEventListener('click', submitMessage);
}

if (document.getElementById('openStarboard')) initMessageWall();
