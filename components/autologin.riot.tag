<autologin>
  <div class="dropdown pull-right">
    <a id="dropdown" class="dropdown-toggle" data-toggle="dropdown" role="button">
      <span id="dropdownicon" class="glyphicon glyphicon-lock text-danger"></span>
    </a>
    <div class="dropdown-menu">
      <form>
         <div class="form-group">
          <label for="password" class="sr-only">Mot de passe</label>
          <input id="password" class="form-control" type="password" placeholder="Mot de passe"></input>
        </div>
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
    login(e) {
      let $node = $(this.root);
      glPassword = this.password.value;
      $node.find('#dropdown').dropdown('toggle');
      $node.find('#dropdownicon').removeClass('text-danger');
    }
  </script>
</autologin>
