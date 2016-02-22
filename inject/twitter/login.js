/*
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
*/

let loginform = document.getElementsByClassName('LoginForm')[0];
let username = loginform.getElementsByClassName('LoginForm-username')[0].getElementsByTagName('input')[0];
let password = loginform.getElementsByClassName('LoginForm-password')[0].getElementsByTagName('input')[0];
let login = loginform.getElementsByClassName('submit')[0];

username.value = "test";
password.value = "test";
login.click();
