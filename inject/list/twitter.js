let recommendations = document.getElementById("empty-timeline-recommendations");
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
