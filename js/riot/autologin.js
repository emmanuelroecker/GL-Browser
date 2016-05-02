
(function(tagger) {
  if (typeof define === 'function' && define.amd) {
    define(function(require, exports, module) { tagger(require('riot'), require, exports, module)})
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    tagger(require('riot'), require, exports, module)
  } else {
    tagger(window.riot)
  }
})(function(riot, require, exports, module) {


riot.tag2('autologin', '<div id="dropdown" class="dropdown pull-right"> <a class="dropdown-toggle" data-toggle="dropdown" role="button"> <span id="dropdownicon" class="glyphicon glyphicon-lock text-danger"></span> </a> <div class="dropdown-menu"> <form> <div class="form-group"> <label for="password" class="sr-only">Mot de passe</label> <input id="password" onkeydown="{keydown}" class="form-control" type="password" placeholder="Mot de passe"></input> </div> <span id="message" class="text-danger"></span> <button type="button" class="btn btn-default btn-block" onclick="{login}">Connexion</button> </form> </div> </div>', 'autologin .dropdown-menu,[riot-tag="autologin"] .dropdown-menu,[data-is="autologin"] .dropdown-menu{ padding: 5px; }', '', function(opts) {
    'use strict';

    this.autologin = function() {
      if (!autologin.setMasterPassword(this.password.value)) {
        this.message.textContent = 'Bad password';
      } else {
        this.dropdownicon.classList.remove('text-danger');
        this.dropdown.classList.remove('open');
      }
      this.password.value = "";
    }.bind(this)

    this.keydown = function(e) {
      this.message.textContent = '';
      if (e.which !== 13) {
        return true;
      }
      this.autologin();
      return false;
    }.bind(this)

    this.login = function(e) {
      this.autologin();
    }.bind(this)
});
});