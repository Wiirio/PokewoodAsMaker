class EditorControl {
	#editMode = 'authoring';
	get EditMode() { return this.#editMode; }
	set EditMode(value) { 
		this.#editMode = value;
		this.authoringControl.$control.hidden = this.EditMode != 'authoring';
		this.canvasControl.$control.hidden = this.EditMode != 'canvas';
	}

	constructor() {
		this.authoringControl = new AuthoringControl();
		this.canvasControl = new CanvasControl();

		this.$control = document.createElement('div');
		this.$control.classList.add('editor_container');
		this.$control.append(this.authoringControl.$control);
		this.$control.append(this.canvasControl.$control);

		// Member context menu
		this.$control.addEventListener('contextmenu', (e) => {
			let oldLastRightClick = lastRightClick;
			lastRightClick = e.timeStamp;
			if (!oldLastRightClick || lastRightClick > oldLastRightClick + 500)
				return;

			e.preventDefault();

			$contextMenu.innerHTML = '';
			$contextMenu.append(this.ContextMenuControl);

			$contextMenu.hidden = false;
			$contextMenu.style.left = e.clientX;
			$contextMenu.style.top = e.clientY - $contextMenu.clientHeight - 3;
		});

		this.EditMode = 'authoring';
	}

	get ContextMenuControl() {
		let $container = document.createElement('div');
		$container.classList.add('EditorControlContextMenu');

		let $selEditMode = document.createElement('select');
		for (let editMode of ['authoring', 'canvas']) {
			let $option = document.createElement('option');
			$option.value = editMode;
			$option.innerText = editMode;
			$option.selected = $option.value == this.EditMode;
			$selEditMode.append($option);
		}

		this.canvasControlContextMenuControl = this.canvasControl.ContextMenuControl;
		this.canvasControlContextMenuControl.hidden = this.EditMode != 'canvas'

		$selEditMode.addEventListener('change', (e) => { 
			this.EditMode = e.target.value;
			this.canvasControlContextMenuControl.hidden = this.EditMode != 'canvas';
		});

		$container.append(
			$selEditMode,
			this.canvasControlContextMenuControl);
		return $container;
	}
}

class AuthoringControl {
	constructor() {
		this.$control = document.createElement('div');
		this.$control.classList.add('editor', 'authoring_control');
		this.$control.setAttribute('contenteditable', true);
		this.$control.addEventListener('paste', (e) => onImagePasted(e));
	}
}

class CanvasControl {
	drawHistory = [];
	lastDraw = [];

	drawingX = undefined;
	drawingY = undefined;

	color = '#FFFFFF';
	get Color() { return this.color; }
	set Color(value) { this.color = value; }

	executeDraw(args) {
		var fnName = args[0];
		var fnArgs = Array.prototype.slice.call(args, 1);
		this[fnName].apply(this, fnArgs);
	}
	draw() {
		this.lastDraw.push(arguments);
		this.executeDraw(arguments);
	}
	undraw() {
		this.$control.getContext('2d').clearRect(0, 0, this.$control.width, this.$control.height);
		this.drawHistory.pop();
		for (let draw of this.drawHistory)
			for (let drawCommand of draw)
				this.executeDraw(drawCommand);
	}
	line(color, lineWidth, x1, y1, x2, y2) {
		let ctx = this.$control.getContext('2d');
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		ctx.closePath();
	};

	constructor() {
		const me = this;
		this.$control = document.createElement('canvas');
		this.$control.classList.add('editor', 'canvas_control');
		this.$control.setAttribute('tabindex', 0);

		this.$control.addEventListener('mousedown', (e) => e.target.focus());
		this.$control.addEventListener('mousemove', (e) => {
			if (!mouseDown) {
				if (me.lastDraw.length > 0) {
					me.drawHistory.push(me.lastDraw);
					me.lastDraw = [];
				}
				return;
			}
			let mouseX = ((e.clientX - e.target.offsetLeft) / e.target.clientWidth) * e.target.width;
			let mouseY = ((e.clientY - e.target.offsetTop) / e.target.clientHeight) * e.target.height;
			me.draw('line', me.color, 3, me.drawingX || mouseX, me.drawingY || mouseY, me.drawingX = mouseX, me.drawingY = mouseY);
		});
		this.$control.addEventListener('mouseup', (e) => { me.drawingX = me.drawingY = undefined; });
		this.$control.addEventListener('mouseleave', (e) => { me.drawingX = me.drawingY = undefined; });
		this.$control.addEventListener('keydown', (e) => { if (e.ctrlKey && e.key == 'z') me.undraw(); });
	}
	get ContextMenuControl() {
		let $container = document.createElement('div');
		$container.classList.add('CanvasControlContextMenu');

		let $selColor = document.createElement('input');
		$selColor.setAttribute('type', 'color');
		$selColor.value = this.Color;
		$selColor.addEventListener('change', (e) => this.Color = e.target.value);
		$container.append($selColor);

		return $container;
	}
}

class MemberControl {
	#showEqual = true;
	get ShowEqual() { return this.#showEqual; }
	set ShowEqual(value) {
		this.#showEqual = value;
		this.$equal.hidden = !this.ShowEqual;
	}

	constructor(member) {
		const me = this;

		this.$control = document.createElement('div');
		this.$control.classList += 'pokewood-member';
		this.$control.setAttribute('code', member.code);
	
		this.editorControl = new EditorControl();

		this.$equal = document.createElement('span');
		this.$equal.classList.add('member-equal');
		this.$equal.innerText = '=';
	
		const $avatar = document.createElement('img');
		$avatar.setAttribute('src', `./images/${member.code}.png`);
		$avatar.setAttribute('alt', member.code);

		this.$control.append(this.editorControl.$control);
		this.$control.append(this.$equal);
		this.$control.append($avatar);

		this.ShowEqual = this.ShowEqual;
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
lastRightClick = undefined;

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

function init() {
	const $headerEditor = document.getElementById('pw_header_editor');
	$headerEditor.append(new EditorControl().$control);

	const $grid = document.getElementById('grid');

	initMemberContextMenu();

	for (let member of members)
		$grid.append(new MemberControl(member).$control);
}

function initMemberContextMenu() {
	$contextMenu = document.createElement('div');
	$contextMenu.classList.add('context_menu');
	$contextMenu.hidden = true;
	document.body.append($contextMenu);
	window.addEventListener('mousedown', (e) => $contextMenu.hidden = true);
	$contextMenu.addEventListener('mousedown', (e) => e.stopPropagation());
}

window.addEventListener('load', (e) => init());