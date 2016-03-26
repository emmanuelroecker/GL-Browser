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
    <input id="urltext" class="form-control" onkeypress={keypress} type="text" placeholder="URL">
    <span id="indicator" class="input-group-addon"></span>
    <div class="input-group-btn">
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
    #indicator {
      top: 0;
      width: 40px;
    }

  </style>

  <script>
    'use strict';

    keypress(e) {
      if (e.which != 13) {
        return true;
      }
      this.webview.src = this.urltext.value;
      return false;
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
        customize.inject(this.webview);
      });

      this.webview.addEventListener('did-navigate', (e) => {
        this.urltext.value = e.url;
      });
    });
  </script>
</page>
