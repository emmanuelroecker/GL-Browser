'use strict';

function modify() {
  let signeup = document.getElementsByClassName('InlineSignup')
  if (signeup && signeup[0]) {
    signeup[0].remove();
  }
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
