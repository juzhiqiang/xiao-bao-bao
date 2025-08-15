export async function onRequest(context) {
  try {
    return await context.next();
  } catch (err) {
    // 如果请求的文件不存在，返回 index.html
    return new Response(await fetch(context.request.url.replace(/\/[^\/]*$/, '/index.html')).then(r => r.text()), {
      headers: { 'content-type': 'text/html' }
    });
  }
}