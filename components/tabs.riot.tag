<tabs>
  <ul class="nav nav-tabs">
    <li each={ item in items } if={item.toggled}>
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
    <div each={item in items} class="tab-pane fade" id={item.id} if={item.toggled}>
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
    this.items = [{id:'url0',toggled:true}];

    add(e) {
      this.items.push({id:'url' + this.items.length, toggled:true});
    }

    remove (e) {
      let item = e.item.item;
      item.toggled = false;
    }

    this.on('updated', function() {
      let index = 0;
      for (index = this.items.length - 1; index >= 0; index--) {
          if (this.items[index].toggled) {
            break;
          }
      }
      let $node = $(this.root);
      $node.find('a[data-toggle="tab"]').on('shown.bs.tab', function () {
        glRefreshWebComponentSize();
      });
      $node.find(`a[href="#url${index}"]`).tab('show');
    });
 </script>
</tabs>
