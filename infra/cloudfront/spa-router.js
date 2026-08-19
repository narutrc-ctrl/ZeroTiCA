// Generated from src/seo/pages.ts — run: node scripts/build-hosting.mjs
// CloudFront Function (viewer-request)
// Known SPA routes -> {path}.html with HTTP 200
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

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var SPA = {
    '/demo/event': true,
    '/demo/report': true,
    '/demo/task': true,
    '/legal/privacy': true,
    '/legal/terms': true,
    '/perspectives': true
  };

  if (uri === '/') {
    return request;
  }

  if (hasFileExtension(uri)) {
    if (uri.length > 5 && uri.substring(uri.length - 5) === '.html') {
      var pretty = uri.substring(0, uri.length - 5);
      if (SPA[pretty]) {
        return {
          statusCode: 301,
          statusDescription: 'Moved Permanently',
          headers: {
            location: { value: pretty + toQueryString(request.querystring) }
          }
        };
      }
    }
    return request;
  }

  var hadSlash = uri.length > 1 && uri.charAt(uri.length - 1) === '/';
  var normalized = hadSlash ? uri.substring(0, uri.length - 1) : uri;

  if (SPA[normalized]) {
    if (hadSlash) {
      return {
        statusCode: 301,
        statusDescription: 'Moved Permanently',
        headers: {
          location: { value: normalized + toQueryString(request.querystring) }
        }
      };
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
