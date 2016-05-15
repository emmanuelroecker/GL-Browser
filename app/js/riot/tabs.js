
(function(tagger) {
  if (typeof define === 'function' && define.amd) {
    define(function(require, exports, module) { tagger(require('riot'), require, exports, module)})
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    tagger(require('riot'), require, exports, module)
  } else {
    tagger(window.riot)
  }
})(function(riot, require, exports, module) {


riot.tag2('tabs', '<ul class="nav nav-tabs"> <li each="{item in items}"> <a href="#{item.id}" onclick="{parent.view}" data-toggle="tab"> {item.id} </a> <span class="close" onclick="{parent.remove}"> &times; </span> </li> <li> <a role="button" class="add-url" data-toggle="tab" onclick="{add}"> + </a> </li> </ul> <div class="tab-content"> <div each="{item in items}" class="tab-pane fade" id="{item.id}"> <page name="{item.id}"></page> </div> </div>', 'tabs .nav-tabs > li,[riot-tag="tabs"] .nav-tabs > li,[data-is="tabs"] .nav-tabs > li{ position: relative; } tabs .nav-tabs > li > a,[riot-tag="tabs"] .nav-tabs > li > a,[data-is="tabs"] .nav-tabs > li > a{ display: inline-block; } tabs .nav-tabs > li > span,[riot-tag="tabs"] .nav-tabs > li > span,[data-is="tabs"] .nav-tabs > li > span{ display: none; cursor: pointer; position: absolute; right: 6px; top: 11px; } tabs .nav-tabs > li:hover > span,[riot-tag="tabs"] .nav-tabs > li:hover > span,[data-is="tabs"] .nav-tabs > li:hover > span{ display: inline-block; } tabs .tab-content > .tab-pane,[riot-tag="tabs"] .tab-content > .tab-pane,[data-is="tabs"] .tab-content > .tab-pane{ display: block; height: 0; overflow-y: hidden; } tabs .tab-content > .active,[riot-tag="tabs"] .tab-content > .active,[data-is="tabs"] .tab-content > .active{ height: auto; }', '', function(opts) {
    'use strict';
    this.items = [];
    this.incid = 0;

    this.add = function(e) {
      this.currentid = 'url' + this.incid;
      this.items.push({id: this.currentid});
      this.incid++;
    }.bind(this)

    this.add();

    this.remove = function(e) {
      if (this.items.length <= 1)
        return;

      let item = e.item.item;
      let index = this.items.indexOf(item);
      this.items.splice(index, 1);

      index--;
      if (index < 0)
        index = 0;
      this.currentid = this.items[index].id;
    }.bind(this)

    this.view = function(e) {
      if (this.items.length <= 1)
        return;

      let item = e.item.item;
      let index = this.items.indexOf(item);
      this.currentid = this.items[index].id;
    }.bind(this)

    this.on('updated', function () {
      let $node = $(this.root);
      $node.find('a[data-toggle="tab"]').on('shown.bs.tab', function () {
        glRefreshWebComponentSize();
      });
      $node.find(`a[href="#${this.currentid}"]`).tab('show');
    });
});
});