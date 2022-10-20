members = [
	'echap',    'sullsun',  'sassa',    'lili',     'virgil',   'wiirio',
	'victor',   'enzoul',   'mako',     'kult',     'gladio',   'maxx',
	'fox',      'reo',      'naat',     'nosarms',  'megaman',  'zaussa',
	'napsta',   'nae',      'pirnic',   'ink',      'nyaxyan',  'akame',
	'math',     'pande',    'picpic',   'gozmo',    'pepino',   'dako',
	'tobias',   'emi',      'maxime',   'blo',      'kracksi',  'snubby',
	'sandy',    'shawny',   'daishi',   'nelson',   'lampi',    'melissa'                
];

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

function renderMemberElement(code, displayEqual = true, contentEditable = true) {
	const $member = document.createElement('div');
	$member.classList += 'pokewood-member';
	$member.setAttribute('code', code);

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
	$avatar.setAttribute('src', `./images/${code}.png`);
	$avatar.setAttribute('alt', code);
	$member.append($avatar);

	return $member;
}

function init() {
	const $grid = document.getElementById('grid');

	for (let member of members)
		$grid.append(renderMemberElement(member));

	document.getElementById('pw_header_contenteditable').addEventListener('paste', (e) => onImagePasted(e));
}

window.addEventListener('load', (e) => init());