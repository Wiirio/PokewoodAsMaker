members = [
	{ "code": "echap" },
	{ "code": "sullsun" },
	{ "code": "sassa" },
	{ "code": "lili" },     
	{ "code": "virgil" },
	{ "code": "wiirio" },
	{ "code": "victor" },   
	{ "code": "enzoul" },
	{ "code": "mako" },
	{ "code": "kult" },
	{ "code": "gladio" },
	{ "code": "maxx" },
	{ "code": "fox" },
	{ "code": "reo" },
	{ "code": "naat" },
	{ "code": "nosarms" },
	{ "code": "megaman" },
	{ "code": "zaussa" },
	{ "code": "napsta" },
	{ "code": "nae" },
	{ "code": "pirnic" },
	{ "code": "ink" },
	{ "code": "nyaxyan" },
	{ "code": "akame" },
	{ "code": "math" },
	{ "code": "pande" },
	{ "code": "picpic" },
	{ "code": "gozmo" },
	{ "code": "pepino" },
	{ "code": "dako" },
	{ "code": "tobias" },
	{ "code": "emi" },
	{ "code": "maxime" },
	{ "code": "blo" },
	{ "code": "kracksi" },
	{ "code": "snubby" },
	{ "code": "sandy" },
	{ "code": "shawny" },
	{ "code": "daishi" },
	{ "code": "nelson" },
	{ "code": "lampi" },
	{ "code": "melissa" }                
]

function onImagePasted(e) {
	if (!e.clipboardData || !e.clipboardData.items)
			return;
	for (let item of e.clipboardData.items) {
		if (item.kind != 'file')
			continue;
		let blob = item.getAsFile();
		var URLObj = window.URL || window.webkitURL;
		var source = URLObj.createObjectURL(blob);
		var pastedImage = new Image();
		pastedImage.src = source;
		e.currentTarget.innerHTML += pastedImage.outerHTML;

		e.preventDefault();
		return;
	}
}

function renderMemberElement(member, displayEqual = true, contentEditable = true) {
	const $member = document.createElement('div');
	$member.classList += 'pokewood-member';
	$member.setAttribute('code', member.code);

	const $filling = document.createElement('div');
	$filling.classList += 'member-filling';
	$filling.setAttribute('contenteditable', contentEditable ? 'true' : 'false');

	$filling.addEventListener('paste', (e) => onImagePasted(e));

	$member.append($filling);

	if (displayEqual) {
		const $equal = document.createElement('span');
		$equal.classList += 'member-equal';
		$equal.innerText = '=';
		$member.append($equal);
	}

	const $avatar = document.createElement('img');
	$avatar.setAttribute('src', `./images/${member.code}.png`);
	$avatar.setAttribute('alt', member.code);
	$member.append($avatar);

	return $member;
}

function init() {
	const $grid = document.getElementById('grid');

	document.getElementById('pw_header_contenteditable')
		.addEventListener('paste', (e) => onImagePasted(e));

	for (let member of members)
		$grid.append(renderMemberElement(member));
}

window.addEventListener('load', (e) => init());