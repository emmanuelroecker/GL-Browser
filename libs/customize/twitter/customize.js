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

/* global document */

let recommendations = document.getElementById('empty-timeline-recommendations');
if (recommendations) {
	recommendations.remove();
}

let trends = document.getElementsByClassName('Trends');
if (trends && trends[0]) {
	trends[0].remove();
}

let whoToFollow = document.getElementsByClassName('WhoToFollow');
if (whoToFollow && whoToFollow[0]) {
	whoToFollow[0].remove();
}

let promptBird = document.getElementsByClassName('PromptbirdPrompt-streamItem');
if (promptBird && promptBird[0]) {
	promptBird[0].remove();
}

let relatedUsers = document.getElementsByClassName('RelatedUsers');
if (relatedUsers && relatedUsers[0]) {
	relatedUsers[0].remove();
}
