// This script auto-tags elements with data-i18n attributes at runtime
// It runs once on page load and maps English text to translation keys
(function(){
  // Load the keys file to build a reverse lookup: english text -> key name
  fetch('lang/_keys.json').then(r=>r.json()).then(keys=>{
    // Build reverse map: trimmed English text -> key
    const reverseMap = {};
    for(const [key, val] of Object.entries(keys)){
      if(typeof val === 'string'){
        // For short text (inline), use exact match
        const clean = val.replace(/<[^>]+>/g,'').trim();
        if(clean.length < 200) reverseMap[clean] = key;
      }
    }

    // Tag inline elements: find all .l.en spans
    document.querySelectorAll('.l.en').forEach(span => {
      const parent = span.parentElement;
      if(!parent || parent.getAttribute('data-i18n')) return;
      const txt = span.textContent.trim();
      const key = reverseMap[txt];
      if(key){
        parent.setAttribute('data-i18n', key);
      }
    });

    // Tag block elements: find all .lb.en divs
    document.querySelectorAll('.lb.en').forEach(div => {
      const parent = div.parentElement;
      if(!parent || parent.getAttribute('data-i18n-html')) return;
      const html = div.innerHTML.trim();
      // Try to match by key
      for(const [key, val] of Object.entries(keys)){
        if(typeof val === 'string' && val.includes('<') && html.substring(0,50) === val.substring(0,50)){
          parent.setAttribute('data-i18n-html', key);
          break;
        }
      }
    });

    console.log('[i18n] Auto-tagged elements');
  }).catch(e => console.warn('[i18n] Could not load keys:', e));
})();
