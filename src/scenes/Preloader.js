import Phaser from 'phaser';

export class Preloader extends Phaser.Scene {
	constructor() {
		super('Preloader');
	}

	create() {
		this.scene.start('Game');
	}

	preload() {}
}
