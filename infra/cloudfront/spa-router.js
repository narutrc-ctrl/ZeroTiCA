// Generated from src/seo/pages.ts — run: npm run build (scripts/sync-hosting.ts)
// CloudFront Function (viewer-request)
// Known routes -> {path}.html with HTTP 200
// Compat redirects (legacy paths, /demo/report) -> 301
// Trailing slash on known routes -> 301 to slashless URL
// Unknown extensionless URLs -> 404 (avoid Soft 404)

function hasFileExtension(uri) {
  var i = uri.lastIndexOf('/');
  var last = i === -1 ? uri : uri.substring(i + 1);
  return last.indexOf('.') !== -1;
}

function toQueryString(qs) {
  var parts = [];
  for (var key in qs) {
    if (!Object.prototype.hasOwnProperty.call(qs, key)) continue;
    var item = qs[key];
    if (item.multiValue) {
      for (var i = 0; i < item.multiValue.length; i++) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(item.multiValue[i].value));
      }
    } else if (item.value) {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(item.value));
    } else {
      parts.push(encodeURIComponent(key));
    }
  }
  return parts.length ? '?' + parts.join('&') : '';
}

function redirect301(request, targetPath) {
  var host = request.headers.host.value;
  var location;
  // 고정 목적지( ? / # 포함)는 요청 쿼리를 붙이지 않는다
  if (targetPath.indexOf('?') !== -1 || targetPath.indexOf('#') !== -1) {
    location = 'https://' + host + targetPath;
  } else {
    location = 'https://' + host + targetPath + toQueryString(request.querystring);
  }
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: { value: location }
    }
  };
}

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var SPA = {
    '/contact': true,
    '/demo/event': true,
    '/demo/task': true,
    '/legal/privacy': true,
    '/perspectives': true
  };
  var REDIRECTS = {
    '/demo/report': '/demo/event?tab=reports'
  };

  if (uri === '/') {
    return request;
  }

  if (hasFileExtension(uri)) {
    if (uri.length > 5 && uri.substring(uri.length - 5) === '.html') {
      var pretty = uri.substring(0, uri.length - 5);
      if (REDIRECTS[pretty]) {
        return redirect301(request, REDIRECTS[pretty]);
      }
      if (SPA[pretty]) {
        return redirect301(request, pretty);
      }
    }
    return request;
  }

  var hadSlash = uri.length > 1 && uri.charAt(uri.length - 1) === '/';
  var normalized = hadSlash ? uri.substring(0, uri.length - 1) : uri;

  if (REDIRECTS[normalized]) {
    return redirect301(request, REDIRECTS[normalized]);
  }

  if (SPA[normalized]) {
    if (hadSlash) {
      return redirect301(request, normalized);
    }
    request.uri = normalized + '.html';
    return request;
  }

  return {
    statusCode: 404,
    statusDescription: 'Not Found',
    headers: {
      'content-type': { value: 'text/html; charset=utf-8' },
      'cache-control': { value: 'no-store' },
      'x-robots-tag': { value: 'noindex' }
    },
    body: '<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>404 | ZeroTiCA</title><meta name="robots" content="noindex"></head><body><h1>페이지를 찾을 수 없습니다</h1><p><a href="/">홈으로</a></p></body></html>'
  };
}
