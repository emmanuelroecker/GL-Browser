# GLICER Browser

## Features

### Password Manager

![Password](https://raw.githubusercontent.com/emmanuelroecker/GL-Browser/master/doc/autologin.gif)

### Customize the way a web page displays or behaves

Inject files components/customize/{name}/customize.css and components/customize/{name}/customize.js
in URL which matches with patterns configured in file components/customize/customize.yml.

![Customize](https://raw.githubusercontent.com/emmanuelroecker/GL-Browser/master/doc/tabs.gif)

### Requests blocker

Block all requests which match with URL patterns in components/block/block.yml.

### Search & Save favorites

![Favorites](https://raw.githubusercontent.com/emmanuelroecker/GL-Browser/master/doc/favorites.gif)

## Architecture

![Architecture](https://raw.githubusercontent.com/emmanuelroecker/GL-Browser/master/doc/scheme_en.png)

## Install & Start Browser

[node.js](https://nodejs.org/) must be installed.

```console
npm install
npm start
```

## Tests

```console
npm test
```

## License GPL-2.0

GNU General Public License v2.0  
Please see the LICENSE file distributed with this source code for further information regarding copyright and licensing.

## Contact

Authors : Emmanuel ROECKER & Rym BOUCHAGOUR

[Web Development Blog - http://dev.glicer.com](http://dev.glicer.com)
