import Phaser from 'phaser';
import Consts from '../consts';
import Audio from '../audio';
import Player from '../actors/Player';
import Npc from '../actors/Npc';
import Police from '../actors/Police';
import { World } from '../world';

const MAX_POLICE = 1;
const MAX_NPC = 50;

let money = 10000000;
let destructionCaused = 0;

export class Game extends Phaser.Scene {
	constructor() {
		super('Game');
	}

	create() {
		this.npcs = [];
		this.police = [];
		this.player = new Player(this, this.police, this.npcs);
		
		for (let lane = 0; lane < Consts.lanes + 1; lane++) {
			for (let i = 0; i < MAX_NPC; i++) {
				const npc = new Npc(this, this.player, this.police, this.npcs);
				npc.x = Math.random() * (Consts.worldWidth - Consts.screenWidth) + Consts.screenWidth;
				npc.setLane(lane);
				npc.speed *= Math.random() * (1.05 - 0.95) + 0.95;
				this.npcs.push(npc);
			}
		}

		for (let i = 0; i < MAX_POLICE; i++) {
			const police = new Police(this, this.player, this.npcs);
			this.police.push(police);
		}

		this.cameras.main.startFollow(this.player);
		this.cameras.main.setBounds(0, 0, Consts.worldWidth, Consts.screenHeight);

		this.world = new World(this, this.player);
		this.world.generate();

		this.audio = new Audio(this);
		this.audio.playMusic('music-play', { vol: 0, loop: true });
		this.audio.fadeIn(null, { duration: 2000, maxVol: 0.5 });
	}

	gameOver() {
		this.scene.start('Gameover');
	}

	update(time, delta) {		
		this.player.update(time, delta);
		this.world.update(time, delta);
		
		this.police.forEach((police) => {
			if (police.checkForCollision(this.player)) {
				this.gameOver();
			}
			
			police.update(time, delta)
		});
		
		this.npcs.forEach((npc) => {
			if (npc.checkForCollision(this.player)) {
				if (!this.player.states.isBig) {
					this.player.setHealth(this.player.health - 2);
					this.player.screenShake();
				}
				
				this.player.explosion.x = npc.x + npc.width / 2;
				this.player.explosion.y = npc.y - npc.height / 2;
				this.player.playExplosionAnimation();
				npc.die();
			}

			npc.update(time, delta);
		});
		
		if (this.player.health == 0) {
			this.gameOver();	
		}
	}
}
