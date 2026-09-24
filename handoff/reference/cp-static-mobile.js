// Static (script-free) mobile reflow: turns a rendered 1440 page frame into a 390 frame using DOM structure only.
(function (root) {
  var MAP = { 92: 52, 84: 44, 72: 40, 64: 40, 49: 32, 45: 30, 35: 26, 30: 22, 26: 20, 25: 20, 20: 18, 18: 16 };
  var SC = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96, 120];
  function snap(v) { var b = 0, d = 1e9; SC.forEach(function (q) { var x = Math.abs(q - v); if (x < d) { d = x; b = q; } }); return b; }
  function px(v) { return parseFloat(v) || 0; }
  function textLen(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim().length; }
  function estWidth(el) {
    var s = el.style, w = px(s.width), mw = px(s.maxWidth);
    if (w && /px/.test(s.width)) return w;
    if (/^(IMG|SVG|svg)$/.test(el.tagName)) return px(el.getAttribute('width')) || w || 40;
    if (s.flex && /^1/.test(s.flex)) return 400;
    if (mw && /px/.test(s.maxWidth)) return Math.min(mw, 600);
    var t = textLen(el);
    if (el.querySelector('p, h1, h2, h3, ul, ol')) return 400;
    if (t > 60) return 400;
    if (el.children.length && [].some.call(el.children, function (c) { return estWidth(c) >= 300; })) return 400;
    return Math.max(24, t * 8);
  }
  function tracks(v) { if (!v) return 0; var m = v.match(/repeat\((\d+)/); if (m) return +m[1]; return v.replace(/minmax\([^)]*\)/g, 'x').trim().split(/\s+/).length; }
  function padFix(el, side) {
    var k = 'padding' + side, v = px(el.style[k]);
    if (!v) return;
    if (side === 'Left' || side === 'Right') { if (v >= 40) el.style[k] = '20px'; else if (v >= 28) el.style[k] = '16px'; }
    else if (v >= 56) el.style[k] = snap(v * 0.6) + 'px';
  }
  function mobilize(frame, doc) {
    frame.style.width = '390px';
    var logo = frame.querySelector('img[src*="CP_Logo_Long"]');
    var navRow = logo && logo.parentElement;
    var all = [].slice.call(frame.querySelectorAll('*'));
    all.forEach(function (el) {
      var s = el.style; if (!s) return;
      if (el.closest && el.closest('[data-component]') && el.closest('[data-component]').style.height === '0px') return;
      var fs = px(s.fontSize);
      if (fs && MAP[fs]) { var n = MAP[fs]; var lh = px(s.lineHeight); s.fontSize = n + 'px'; if (lh && /px/.test(s.lineHeight)) s.lineHeight = Math.round(lh * n / fs) + 'px'; }
      if (s.whiteSpace === 'nowrap' && textLen(el) > 22) s.whiteSpace = 'normal';
      ['Left', 'Right', 'Top', 'Bottom'].forEach(function (k) { padFix(el, k); });
      ['marginTop', 'marginBottom'].forEach(function (k) { var v = px(s[k]); if (v >= 48) s[k] = snap(v * 0.6) + 'px'; });
      ['marginLeft', 'marginRight'].forEach(function (k) { var v = px(s[k]); if (v >= 40 && s[k] !== 'auto') s[k] = '0px'; });
      ['rowGap', 'columnGap'].forEach(function (k) { if (px(s[k]) > 32) s[k] = '24px'; });
      if (s.gap && px(s.gap) > 32) s.gap = '24px';
      if (/px/.test(s.width) && px(s.width) > 390) s.width = '100%';
      if (/px/.test(s.minWidth) && px(s.minWidth) > 120) s.minWidth = '0px';
      if (/px/.test(s.height) && px(s.height) >= 220) {
        var rich = el.querySelectorAll('p, h1, h2, h3, li, input, textarea, button').length || [].filter.call(el.children, function (c) { return textLen(c) > 0; }).length > 1;
        s.height = rich ? 'auto' : snap(px(s.height) * 0.6) + 'px';
      }
      if (s.display === 'grid') {
        var n2 = tracks(s.gridTemplateColumns);
        if (n2 >= 4) s.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
        else if (n2 >= 2) { s.gridTemplateColumns = 'minmax(0, 1fr)'; if (px(s.rowGap || s.gap) < 16) s.rowGap = '28px'; }
        if (n2 >= 2) [].forEach.call(el.children, function (c) { c.style.gridColumn = 'auto'; c.style.gridRow = 'auto'; if (c.style.borderLeft) { c.style.borderLeft = 'none'; c.style.paddingLeft = '0px'; c.style.paddingRight = '0px'; } });
      }
      if ((s.display === 'flex' || s.display === 'inline-flex') && s.flexDirection !== 'column' && el !== navRow) {
        var kids = [].filter.call(el.children, function (c) { return c.style && c.style.position !== 'absolute'; });
        if (kids.length > 1) {
          var ws = kids.map(estWidth), sum = ws.reduce(function (a, b) { return a + b; }, 0);
          if (sum > 340) {
            var bigN = ws.filter(function (w) { return w >= 300; }).length, smallN = ws.filter(function (w) { return w < 90; }).length;
            if (bigN && smallN && bigN + smallN === kids.length) kids.forEach(function (c, i) { if (ws[i] >= 300) { c.style.flex = '1 1 0'; c.style.minWidth = '0px'; c.style.width = 'auto'; } else c.style.flexShrink = '0'; });
            else if (bigN) { s.flexDirection = 'column'; s.alignItems = 'stretch'; if (px(s.gap || s.rowGap) < 16) s.rowGap = '28px'; kids.forEach(function (c) { c.style.flex = 'none'; c.style.width = 'auto'; c.style.maxWidth = '100%'; }); }
            else { s.flexWrap = 'wrap'; kids.forEach(function (c) { c.style.flexShrink = '0'; c.style.maxWidth = '100%'; }); }
          }
        }
      }
    });
    if (navRow) {
      var light = /White/.test(logo.getAttribute('src'));
      [].forEach.call(navRow.children, function (c) { if (c !== logo) c.style.display = 'none'; });
      navRow.style.padding = '16px 20px'; navRow.style.height = 'auto'; navRow.style.justifyContent = 'space-between'; navRow.style.alignItems = 'center'; navRow.style.flexDirection = 'row';
      logo.style.height = '22px'; logo.style.width = 'auto';
      var col = light ? '#FFFFFF' : '#52565A', m = doc.createElement('div');
      m.setAttribute('style', 'width: 44px; height: 44px; display: flex; flex-direction: column; justify-content: center; align-items: flex-end; gap: 6px;');
      m.innerHTML = '<div style="width: 24px; height: 1.5px; background: ' + col + ';"></div><div style="width: 24px; height: 1.5px; background: ' + col + ';"></div><div style="width: 16px; height: 1.5px; background: ' + col + ';"></div>';
      navRow.appendChild(m);
      var tg = frame.querySelector('[data-component]'); if (tg && tg.firstElementChild) tg.firstElementChild.style.top = '150px';
    }
    // hide the second nav line + announcement text overflow on mobile
    [].forEach.call(frame.querySelectorAll('[data-cp-desktop-only]'), function (e) { e.style.display = 'none'; });
  }
  root.cpStaticMobile = function (html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var frame = doc.querySelector('[data-cp-page-frame]'); if (!frame) return html;
    mobilize(frame, doc);
    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  };
})(typeof window !== 'undefined' ? window : this);
