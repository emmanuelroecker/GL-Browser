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

<tabs>
  <ul class="nav nav-tabs">
    <li each={ item in items }>
      <a href="#{item.id}" data-toggle="tab">
        {item.id}
      </a>
      <span class="close" onclick={parent.remove}>
        &times;
      </span>
    </li>
    <li>
      <a role="button" class="add-url" data-toggle="tab" onclick={add}>
        +
      </a>
    </li>
  </ul>
  <div class="tab-content">
    <div each={item in items} class="tab-pane fade" id={item.id}>
      <page name={item.id}></page>
    </div>
  </div>

 <style scoped>
  .nav-tabs > li {
      position:relative;
   }

   .nav-tabs > li > a {
      display:inline-block;
   }

   .nav-tabs > li > span {
     display:none;
     cursor:pointer;
     position:absolute;
     right: 6px;
     top: 11px;
   }

   .nav-tabs > li:hover > span {
     display: inline-block;
   }

   .tab-content > .tab-pane {
     display: block;
     height: 0;
     overflow-y: hidden;
   }

   .tab-content > .active {
     height: auto;
   }
 </style>

 <script>
    'use strict';
    this.items = [];
    this.incid = 0;

    add(e) {
      this.currentid = 'url' + this.incid;
      this.items.push({id:this.currentid});
      this.incid++;
    }

    this.add();

    remove (e) {
      if (this.items.length <= 1)
        return;

      let item = e.item.item;
      let index = this.items.indexOf(item);
      this.items.splice(index,1);

      index--;
      if (index < 0)
        index = 0;
      this.currentid = this.items[index].id;
    }

    this.on('updated', function() {
      let $node = $(this.root);
      $node.find('a[data-toggle="tab"]').on('shown.bs.tab', function () {
        glRefreshWebComponentSize();
      });
      $node.find(`a[href="#${this.currentid}"]`).tab('show');
    });
 </script>
</tabs>
