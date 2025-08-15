export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  
  try {
    // 先尝试正常请求
    const response = await next();
    
    // 如果响应成功，直接返回
    if (response.status < 400) {
      return response;
    }
    
    // 如果是 404 且不是静态资源，返回 index.html
    if (response.status === 404 && !isStaticAsset(url.pathname)) {
      return serveIndexHtml(context);
    }
    
    return response;
  } catch (error) {
    // 捕获任何错误，对于非静态资源返回 index.html
    if (!isStaticAsset(url.pathname)) {
      return serveIndexHtml(context);
    }
    
    throw error;
  }
}

function isStaticAsset(pathname) {
  // 判断是否为静态资源
  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', 
    '.ico', '.woff', '.woff2', '.ttf', '.eot', '.json', '.xml'
  ];
  
  return staticExtensions.some(ext => pathname.endsWith(ext)) || 
         pathname.startsWith('/assets/') ||
         pathname.startsWith('/_app/');
}

async function serveIndexHtml(context) {
  try {
    // 获取根路径的 index.html
    const indexUrl = new URL('/', context.request.url);
    const indexResponse = await fetch(indexUrl.toString());
    
    if (indexResponse.ok) {
      // 返回 index.html 内容，但保持 200 状态码
      return new Response(await indexResponse.text(), {
        status: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-cache'
        }
      });
    }
  } catch (error) {
    console.error('Error serving index.html:', error);
  }
  
  // 如果获取 index.html 失败，返回简单的 404
  return new Response('Page not found', { 
    status: 404,
    headers: { 'content-type': 'text/plain' }
  });
}
