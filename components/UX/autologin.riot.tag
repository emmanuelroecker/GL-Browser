<autologin>
  <div id="dropdown" class="dropdown pull-right">
    <a class="dropdown-toggle" data-toggle="dropdown" role="button">
      <span id="dropdownicon" class="glyphicon glyphicon-lock text-danger"></span>
    </a>
    <div class="dropdown-menu">
      <form>
        <div class="form-group">
          <label for="password" class="sr-only">Mot de passe</label>
          <input id="password" onkeypress={keypress} class="form-control" type="password" placeholder="Mot de passe"></input>
        </div>
        <span id="message" class="text-danger"></span>
        <button type="button" class="btn btn-default btn-block" onclick={login}>Connexion</button>
      </form>
    </div>
  </div>

  <style scoped>
    .dropdown-menu {
       padding: 5px 5px 5px;
    }
  </style>

  <script>
    'use strict';

    autologin() {
      if (!autologin.setMasterPassword(this.password.value)) {
        this.message.textContent = 'Bad password';
      } else {
        this.dropdownicon.classList.remove('text-danger');
        this.dropdown.classList.remove('open');
      }
      this.password.value = "";
    }

    keypress(e) {
      this.message.textContent = '';
      if (e.which !== 13) {
        return true;
      }
      this.autologin();
      return false;
    }

    login(e) {
      this.autologin();
    }
  </script>
</autologin>
