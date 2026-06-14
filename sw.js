/**
 * GateRemoteSource Service Worker
 * PWA 离线缓存策略
 */

const CACHE_NAME = 'grs-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about/',
  '/catalog/',
  '/contact/',
  '/oem/',
  '/blog/',
  '/assets/css/tailwind.css',
  '/assets/css/fonts.css',
  '/assets/js/enhanced.js',
  '/assets/js/advanced.js',
  '/logo/logo.png',
  '/logo/logo.webp',
  '/logo/favicon.ico',
  '/site.webmanifest'
];

// 安装 - 预缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => {
        console.error('[SW] Cache failed:', err);
      })
  );
  self.skipWaiting();
});

// 激活 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 拦截请求 - 缓存优先策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非 GET 请求
  if (request.method !== 'GET') return;

  // 跳过外部请求
  if (url.origin !== self.location.origin) return;

  // 策略：缓存优先，网络回退
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // 返回缓存，同时后台更新
        fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // 缓存未命中，从网络获取
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // 缓存新资源
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      });
    }).catch(() => {
      // 网络和缓存都失败，返回离线页面
      if (request.destination === 'document') {
        return caches.match('/');
      }
    })
  );
});

// 后台同步（用于表单提交）
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }
});

async function syncContactForms() {
  // 从 IndexedDB 获取待发送的表单数据并提交
  console.log('[SW] Syncing contact forms');
}
