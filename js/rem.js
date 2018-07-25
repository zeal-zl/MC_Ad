/* rem.js文件内容 */
(function () {
  var html = document.documentElement;

  function onWindowResize () {
    html.style.fontSize = html.getBoundingClientRect().width / 100 + 'px';
    console.log('html.style.fontSize ==>', html.style.fontSize)
  }

  window.addEventListener('resize', onWindowResize);
  onWindowResize();
})();