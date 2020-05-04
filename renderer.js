'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var electron = _interopDefault(require('electron'));
var path = _interopDefault(require('path'));
var gm = _interopDefault(require('gm'));

const imageMagick = gm.subClass({ imageMagick: true });

let screens;

drawScreens();

const fileInputs = Array.from(document.querySelectorAll('#screens-container input[type="file"]'));
for(let fileInput of fileInputs){
	fileInput.addEventListener('change', updateScreenImage);
}

const createWallpaperButton = document.querySelector('#create-wallpaper-button');
createWallpaperButton.addEventListener('click', createWallpaper);

function drawScreens(){
	screens = electron.screen.getAllDisplays().sort(sortScreens);

	const screensContainer = document.querySelector('#screens-container');
	for(let screen of screens){
		let i = screens.indexOf(screen);

		let screenTemplate = document.querySelector('#screen');
		let h2 = screenTemplate.content.querySelector('h2');
		let p = screenTemplate.content.querySelector('p');
		let input = screenTemplate.content.querySelector('input');
		h2.textContent = `Screen ${i}`;
		p.textContent = `${screen.size.width} x ${screen.size.height}`;
		input.dataset.index = i;
		let screenElement = document.importNode(screenTemplate.content, true);
		screensContainer.appendChild(screenElement);
	}
}

function sortScreens(a, b){
	return a.bounds.x - b.bounds.x;
}

function updateScreenImage(){
	if(this.files.length === 0)
		return;

	let file = this.files[0];
	const imageType = /^image\//;
	if(!imageType.test(file.type))
		return;

	const screenElement = this.parentElement;
	let index = this.dataset.index;

	screenElement.style.background = `url(file://${file.path}) no-repeat center/cover`;
	screens[parseInt(index, 10)].image = file.path;
}

function getBoundingScreenRect(){
	let rect = {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	for(let screen of screens){
		if(screen.bounds.x < rect.x)
			rect.x = screen.bounds.x;
		if(screen.bounds.y < rect.y)
			rect.y = screen.bounds.y;
		if(screen.bounds.x + screen.bounds.width > rect.width)
			rect.width = screen.bounds.x + screen.bounds.width;
		if(screen.bounds.y + screen.bounds.height > rect.height)
			rect.height = screen.bounds.y + screen.bounds.height;
	}

	return rect;
}

function createWallpaper(){
	let extent = getBoundingScreenRect();
	let screen = screens[0];
	console.log(screens);
	let imCommand = imageMagick(screen.image)
		.geometry(screen.bounds.width, screen.bounds.height, '^')
		.extent(extent.width, extent.height);

	for(let i = 1; i < screens.length; i++){
		screen = screens[i];
		imCommand
			.out(screen.image, '-geometry',
				`${screen.bounds.width}x${screen.bounds.height}^+${screen.bounds.x}+${screen.bounds.y}`,
				'-composite');
	}

	const outPath = electron.remote.dialog.showSaveDialog({
		defaultPath: path.join(electron.remote.app.getPath('downloads'), 'wallpaper.png')
	});

	imCommand.write(outPath, err => {
		if(!err)
			console.log('Wallpaper made successfully');
		else
			throw err;
	});
}