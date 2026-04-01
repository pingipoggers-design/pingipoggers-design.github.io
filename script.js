var MAIN_LEVELS = [
	[
		"                                                ",
		"                           o                    ",
		"                          xxx        x          ",
		"                                                ",
		"                                          x     ",
		"                  o         o      x            ",
		"                 xxx       xxx                  ",
		"                 xxx       xxx                  ",
		"                          xxxxx                 ",
		"                                                ",
		"         @   g                                  ",
		"xxxxxxxxxxxxxxxx   xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"xxxxxxxxxxxxxxxx   xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"xxxxxxxxxxxxxxxx!!!xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"                                                "
	],
  [
		"                                                ",
		"                           o                    ",
		"                          xxx        x          ",
		"                                                ",
		"                                          x     ",
		"                  o         o      x            ",
		"                 xxx       xxx                  ",
		"                 xxx       xxx                  ",
		"                          xxxxx                 ",
		"                                                ",
		"         @                                      ",
		"pppppppppppppppp   xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"xxxxxxxxxxxxxxxxgggxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"xxxxxxxxxxxxxxxx!!!xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
		"                                                "
	]
];
function Vector(x, y) {
	this.x = x;
	this.y = y;
}

var PART2_LEVELS = {
};

var greenPortalPairs = {};

var purplePortalPairs = {};

function isPart2Index(idx) {
	return typeof idx === "string" && idx.endsWith("b");
}

function getMainIndex(idx) {
	return isPart2Index(idx) ? parseInt(idx) : idx;
}

function getPart2Index(idx) {
	return idx + "b";
}

// Check if a level has a green portal connection to part 2
function hasGreenPortalConnection(mainIdx) {
	// Check if part 2 exists for this level
	if (!PART2_LEVELS.hasOwnProperty(mainIdx)) {
		return false;
	}

	// Check if main level has a green portal
	let mainPlan = MAIN_LEVELS[mainIdx];
	let mainHasGreen = findGreenPortalPos(mainPlan) !== null;

	// Check if part 2 has a green portal
	let part2Plan = PART2_LEVELS[mainIdx];
	let part2HasGreen = findGreenPortalPos(part2Plan) !== null;

	// Both must have green portals for them to be connected
	return mainHasGreen && part2HasGreen;
}

// Check if a level has a green portal connection to part 2
function hasPurplePortalConnection(mainIdx) {
	// Check if part 2 exists for this level
	if (!PART2_LEVELS.hasOwnProperty(mainIdx)) {
		return false;
	}
	// Check if main level has a purple portal
	let mainPlan = MAIN_LEVELS[mainIdx];
	let mainHasPurple = findPurplePortalPos(mainPlan) !== null;

	// Check if part 2 has a purple portal
	let part2Plan = PART2_LEVELS[mainIdx];
	let part2HasPurple = findPurplePortalPos(part2Plan) !== null;

	// Both must have purple portals for them to be connected
	return mainHasPurple && part2HasPurple;
}

function handleProgression(level, startLevelFunc) {
	var idx = getMainIndex(level.index);

	var mainCoins = coinTracker.main[idx] || 0;
	var part2Coins = coinTracker.part2[idx] || 0;

	var totalMainCoins = countCoinsInLevel(MAIN_LEVELS[idx]);

	// Check if this level has a connected part 2 (via green portals)
	var hasConnectedPart2 = hasGreenPortalConnection(idx);

	// Check if this level has a connected part 2 (via green portals)
	var hasConnectedPart2 = hasPurplePortalConnection(idx);

	// Determine if we can progress
	var canProgress = false;

	if (hasConnectedPart2) {
		// Both main and part 2 must have all coins collected
		let totalPart2Coins = countCoinsInLevel(PART2_LEVELS[idx]);
		canProgress = mainCoins >= totalMainCoins && part2Coins >= totalPart2Coins;

		console.log("Level " + idx + " has connected part 2:");
		console.log("Main coins: " + mainCoins + "/" + totalMainCoins);
		console.log("Part 2 coins: " + part2Coins + "/" + totalPart2Coins);
		console.log("Can progress: " + canProgress);
	} else {
		// Only main level coins needed
		canProgress = mainCoins >= totalMainCoins;

		console.log("Level " + idx + " has no connected part 2:");
		console.log("Main coins: " + mainCoins + "/" + totalMainCoins);
		console.log("Can progress: " + canProgress);
	}

	if (canProgress) {
		// Progress to next level
		console.log("Progressing to level " + (idx + 1));
		startLevelFunc(idx + 1);
	} else {
		// Return to main level to collect remaining coins
		console.log("Returning to level " + idx);
		startLevelFunc(idx);
	}
}

function findGreenParent(index) {
	for (var key in greenPortalPairs) {
		if (greenPortalPairs.hasOwnProperty(key)) {
			if (greenPortalPairs[key] === index) return parseInt(key, 10);
		}
	}
	return null;
}

function findGreenPortalPos(plan) {
	for (let y = 0; y < plan.length; y++) {
		for (let x = 0; x < plan[y].length; x++) {
			if (plan[y][x] === "G") {
				return { x, y };
			}
		}
	}
	return null;
}

function findPurpleParent(index) {
	for (var key in purplePortalPairs) {
		if (purplePortalPairs.hasOwnProperty(key)) {
			if (purplePortalPairs[key] === index) return parseInt(key, 10);
		}
	}
	return null;
}

function findPurplePortalPos(plan) {
	for (let y = 0; y < plan.length; y++) {
		for (let x = 0; x < plan[y].length; x++) {
			if (plan[y][x] === "P") {
				return { x, y };
			}
		}
	}
	return null;
}

Vector.prototype.plus = function (other) {
	return new Vector(this.x + other.x, this.y + other.y);
};

Vector.prototype.times = function (scale) {
	return new Vector(this.x * scale, this.y * scale);
};

var actorchars = {
	"@": Player,
	o: Coin,
	m: Fakecoin,
	u: Fakelava,
	q: Lavawall,
	"=": Lava,
	"|": Lava,
	"!": Lava,
	v: Lava,
	g: Ghost,
	h: Wall,
	b: whiteGhost,
	i: Invis,
	d: Door,
	"&": Player2,

	// === PORTAL ADDITIONS START ===
	O: OrangePortal,
	B: BluePortal,
	8: FakeOrangePortal,
	9: FakeBluePortal,
	G: GreenPortal,
	P: PurplePortal
	// === PORTAL ADDITIONS END ===
};

function Door(pos) {
	this.pos = pos;
	this.size = new Vector(1, 1);
	this.repeatPos = pos;
}
Door.prototype.type = "Door";
Door.prototype.act = function (step) {};

function block(pos) {
	this.pos = pos;
	this.size = new Vector(1, 0.3);
}
block.prototype.type = "block";
block.prototype.act = function (step) {};

function block2(pos) {
	this.pos = pos;
	this.size = new Vector(1, 0.3);
}
block2.prototype.type = "block2";
block2.prototype.act = function (step) {};

function block3(pos) {
	this.pos = pos;
	this.size = new Vector(1, 0.3);
}
block3.prototype.type = "block3";
block3.prototype.act = function (step) {};

function block4(pos) {
	this.pos = pos;
	this.size = new Vector(1, 0.3);
}
block4.prototype.type = "block4";
block4.prototype.act = function (step) {};

function Player(pos) {
	this.pos = pos.plus(new Vector(0, -0.4));
	this.size = new Vector(0.85, 0.85);
	this.speed = new Vector(0, 0);
	this.lastPortalTouched = null; // Track which portal was last touched
}

Player.prototype.type = "player";

function Lava(pos, ch) {
	this.pos = pos;
	this.size = new Vector(1, 1);
	if (ch === "!") this.speed = new Vector(0, 0);
	else if (ch === "=") this.speed = new Vector(2, 0);
	else if (ch === "|") this.speed = new Vector(0, 4);
	else if (ch === ":") this.speed = new Vector(0, 0);
	else if (ch === "/") this.speed = new Vector(0, 0);
	else if (ch === "v") {
		this.speed = new Vector(0, 3);
		this.repeatPos = pos;
	}
}
Lava.prototype.type = "lava";

function Coin(pos) {
	this.basePos = this.pos = pos;
	this.size = new Vector(0.6, 0.6);
	this.wobble = Math.random() * Math.PI * 2;
}
Coin.prototype.type = "coin";

function Ghost(pos) {
	this.basePos = this.pos = pos;
	this.size = new Vector(1, 1);
}
Ghost.prototype.type = "ghost";
Ghost.prototype.act = function (step) {};

function whiteGhost(pos) {
	this.basePos = this.pos = pos;
	this.size = new Vector(0.7, 0.7);
}
whiteGhost.prototype.type = "whiteghost";
whiteGhost.prototype.act = function (step) {};

function Lavawall(pos) {
	this.basePos = this.pos = pos;
	this.size = new Vector(0.7, 0.7);
	this.wobble = Math.random() * Math.PI * 2;
}
Lavawall.prototype.type = "Lavawall";
Lavawall.prototype.act = function (step) {};

function Wall(pos) {
	this.basePos = this.pos = pos;
	this.size = new Vector(0.6, 0.6);
}
Wall.prototype.type = "Wall";
Wall.prototype.act = function (step) {};

function Invis(pos) {
	this.basePos = this.pos = pos;
	this.size = new Vector(0.6, 0.6);
}
Invis.prototype.type = "Invis";
Invis.prototype.act = function (step) {};

// === PORTAL ADDITIONS START ===
function OrangePortal(pos) {
	this.pos = pos;
	this.size = new Vector(1, 1);
}
OrangePortal.prototype.type = "orangePortal";
OrangePortal.prototype.act = function () {};

function BluePortal(pos) {
	this.pos = pos;
	this.size = new Vector(1, 1);
}
BluePortal.prototype.type = "bluePortal";
BluePortal.prototype.act = function () {};

function FakeOrangePortal(pos) {
	this.pos = pos;
	this.size = new Vector(1, 1);
}
FakeOrangePortal.prototype.type = "fakeOrangePortal";
FakeOrangePortal.prototype.act = function () {};

function FakeBluePortal(pos) {
	this.pos = pos;
	this.size = new Vector(1, 1);
}
FakeBluePortal.prototype.type = "fakeBluePortal";
FakeBluePortal.prototype.act = function () {};

function GreenPortal(pos) {
	this.pos = pos;
	this.size = new Vector(1, 1);
}
GreenPortal.prototype.type = "greenPortal";
GreenPortal.prototype.act = function () {};

function PurplePortal(pos) {
	this.pos = pos;
	this.size = new Vector(1, 1);
}
PurplePortal.prototype.type = "purplePortal";
PurplePortal.prototype.act = function () {};

// === PORTAL ADDITIONS END ===

function Level(plan) {
	this.width = plan[0].length;
	this.height = plan.length;
	this.grid = [];
	this.actors = [];

	this.levelChangeRequested = false;
	this.levelChangeTarget = null;
	this.index = null;

	for (var y = 0; y < this.height; y++) {
		var line = plan[y],
			gridLine = [];
		for (var x = 0; x < this.width; x++) {
			var ch = line[x],
				fieldType = null;
			var Actor = actorchars[ch];
			if (Actor) this.actors.push(new Actor(new Vector(x, y), ch));
			else if (ch === "x") fieldType = "wall";
			else if (ch === "!") fieldType = "lava";
			else if (ch === "/") fieldType = "lava-slope-down";
			else if (ch === ":") fieldType = "lava-slope-up";
			else if (ch === "|") fieldType = "lava";
			else if (ch === "=") fieldType = "lava";
			else if (ch === "g") fieldType = "ghost";
			else if (ch === "b") fieldType = "whiteghost";
			else if (ch === "m") fieldType = "Fakecoin";
			else if (ch === "u") fieldType = "Fakelava";
			else if (ch === "p") fieldType = "Invis";
			else if (ch === "l") fieldType = "lavawall";
			else if (ch === "w") fieldType = "block";
			else if (ch === "y") fieldType = "block2";
			else if (ch === "k") fieldType = "block3";
			else if (ch === "j") fieldType = "block4";
			else if (ch === "v") {
				fieldType = "lava";
				console.log(fieldType);
			}
			gridLine.push(fieldType);
		}
		this.grid.push(gridLine);
	}
	this.player = this.actors.filter(function (actor) {
		return actor.type === "player" || actor.type === "player2";
	})[0];
	this.status = this.finishDelay = null;
}

Level.prototype.isFinished = function () {
	return this.status != null && this.finishDelay < 0;
};

function element(name, className) {
	var elem = document.createElement(name);
	if (className) elem.className = className;
	return elem;
}

function DOMDisplay(parent, level) {
	this.wrap = parent.appendChild(element("div", "game"));
	this.level = level;

	this.wrap.appendChild(this.drawBackground());
	this.actorLayer = null;
	this.drawFrame();
}

var scale = 16;

DOMDisplay.prototype.drawBackground = function () {
	var table = element("table", "background");
	table.style.width = this.level.width * scale + "px";
	table.style.height = this.level.height * scale + "px";
	this.level.grid.forEach(function (row) {
		var rowElement = table.appendChild(element("tr"));
		rowElement.style.height = scale + "px";
		row.forEach(function (type) {
			rowElement.appendChild(element("td", type));
		});
	});
	return table;
};

DOMDisplay.prototype.centerPlayer = function () {
	let scale = this.scale;
	let player = this.level.player;
	let width = this.wrap.clientWidth;
	let height = this.wrap.clientHeight;

	let centerX = player.pos.x * scale + (player.size.x * scale) / 2;
	let centerY = player.pos.y * scale + (player.size.y * scale) / 2;

	this.wrap.scrollLeft = centerX - width / 2;
	this.wrap.scrollTop = centerY - height / 2;
};

var arrowCodes = {
	37: "left",
	38: "up",
	39: "right",
	87: "w",
	65: "a",
	68: "d",
	82: "r",
	188: ",",
	190: "."
};

function trackKeys(codes) {
	var pressed = Object.create(null);
	function handler(event) {
		if (codes.hasOwnProperty(event.keyCode)) {
			var down = event.type == "keydown";
			pressed[codes[event.keyCode]] = down;
			event.preventDefault();
		}
	}
	addEventListener("keydown", handler);
	addEventListener("keyup", handler);
	return pressed;
}

var arrows = trackKeys(arrowCodes);

DOMDisplay.prototype.drawActors = function () {
	var wrap = element("div");
	this.level.actors.forEach(function (actor) {
		var rect = wrap.appendChild(element("div", "actor " + actor.type));
		rect.style.width = actor.size.x * scale + "px";
		rect.style.height = actor.size.y * scale + "px";
		rect.style.left = actor.pos.x * scale + "px";
		rect.style.top = actor.pos.y * scale + "px";
	});
	return wrap;
};

DOMDisplay.prototype.drawFrame = function () {
	if (this.actorLayer) this.wrap.removeChild(this.actorLayer);
	this.actorLayer = this.wrap.appendChild(this.drawActors());
	this.wrap.className = "game " + (this.level.status || "");
	this.scrollPlayerIntoView();
};

DOMDisplay.prototype.scrollPlayerIntoView = function () {
	var width = this.wrap.clientWidth;
	var height = this.wrap.clientHeight;
	var margin = width / 3;

	var left = this.wrap.scrollLeft,
		right = left + width;
	var top = this.wrap.scrollTop,
		bottom = top + height;

	var player = this.level.player;
	var center = player.pos.plus(player.size.times(0.5)).times(scale);
	if (center.x < left + margin) this.wrap.scrollLeft = center.x - margin;
	else if (center.x > right - margin)
		this.wrap.scrollLeft = center.x + margin - width;
	if (center.y < top + margin) this.wrap.scrollTop = center.y - margin;
	else if (center.y > bottom - margin)
		this.wrap.scrollTop = center.y + margin - height;
};

DOMDisplay.prototype.clear = function () {
	this.wrap.parentNode.removeChild(this.wrap);
};

Level.prototype.obstacleAt = function (pos, size) {
	var xStart = Math.floor(pos.x);
	var xEnd = Math.ceil(pos.x + size.x);
	var yStart = Math.floor(pos.y);
	var yEnd = Math.ceil(pos.y + size.y);

	if (xStart < 0 || xEnd > this.width || yStart < 0) return "wall";
	if (yEnd > this.height) return "lava";

	for (var y = yStart; y < yEnd; y++) {
		for (var x = xStart; x < xEnd; x++) {
			var fieldType = this.grid[y][x];
			if (fieldType) {
				if (fieldType === "block") {
					if (
						this.player &&
						size.y - pos.y > this.player.size.y - this.player.pos.y
					) {
						continue;
					}
				}
				if (fieldType === "block2") {
					if (
						this.player &&
						size.y + pos.y > this.player.size.y + this.player.pos.y
					) {
						continue;
					}
				}
				if (fieldType === "block3") {
					if (
						this.player &&
						size.x - pos.x > this.player.size.x - this.player.pos.x
					) {
						continue;
					}
				}
				if (fieldType === "block4") {
					if (
						this.player &&
						size.x + pos.x > this.player.size.x + this.player.pos.x
					) {
						continue;
					}
				} else if (fieldType === "invis") {
					continue;
				}
				return fieldType;
			}
		}
	}
};

Level.prototype.actorAt = function (actor) {
	for (var i = 0; i < this.actors.length; i++) {
		var other = this.actors[i];
		if (
			other != actor &&
			actor.pos.x + actor.size.x > other.pos.x &&
			actor.pos.x < other.pos.x + other.size.x &&
			actor.pos.y + actor.size.y > other.pos.y &&
			actor.pos.y < other.pos.y + other.size.y
		)
			return other;
	}
};

var maxStep = 0.05;

Level.prototype.animate = function (step, keys) {
	if (this.status != null) this.finishDelay -= step;

	while (step > 0) {
		var thisStep = Math.min(step, maxStep);
		this.actors.forEach(function (actor) {
			actor.act(thisStep, this, keys);
		}, this);
		step -= thisStep;
	}
};

Lava.prototype.act = function (step, level) {
	var newPos = this.pos.plus(this.speed.times(step));
	if (!level.obstacleAt(newPos, this.size)) this.pos = newPos;
	else if (this.repeatPos) this.pos = this.repeatPos;
	else this.speed = this.speed.times(-1);
};

var wobbleSpeed = 8,
	wobbleDist = 0.07;

Coin.prototype.act = function (step) {
	this.wobble += step * wobbleSpeed;
	var wobblePos = Math.sin(this.wobble) * wobbleDist;
	this.pos = this.basePos.plus(new Vector(0, wobblePos));
};

var playerXSpeed = 10;
var gravity = 30;
var jumpSpeed = 17;

Player.prototype.moveX = function (step, level, keys) {
	this.speed.x = 0;
	if (keys.left) this.speed.x -= playerXSpeed;
	if (keys.right) this.speed.x += playerXSpeed;

	var motion = new Vector(this.speed.x * step, 0);
	var newPos = this.pos.plus(motion);
	var obstacle = level.obstacleAt(newPos, this.size);
	if (obstacle) level.playerTouched(obstacle);
	else this.pos = newPos;
};

Player.prototype.moveY = function (step, level, keys) {
	this.speed.y += step * gravity;
	var motion = new Vector(0, this.speed.y * step);
	var newPos = this.pos.plus(motion);
	var obstacle = level.obstacleAt(newPos, this.size);

	if (obstacle) {
		level.playerTouched(obstacle);
		if (keys.up && this.speed.y > 0) {
			this.speed.y = -jumpSpeed;
		} else {
			this.speed.y = 0;
		}
	} else {
		this.pos = newPos;
	}
};

Player.prototype.act = function (step, level, keys) {
	this.moveX(step, level, keys);
	this.moveY(step, level, keys);

	var otherActor = level.actorAt(this);
	if (otherActor) {
		level.playerTouched(otherActor.type, otherActor);
	} else {
		// Player is not touching any actor, reset portal tracking
		this.lastPortalTouched = null;
	}

	if (level.status == "lost") {
		// No dying animation
	}

	if (keys.r) {
		this.kill(level);
	}
};

Player.prototype.kill = function (level) {
	level.status = "lost";
	level.finishDelay = 0.1;
};

Level.prototype.playerTouched = function (type, actor) {
	if (type === "lava" && this.status === null) {
		this.status = "lost";
		this.finishDelay = 0.1;
	} else if (type === "coin") {
		// Remove coin from level
		this.actors = this.actors.filter((a) => a !== actor);

		let idx = this.index;

		// MAIN level
		if (!isPart2Index(idx)) {
			if (!coinTracker.main[idx]) coinTracker.main[idx] = 0;
			coinTracker.main[idx]++;
		}

		// PART 2 level
		else {
			let mainIdx = getMainIndex(idx);
			if (!coinTracker.part2[mainIdx]) coinTracker.part2[mainIdx] = 0;
			coinTracker.part2[mainIdx]++;
		}

		// Check if all coins are collected for progression
		let mainIdx = getMainIndex(idx);
		let mainCoins = coinTracker.main[mainIdx] || 0;
		let part2Coins = coinTracker.part2[mainIdx] || 0;
		let totalMainCoins = countCoinsInLevel(MAIN_LEVELS[mainIdx]);
		let hasConnectedPart2 = hasGreenPortalConnection(mainIdx);

		let allCoinsCollected = false;

		if (hasConnectedPart2) {
			let totalPart2Coins = countCoinsInLevel(PART2_LEVELS[mainIdx]);
			allCoinsCollected =
				mainCoins >= totalMainCoins && part2Coins >= totalPart2Coins;
		} else {
			allCoinsCollected = mainCoins >= totalMainCoins;
		}

		// If all coins collected, trigger level completion
		if (allCoinsCollected) {
			this.status = "won";
			this.finishDelay = 1;
		}
	} else if (type === "Door") {
		this.status = "won";
		this.finishDelay = 0;
	} else if (type === "orangePortal") {
		// Check if this is a different portal than last touched
		if (this.player.lastPortalTouched !== actor) {
			var blue = this.actors.find(function (a) {
				return a.type === "bluePortal";
			});
			if (blue) {
				this.player.pos = blue.pos.plus(new Vector(0, 0));
				this.player.lastPortalTouched = blue;
			}
		}
	} else if (type === "bluePortal") {
		// Check if this is a different portal than last touched
		if (this.player.lastPortalTouched !== actor) {
			var orange = this.actors.find(function (a) {
				return a.type === "orangePortal";
			});
			if (orange) {
				this.player.pos = orange.pos.plus(new Vector(0, 0));
				this.player.lastPortalTouched = orange;
			}
		}
	} else if (type === "fakeOrangePortal" || type === "fakeBluePortal") {
		// fake portals do nothing
	} else if (type === "greenPortal") {
		if (this.player.lastPortalTouched !== actor) {
			let idx = this.index;

			// MAIN → PART 2
			if (!isPart2Index(idx)) {
				if (PART2_LEVELS.hasOwnProperty(idx)) {
					let targetPlan = PART2_LEVELS[idx];
					let targetPos = findGreenPortalPos(targetPlan);

					this.levelChangeRequested = true;
					this.levelChangeTarget = {
						index: idx + "b",
						spawn: targetPos,
						markPortalTouched: true
					};

					this.player.lastPortalTouched = actor;
				}
			}

			// PART 2 → MAIN
			else {
				let mainIdx = getMainIndex(idx);
				let targetPlan = MAIN_LEVELS[mainIdx];
				let targetPos = findGreenPortalPos(targetPlan);

				this.levelChangeRequested = true;
				this.levelChangeTarget = {
					index: mainIdx,
					spawn: targetPos,
					markPortalTouched: true
				};

				this.player.lastPortalTouched = actor;
			}
		}
	} else if (type === "purplePortal") {
		if (this.player.lastPortalTouched !== actor) {
			let idx = this.index;

			// MAIN → PART 2
			if (!isPart2Index(idx)) {
				if (PART2_LEVELS.hasOwnProperty(idx)) {
					let targetPlan = PART2_LEVELS[idx];
					let targetPos = findPurplePortalPos(targetPlan);

					this.levelChangeRequested = true;
					this.levelChangeTarget = {
						index: idx + "b",
						spawn: targetPos,
						markPortalTouched: true
					};

					this.player.lastPortalTouched = actor;
				}
			}

			// PART 2 → MAIN
			else {
				let mainIdx = getMainIndex(idx);
				let targetPlan = MAIN_LEVELS[mainIdx];
				let targetPos = findPurplePortalPos(targetPlan);

				this.levelChangeRequested = true;
				this.levelChangeTarget = {
					index: mainIdx,
					spawn: targetPos,
					markPortalTouched: true
				};

				this.player.lastPortalTouched = actor;
			}
		}
	}
};

function runAnimation(frameFunc) {
	var lastTime = null;
	function frame(time) {
		var stop = false;
		if (lastTime != null) {
			var timeStep = Math.min(time - lastTime, 100) / 1000;
			stop = frameFunc(timeStep) === false;
		}
		lastTime = time;
		if (!stop) requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);
}

var arrows = trackKeys(arrowCodes);

function runLevel(level, Display, andThen) {
	var display = new Display(document.body, level);
	runAnimation(function (step) {
		level.animate(step, arrows);
		display.drawFrame(step);

		if (level.isFinished() || level.levelChangeRequested) {
			display.clear();
			if (andThen) andThen(level);
			return false;
		}
	});
}

function runGame(plans, Display) {
	function startLevel(target) {
		let index, spawnPos, cooldown, markPortalTouched;

		if (typeof target === "object") {
			index = target.index;
			spawnPos = target.spawn;
			cooldown = target.cooldown || 0;
			markPortalTouched = target.markPortalTouched || false;
		} else {
			index = target;
			spawnPos = null;
			cooldown = 0;
			markPortalTouched = false;
		}

		let plan;

		if (isPart2Index(index)) {
			plan = PART2_LEVELS[getMainIndex(index)];
		} else {
			plan = MAIN_LEVELS[index];
		}

		let level = new Level(plan);
		level.index = index;
		// Remove coins already collected
		let mainIdx = getMainIndex(index);

		if (!isPart2Index(index)) {
			let collected = coinTracker.main[mainIdx] || 0;
			let total = countCoinsInLevel(plan);

			if (collected > 0) {
				level.actors = level.actors.filter((a) => a.type !== "coin");
				// Re-add only the remaining coins
				let remaining = total - collected;
				if (remaining > 0) {
					// Rebuild coins from plan
					for (let y = 0; y < plan.length; y++) {
						for (let x = 0; x < plan[y].length; x++) {
							if (plan[y][x] === "o" && remaining > 0) {
								level.actors.push(new Coin(new Vector(x, y)));
								remaining--;
							}
						}
					}
				}
			}
		}

		// PART 2
		else {
			let collected = coinTracker.part2[mainIdx] || 0;
			let total = countCoinsInLevel(plan);

			if (collected > 0) {
				level.actors = level.actors.filter((a) => a.type !== "coin");
				let remaining = total - collected;
				if (remaining > 0) {
					for (let y = 0; y < plan.length; y++) {
						for (let x = 0; x < plan[y].length; x++) {
							if (plan[y][x] === "o" && remaining > 0) {
								level.actors.push(new Coin(new Vector(x, y)));
								remaining--;
							}
						}
					}
				}
			}
		}

		// Apply spawn position
		if (spawnPos) {
			level.player.pos.x = spawnPos.x;
			level.player.pos.y = spawnPos.y;
		}

		// If spawning from a portal, mark the portal we're spawning on as already touched
		if (markPortalTouched) {
			// Find the green portal at spawn position and mark it as touched
			let greenPortal = level.actors.find(function (actor) {
				return (
					actor.type === "greenPortal" &&
					Math.abs(actor.pos.x - level.player.pos.x) < 1 &&
					Math.abs(actor.pos.y - level.player.pos.y) < 1
				);
			});
			if (greenPortal) {
				level.player.lastPortalTouched = greenPortal;
			}
		}

		if (markPortalTouched) {
			// Find the green portal at spawn position and mark it as touched
			let purplePortal = level.actors.find(function (actor) {
				return (
					actor.type === "purplePortal" &&
					Math.abs(actor.pos.x - level.player.pos.x) < 1 &&
					Math.abs(actor.pos.y - level.player.pos.y) < 1
				);
			});
			if (purplePortal) {
				level.player.lastPortalTouched = purplePortal;
			}
		}

		runLevel(level, DOMDisplay, function (finishedLevel) {
			if (finishedLevel.levelChangeRequested) {
				startLevel(finishedLevel.levelChangeTarget);
				return;
			}

			if (finishedLevel.status === "lost") {
				// Reset coins when player dies
				let mainIdx = getMainIndex(index);
				coinTracker.main[mainIdx] = 0;
				coinTracker.part2[mainIdx] = 0;
				startLevel(index);
				return;
			}

			if (finishedLevel.status === "won" || finishedLevel.status === "cleared") {
				handleProgression(finishedLevel, startLevel);
			}
		});
	}
	startLevel(0);
}

var coinTracker = {
	main: {},
	part2: {}
};

function countCoinsInLevel(plan) {
	let count = 0;
	for (let y = 0; y < plan.length; y++) {
		for (let x = 0; x < plan[y].length; x++) {
			if (plan[y][x] === "o") count++;
		}
	}
	return count;
}

runGame(MAIN_LEVELS, DOMDisplay);

function Fakecoin(pos) {
	this.basePos = this.pos = pos;
	this.size = new Vector(0.6, 0.6);
	this.wobble = Math.random() * Math.PI * 2;
}
Fakecoin.prototype.type = "Fakecoin";

Fakecoin.prototype.act = function (step) {
	this.wobble += step * wobbleSpeed;
	var wobblePos = Math.sin(this.wobble) * wobbleDist;
	this.pos = this.basePos.plus(new Vector(0, wobblePos));
};

function Fakelava(pos) {
	this.pos = pos;
	this.size = new Vector(1, 1);
	this.speed = new Vector(0, 0);
}
Fakelava.prototype.type = "Fakelava";
Fakelava.prototype.act = function (step) {};

function Player2(pos) {
	this.pos = pos.plus(new Vector(0, -0.4));
	this.size = new Vector(0.95, 0.95);
	this.speed = new Vector(0, 0);
}
Player2.prototype.type = "player2";

Player2.prototype.moveX = function (step, level, keys) {
	this.speed.x = 0;
	if (keys.a) this.speed.x -= playerXSpeed;
	if (keys.d) this.speed.x += playerXSpeed;

	var motion = new Vector(this.speed.x * step, 0);
	var newPos = this.pos.plus(motion);
	var obstacle = level.obstacleAt(newPos, this.size);
	if (obstacle) level.playerTouched(obstacle);
	else this.pos = newPos;
};

Player2.prototype.moveY = function (step, level, keys) {
	this.speed.y += step * gravity;
	var motion = new Vector(0, this.speed.y * step);
	var newPos = this.pos.plus(motion);
	var obstacle = level.obstacleAt(newPos, this.size);

	if (obstacle) {
		level.playerTouched(obstacle);
		if (keys.w && this.speed.y > 0) {
			this.speed.y = -jumpSpeed;
		} else {
			this.speed.y = 0;
		}
	} else {
		this.pos = newPos;
	}
};

Player2.prototype.act = function (step, level, keys) {
	this.moveX(step, level, keys);
	this.moveY(step, level, keys);

	var otherActor = level.actorAt(this);
	if (otherActor) level.playerTouched(otherActor.type, otherActor);

	if (level.status == "lost") {
		// no dying animation
	}
};
