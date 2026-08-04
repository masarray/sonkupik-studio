(() => {
  const RELEASE_REPOSITORY = "masarray/sonkupik-studio";
  const RELEASE_PAGE = `https://github.com/${RELEASE_REPOSITORY}/releases/latest`;
  const siteRoot = document.documentElement.dataset.siteRoot || "./";
  const language = document.documentElement.lang === "id" ? "id" : "en";

  window.K500_CONFIG = {
    RELEASE_REPOSITORY,
    RELEASE_API: `https://api.github.com/repos/${RELEASE_REPOSITORY}/releases/latest`,
    RELEASE_PAGE,
    STORE_URL: "https://www.tokopedia.com/dr-sonkupik",
    siteRoot,
    SNAPSHOT_URL: new URL(`${siteRoot}release.json`, document.baseURI).href,
    language,
    copy: {
      id: {
        checking: "Memeriksa distribusi resmi…",
        ready: "Rilis resmi terverifikasi",
        fallback: "Snapshot rilis telah direview",
        unavailable: "Buka halaman rilis resmi",
        published: "Terbit",
        copied: "Perintah disalin",
        copyFailed: "Salin perintah secara manual",
        openRelease: "Buka rilis",
      },
      en: {
        checking: "Checking the official distribution…",
        ready: "Official release verified",
        fallback: "Reviewed release snapshot",
        unavailable: "Open the official release page",
        published: "Published",
        copied: "Command copied",
        copyFailed: "Copy the command manually",
        openRelease: "Open release",
      },
    },
  };

  const scripts = [`landing-${language}.js`, "landing-ui.js", "landing-release.js"];
  const load = (name) => new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = new URL(`${siteRoot}${name}?v=20260804`, document.baseURI).href;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });

  scripts.reduce((chain, name) => chain.then(() => load(name)), Promise.resolve())
    .catch(() => { document.documentElement.dataset.siteRuntime = "failed"; });
})();
