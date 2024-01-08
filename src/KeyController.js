import { Player } from "./Player";

export class KeyController {
	constructor(player) {
		// 생성자
		this.keys = [];
		this.player=player
		window.addEventListener('keydown', e => {
			this.keys[e.code] = true;
			this.player.moving=true;
		});

		window.addEventListener('keyup', e => {
			delete this.keys[e.code];
			this.player.moving=false
		});
	}
}
