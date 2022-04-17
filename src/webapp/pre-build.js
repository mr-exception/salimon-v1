const replace = require("replace-in-file");
const ts = Date.now();
const options = {
  files: "./public/service-worker.js",
  from: /const CACHE_NAME = "salimon-\d+";/g,
  to: `const CACHE_NAME = "salimon-${ts}";`,
};
try {
  replace.sync(options);
  console.log(`[service worker] updated cache version number to ${ts}`);
} catch (error) {
  console.log(error);
}
