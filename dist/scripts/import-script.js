(function () {

	const importPath = /*@__PURE__*/ JSON.parse('"scripts/script.js"');

	import(chrome.runtime.getURL(importPath));

})();
