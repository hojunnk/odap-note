const CACHE = 'odap-v3';

// 설치 시 캐시 안 함 - 항상 네트워크 우선
self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // 이전 캐시 전부 삭제
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // 네트워크 우선, 실패하면 캐시
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // 성공하면 캐시에도 저장
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
