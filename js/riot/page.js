
(function(tagger) {
  if (typeof define === 'function' && define.amd) {
    define(function(require, exports, module) { tagger(require('riot'), require, exports, module)})
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    tagger(require('riot'), require, exports, module)
  } else {
    tagger(window.riot)
  }
})(function(riot, require, exports, module) {


riot.tag2('page', '<div class="gl-header input-group"> <div class="input-group-btn"> <a onclick="{goback}" class="btn btn-default" role="button"> <span class="glyphicon glyphicon-arrow-left"></span> </a> </div> <div id="favoritesList" class="dropdown"> <input id="urltext" class="form-control" onkeyup="{keyup}" type="text" placeholder="URL"> <ul id="favoritesDropDown" class="dropdown-menu" role="menu"> <li each="{favorite in favorites}"> <a href="#" onclick="{parent.favoriteClick}" role="button"> <raw content="{favorite.url.highlight}"></raw> | <raw content="{favorite.title.highlight}"></raw> </a> </li> </ul> </div> <span id="indicator" class="input-group-addon"></span> <div class="input-group-btn"> <a id="favoriteButton" onclick="{favoriteAdd}" class="btn btn-default disabled" role="button"> <span class="glyphicon glyphicon-star-empty"></span> </a> <a id="refreshButton" onclick="{refresh}" class="btn btn-default disabled" role="button"> <span class="glyphicon glyphicon-repeat"></span> </a> <a id="autologinButton" onclick="{autologin}" class="btn btn-default disabled" role="button"> <span class="glyphicon glyphicon-log-in"></span> </a> <a id="devButton" onclick="{dev}" class="btn btn-default disabled" role="button"> <span class="glyphicon glyphicon-wrench"></span> </a> </div> </div> <webview id="webview" class="gl-webview" preload="../js/preloadWebview.js"></webview>', 'page #favoritesDropDown,[riot-tag="page"] #favoritesDropDown,[data-is="page"] #favoritesDropDown{ top: 30px; } page #indicator,[riot-tag="page"] #indicator,[data-is="page"] #indicator{ top: 0; width: 40px; }', '', function(opts) {
    'use strict';

    this.favorites = [];

    this.keyup = function(e) {
      let value = this.urltext.value;

      if (value.length <= 0) {
        this.favoritesList.classList.remove('open');
        return true;
      }

      if (e.which == 13) {
        this.webview.src = value;
        return false;
      }

      this.favorites = favoriteDb.search(value);
      if (this.favorites.length <= 0) {
        this.favoritesList.classList.remove('open');
      } else {
        this.favoritesList.classList.add('open');
      }

      return true;
    }.bind(this)

    this.favoriteClick = function(e) {
      this.webview.src = this.urltext.value = e.item.favorite.url.value.o;
      this.favoritesList.classList.remove('open');
    }.bind(this)

    this.favoriteAdd = function(e) {
      favoriteDb.add(this.webview.getURL(), this.webview.getTitle());
      favoriteDb.save();
    }.bind(this)

    this.goback = function(e) {
      this.webview.goBack();
    }.bind(this)

    this.dev = function(e) {
      this.webview.openDevTools();
    }.bind(this)

    this.refresh = function(e) {
      this.webview.reload();
    }.bind(this)

    this.autologin = function(e) {
      autologin.inject(this.webview);
      this.webview.addEventListener('did-finish-load', () => {
        autologin.inject(this.webview);
      });
    }.bind(this)

    this.on('mount', function () {
      this.webview.addEventListener('did-start-loading', () => {
        this.indicator.classList.toggle('glyphicon');
        this.indicator.classList.toggle('glyphicon-refresh');
      });

      this.webview.addEventListener('did-stop-loading', () => {
        this.indicator.classList.toggle('glyphicon');
        this.indicator.classList.toggle('glyphicon-refresh');
      });

      this.webview.addEventListener('did-finish-load', () => {
        this.refreshButton.classList.remove('disabled');
        this.devButton.classList.remove('disabled');
        this.autologinButton.classList.remove('disabled');
        this.favoriteButton.classList.remove('disabled');
        customize.inject(this.webview);
      });

      this.webview.addEventListener('did-navigate', (e) => {
        this.urltext.value = e.url;
      });
    });
});
});