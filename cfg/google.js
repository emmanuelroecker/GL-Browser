'use strict';

function modify() {
    let cnso = document.getElementById("cnso");
    if (cnso) {
        cnso.remove();
    }
    let cnsh = document.getElementById("cnsh");
    if (cnsh) {
        cnsh.remove();
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
