<!--
Copyright (C) 2016
Emmanuel ROECKER and Rym BOUCHAGOUR
http://dev.glicer.com

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; version 2 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
-->

<page>
  <div class="gl-header input-group">
    <div class="input-group-btn">
      <a onclick={goback} class="btn btn-default" role="button">
        <span class="glyphicon glyphicon-arrow-left"></span>
      </a>
    </div>
    <div id="favoritesList" class="dropdown">
      <input id="urltext" class="form-control" onkeyup={keyup} type="text" placeholder="URL">
      <ul id="favoritesDropDown" class="dropdown-menu" role="menu">
        <li each={ favorite in favorites }>
          <a href="#" onclick={parent.favoriteClick} role="button">
            <raw content={favorite.url.highlight}></raw>
            |
            <raw content={favorite.title.highlight}></raw>
          </a>
        </li>
      </ul>
    </div>
    <span id="indicator" class="input-group-addon"></span>
    <div class="input-group-btn">
      <a id="favoriteButton" onclick={favoriteAdd} class="btn btn-default disabled" role="button">
        <span class="glyphicon glyphicon-star-empty"></span>
      </a>
      <a id="refreshButton" onclick={refresh} class="btn btn-default disabled" role="button">
        <span class="glyphicon glyphicon-repeat"></span>
      </a>
      <a id="autologinButton" onclick={autologin} class="btn btn-default disabled" role="button">
        <span class="glyphicon glyphicon-log-in"></span>
      </a>
      <a id="devButton" onclick={dev} class="btn btn-default disabled" role="button">
        <span class="glyphicon glyphicon-wrench"></span>
      </a>
    </div>
  </div>
  <webview id="webview" class="gl-webview" preload="./components/preloadWebview.js"></webview>

  <style scoped>
    #favoritesDropDown {
      top: 30px;
    }

    #indicator {
      top: 0;
      width: 40px;
    }

  </style>

  <script>
    'use strict';

    this.favorites = [];

    keyup(e) {
      let value = this.urltext.value;

      if (value.length <= 0) {
        this.favoritesList.classList.remove('open');
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
    }

    favoriteClick(e) {
      this.webview.src = this.urltext.value = e.item.favorite.url.original;
      this.favoritesList.classList.remove('open');
    }

    favoriteAdd(e) {
      favoriteDb.add(this.webview.getURL(), this.webview.getTitle());
      favoriteDb.save();
    }

    goback(e) {
      this.webview.goBack();
    }

    dev(e) {
      this.webview.openDevTools();
    }

    refresh(e) {
      this.webview.reload();
    }

    autologin(e) {
      autologin.inject(this.webview);
      this.webview.addEventListener('did-finish-load', () => {
        autologin.inject(this.webview);
      });
    }

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
  </script>
</page>
