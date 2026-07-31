/* =========================================================
   网站文字内容 —— 你只改这个文件就够了！
   修改后刷新页面即可生效。
   （本文件由站内「在线编辑器」生成，下面填充代码请勿手动破坏）
   ========================================================= */

const SITE_CONTENT = {
  "typewriter": [
    "Elaine Fan",
    "范意聆"
  ],
  "navName": "Elaine Fan",
  "heroSubtitle": "北京大学 · 信息管理 · 海獭与星星的收藏家 ✦",
  "heroTags": [
    "🎓 北大新生",
    "🥋 跆拳道黑带",
    "🌏 三语者",
    "🎨 艺术爱好者"
  ],
  "aboutTitle": "Hi，我是 Elaine",
  "aboutP1": "我刚从高中毕业，即将踏入 <strong>北京大学</strong> 攻读 <strong>信息管理</strong> 专业。从上海的国际学校到海外的 IB 体系，我对科学、语言与艺术始终保有真诚的好奇。",
  "aboutP2": "喜欢把想法变成作品——无论是一篇独立科研论文、一场跨文化的英语教学，还是一段用 Live2D 让角色活起来的动画。安静时爱滑雪与摄影，热闹时爱唱歌与跳舞。希望我的小世界，能为你带来一点点温柔的光 ✦",
  "smallCards": [
    {
      "icon": "🔬",
      "title": "我的热爱",
      "text": "科学探究、语言学习、艺术与创作，对新鲜事物永远保持胃口。"
    },
    {
      "icon": "🌏",
      "title": "我的旅程",
      "text": "生于上海，先后就读上海中学国际部与 Canadian Academy，即将北上燕园开启大学新篇章。"
    },
    {
      "icon": "💫",
      "title": "我的性格",
      "text": "好奇心驱动、乐于带领团队，也在志愿与服务中学会责任。"
    }
  ],
  "skills": [
    {
      "icon": "🌐",
      "name": "三语",
      "note": "英(母语)·中(母语)·日(中级)"
    },
    {
      "icon": "🥋",
      "name": "跆拳道",
      "note": "黑带 Black Belt"
    },
    {
      "icon": "💃",
      "name": "舞蹈",
      "note": "拉丁11级·现代8级·芭蕾4级"
    },
    {
      "icon": "🎸",
      "name": "音乐",
      "note": "尤克里里 · 唱歌"
    },
    {
      "icon": "📷",
      "name": "滑雪 & 摄影",
      "note": "Snow & Photo"
    },
    {
      "icon": "🎨",
      "name": "Live2D",
      "note": "角色动画制作"
    }
  ],
  "works": [
    {
      "title": "青少年科技创新大赛 · 三等奖",
      "text": "独立完成数字时代青少年算法素养的实证研究，开展问卷与访谈，撰写 5000 字研究论文及研究日志。",
      "tags": [
        "科研",
        "独立研究"
      ]
    },
    {
      "title": "Rokko Island 英语教学俱乐部 · Leader",
      "text": "与当地日本学校教师协商，策划并带领成员每两周为本地学生开展英语教学，锻炼跨文化沟通与组织力。",
      "tags": [
        "领导力",
        "跨文化"
      ]
    },
    {
      "title": "SciLab · Co-leader",
      "text": "对接大学教师安排参访与体验活动，邀请教授与学生举办知识论坛，组织每月大型活动与夏令营志愿者。",
      "tags": [
        "组织",
        "科普"
      ]
    },
    {
      "title": "志愿服务",
      "text": "参与微笑慈善、数学诊所辅导、新闻组写作、午餐服务与施粥等志愿活动，在持续付出中学会责任与善意。",
      "tags": [
        "公益",
        "服务"
      ]
    }
  ],
  "timeline": [
    {
      "date": "2015.01 – 2024.06",
      "title": "上海中学国际部",
      "text": "从小学到初中、高中，一路在国际教育体系里成长，打下语言与学力的地基。"
    },
    {
      "date": "2024.08 – 2026.06",
      "title": "Canadian Academy · IB",
      "text": "修读 IB Diploma，探索数学、生物与物理背后的世界，于 2026 年夏天高中毕业。"
    },
    {
      "date": "2026年秋 · 新征程",
      "title": "北京大学 · 信息管理",
      "text": "高中毕业后被北京大学录取，即将攻读信息管理专业，开启新的探索旅程 ✦"
    },
    {
      "date": "荣誉与奖项",
      "title": "科创 & 舞蹈双丰收",
      "text": "第38届上海市青少年科技创新大赛 · 三等奖；武汉CBDF 业余组标准舞（A/B组）与拉丁舞比赛 冠、亚军多项。"
    }
  ],
  "contactTitle": "让我们一起创造美好 ✦",
  "contactText": "有任何想聊的、想合作的，或只是想交个朋友，都可以联系我～",
  "email": "elainefan10@icloud.com",
  "footerCopy": "© 2024 Elaine Fan. All rights reserved.",
  "footerQuote": "愿你的每一天都像海獭一样，被星星温柔包围 ✦"
};

/* ===== 下面这段会自动把上面的文字填进页面，无需改动 ===== */
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
