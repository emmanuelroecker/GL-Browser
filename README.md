# GLICER Browser

[![Build Status](https://travis-ci.org/emmanuelroecker/GL-Browser.svg?branch=master)](https://travis-ci.org/emmanuelroecker/GL-Browser)
[![Build status](https://ci.appveyor.com/api/projects/status/pi6uyjyf5dptrnwr/branch/master?svg=true)](https://ci.appveyor.com/project/emmanuelroecker/gl-browser/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/emmanuelroecker/GL-Browser/badge.svg?branch=master)](https://coveralls.io/github/emmanuelroecker/GL-Browser?branch=master)

[![projects.glicer.com/browser](https://raw.githubusercontent.com/emmanuelroecker/GL-Browser/master/doc/landing.jpg)](http://projects.glicer.com/browser)

## Features

| Password Manager & Autologin |
|:----------------------------:|
|![Autologin](https://raw.githubusercontent.com/emmanuelroecker/GL-Browser/master/doc/autologin.gif)|

---

| Customize the way a web page displays or behaves |
|:------------------------------------------------:|
|![Customize](https://raw.githubusercontent.com/emmanuelroecker/GL-Browser/master/doc/customize.gif)|

Inject files component/customize/{name}/customize.css and component/customize/{name}/customize.js
in URL which matches with patterns configured in file component/customize/customize.yml.

---

| Requests blocker |
|:----------------:|
|![Customize](https://raw.githubusercontent.com/emmanuelroecker/GL-Browser/master/doc/block.gif)|

Block all requests which match with URL patterns in component/block/block.yml.

---

| Favorites |
|:---------:|
|![Favorites](https://raw.githubusercontent.com/emmanuelroecker/GL-Browser/master/doc/autocomplete.gif)|

## Architecture

### Workflow

![Architecture](https://raw.githubusercontent.com/emmanuelroecker/GL-Browser/master/doc/scheme_en.png)

---

### Continuous Integration

![Continuous Integration](https://raw.githubusercontent.com/emmanuelroecker/GL-Browser/master/doc/ci-schema_en.png)

## Install & Start Browser

[node.js](https://nodejs.org/) must be installed.

```console
npm install
npm start
```
Mode debug (autostart devtools and using ./userdata like userdata directory) :

```console
npm run start-debug
```

## Release new version

* [Draft a new release](https://help.github.com/articles/creating-releases/) , Save draft (not publish release).
* Set the "Tag version" to the value of version in your application package.json, and prefix it with v.
  "Release title" can be anything you want.
  For example, if your application package.json version is 1.0, your draft's "Tag version" would be v1.0.
* Push some commits. Every CI build will update the artifacts attached to this draft.
* Once you are done, publish the release. GitHub will tag the latest commit for you.



## License GPL-2.0

GNU General Public License v2.0  
Please see the LICENSE file distributed with this source code for further information regarding copyright and licensing.

## Contact

Authors : Emmanuel ROECKER & Rym BOUCHAGOUR

[Web Development Blog - http://dev.glicer.com](http://dev.glicer.com)
