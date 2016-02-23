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
      <a class="gl-goback btn btn-default" role="button"><span class="glyphicon glyphicon-arrow-left"></span></a>
    </div>
    <input class="gl-urltext form-control" type="text" placeholder="URL">
    <span class="gl-indicator input-group-addon"></span>
    <div class="input-group-btn">
      <a class="gl-refresh btn btn-default" role="button"><span class="glyphicon glyphicon-repeat"></span></a>
      <a class="gl-dev btn btn-default" role="button"><span class="glyphicon glyphicon-wrench"></span></a>
    </div>
  </div>
  <webview class="gl-webview" preload="./inject/preload.js">
  </webview>

  <style scoped>
    .gl-indicator {
        top: 0px;
        width: 40px;
      }

    .gl-webview {
      display: block;
      border: none;
    }
  </style>

  <script>
    'use strict';
    this.on('mount', function() {
      let $node = $(this.root);
      let webview = $node.find('.gl-webview');
      let indicator = $node.find('.gl-indicator');

      $node.find('.gl-refresh').click(function () {
        webview.get(0).reload();
      });

      $node.find('.gl-dev').click(function () {
        webview.get(0).openDevTools();
      });

      $node.find('.gl-goback').click(function () {
       webview.get(0).goBack();
      });

      $node.find('.gl-urltext').keypress(function (e) {
        if (e.keyCode !== 13) {
          return true;
        }
        webview.get(0).src = this.value;
        return false;
      });

      webview.on('did-start-loading', () => {
        indicator.toggleClass('glyphicon glyphicon-refresh');
      });
      webview.on('did-stop-loading', () => {
        indicator.toggleClass('glyphicon glyphicon-refresh');
      });
      webview.on('load-commit', function (e) {
        let url = e.originalEvent.url;
        webview.on('did-finish-load', function () {
          let inject = glGetToInject(url);
          if (inject) {
            webview.get(0).insertCSS(inject.css);
            webview.get(0).executeJavaScript(inject.js);
            webview.get(0).send('login',inject.user);
          }
          $(this).off('did-finish-load');
        });
      });
    });
  </script>
</page>
