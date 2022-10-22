class MemberControl {
	#editMode = undefined;
	get EditMode() { return this.#editMode; }
	set EditMode(value) {
		this.#editMode = value;

		this.$authoring.style.display = this.#editMode == 'authoring' ? 'flex' : 'none';
		this.$canvas.style.display = this.#editMode == 'canvas' ? 'block' : 'none';
	}

	constructor(member) {
		const me = this;

		this.$control = document.createElement('div');
		this.$control.classList += 'pokewood-member';
		this.$control.setAttribute('code', member.code);
	
		let $editorContainer = document.createElement('div');
		$editorContainer.classList += 'editor_container';

		this.$authoring = document.createElement('div');
		this.$authoring.classList += 'member-filling';
		this.$authoring.setAttribute('contenteditable', true);
		this.$authoring.addEventListener('paste', (e) => onImagePasted(e));

		this.$canvas = newCanvas(member.id);
		this.$canvas.classList += 'member-filling';
		this.$canvas.setAttribute('tabindex', 0);
	
		const $equal = document.createElement('span');
		$equal.classList += 'member-equal';
		$equal.innerText = '=';
	
		const $avatar = document.createElement('img');
		$avatar.setAttribute('src', `./images/${member.code}.png`);
		$avatar.setAttribute('alt', member.code);

		this.$control.append($editorContainer);
		$editorContainer.append(this.$authoring);
		$editorContainer.append(this.$canvas);
		this.$control.append($equal);
		this.$control.append($avatar);

		// Member context menu
		this.$control.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			$contextMenu.style.display = 'block';
			$contextMenu.style.left = e.clientX;
			$contextMenu.style.top = e.clientY - $contextMenu.clientHeight - 3;
	
			$contextMenu.setMember(me);
		});

		this.EditMode = 'authoring';
	}
}

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

mouseDown = false;
document.addEventListener('mouseup', (e) => mouseDown = false);
document.addEventListener('mousedown', (e) => mouseDown = true);

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

function newCanvas() {
	var $canvas = document.createElement('canvas');
	$canvas.drawHistory = [];
	$canvas.lastDraw = [];
	$canvas.draw = function() {
		this.lastDraw.push(arguments);
		this.executeDraw(arguments);
	};
	$canvas.executeDraw = function(args) {
		var fnName = args[0];
		var fnArgs = Array.prototype.slice.call(args, 1);
		this[fnName].apply(this, fnArgs);
	}
	$canvas.undraw = function() {
		this.getContext('2d').clearRect(0, 0, this.width, this.height);
		this.drawHistory.pop();
		for (let draw of this.drawHistory)
			for (let drawCommand of draw)
				this.executeDraw(drawCommand);
	};
	$canvas.line = function(color, lineWidth, x1, y1, x2, y2) {
		let ctx = this.getContext('2d');
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		ctx.closePath();
	};
	$canvas.addEventListener('mousedown', (e) => e.target.focus());
	$canvas.addEventListener('mousemove', (e) => {
		if (!mouseDown) {
			if (e.target.lastDraw.length > 0) {
				e.target.drawHistory.push(e.target.lastDraw);
				e.target.lastDraw = [];
			}
			return;
		}
		let mouseX = ((e.clientX - e.target.offsetLeft) / e.target.clientWidth) * e.target.width;
		let mouseY = ((e.clientY - e.target.offsetTop) / e.target.clientHeight) * e.target.height;
		e.target.draw(
			'line',
			'green',
			3,
			e.target.drawingX || mouseX, 
			e.target.drawingY || mouseY,
			e.target.drawingX = mouseX,
			e.target.drawingY = mouseY);
	});
	$canvas.addEventListener('mouseup', (e) => { 
		e.target.drawingX = undefined;
		e.target.drawingY = undefined;
	});
	$canvas.addEventListener('mouseleave', (e) => { 
		e.target.drawingX = undefined;
		e.target.drawingY = undefined;
	});
	$canvas.addEventListener('keydown', (e) => {
		if (e.ctrlKey && e.key == 'z')
			$canvas.undraw();
	});
	return $canvas;
}

function init() {
	const $grid = document.getElementById('grid');

	initMemberContextMenu();

	document.getElementById('pw_header_contenteditable').addEventListener('paste', (e) => onImagePasted(e));

	for (let member of members)
		$grid.append(new MemberControl(member).$control);
}

function initMemberContextMenu() {
	$contextMenu = document.getElementById('member_context_menu');
	$contextMenu.setMember = function(memberControl) {
		$contextMenu.memberControl = memberControl;
		document.member_context_menu.edit_mode.value = memberControl.EditMode;
	}

	document.getElementById('authoring').addEventListener('change', function(e) {
		$contextMenu.memberControl.EditMode = document.member_context_menu.edit_mode.value; 
	});
	document.getElementById('canvas').addEventListener('change', function(e) {
		$contextMenu.memberControl.EditMode = document.member_context_menu.edit_mode.value; 
	});

	window.addEventListener('click', (e) => $contextMenu.style.display = 'none');
	$contextMenu.addEventListener('click', (e) => e.stopPropagation());
}

window.addEventListener('load', (e) => init());