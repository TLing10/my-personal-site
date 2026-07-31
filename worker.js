// Cloudflare Worker：作为 GitHub API 的中转代理
// 令牌只存在 Worker 的 Secret 里（GITHUB_TOKEN），前端不接触令牌。
// 部署：Cloudflare 控制台 → Workers → 新建 → 粘贴本文件 → 设置变量 GITHUB_TOKEN = 你的细粒度令牌 → 部署
// 然后在前端 script.js / edit.js 把 API 地址换成这个 Worker 的地址。

const REPO = 'TLing10/my-personal-site';

// 只允许访问本仓库的数据相关路径（留言 + 上传的文件 + Git 大文件接口）
const ALLOWED = new RegExp(
  `^/repos/${REPO}/(contents/data/(messages\\.json|uploads/.*)|git/(blobs|trees|commits|refs/heads/main))$`
);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!ALLOWED.test(url.pathname)) {
      return new Response('forbidden', { status: 403 });
    }
    if (!['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'].includes(request.method)) {
      return new Response('method not allowed', { status: 405 });
    }
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors() });
    }
    const gh = new URL('https://api.github.com' + url.pathname + url.search);
    const init = {
      method: request.method,
      headers: {
        'Authorization': 'Bearer ' + env.GITHUB_TOKEN,
        'Accept': 'application/vnd.github+json',
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
        'User-Agent': 'msg-wall-proxy'
      },
      body: ['GET', 'HEAD', 'OPTIONS'].includes(request.method) ? undefined : request.body
    };
    const resp = await fetch(gh, init);
    return new Response(resp.body, {
      status: resp.status,
      headers: { ...cors(), 'Content-Type': resp.headers.get('Content-Type') || 'application/json' }
    });
  }
};

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*'
  };
}
