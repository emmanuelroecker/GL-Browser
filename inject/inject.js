'use strict';

function modify() {
  %injectjs%
}

modify();

let MutationObserver = window.MutationObserver;
if (MutationObserver) {
  let observer = new MutationObserver(function(mutations) {
    modify();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
