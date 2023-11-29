import Phaser from 'phaser';
import Consts from '../consts';
import Utils from '../utils';

const MAX_OBSTACLES = 20;
const TIME_GENERATE = 2000; // 2 seconds

export default class Obstacles {
	constructor(scene, config) {
		this.scene = scene;
		this.config = Utils.assert('config', config);
		this._obstacleLanes = [];
		this.lastLaneIdx = 0;
		this._chance = 75; // %
		this._createNow = false;
	}

	generate() {
		// generate which lanes will have obstacles on them
		while (this._obstacleLanes.length < Consts.maxObstacleLanes) {
			let idx = Phaser.Math.Between(0, Consts.lanes);
			if (this._obstacleLanes.indexOf(idx) < 0
				&& this._obstacleLanes.indexOf(idx + 1) < 0
				&& this._obstacleLanes.indexOf(idx - 1) < 0) {
				this._obstacleLanes.push(idx);
			}
		}

		//  this._obstacleLanes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
		Utils.debug('(obstacle lanes)', this._obstacleLanes);

		// generate obstacles that will be put on random on road lanes
		this.group = this.scene.add.group({
			maxSize: MAX_OBSTACLES
		});
		this.group.setDepth(Consts.z.obstaclesLayer);

		// generate initial entities
		for (let i = 0; i < this._obstacleLanes.length; i++) {
			this.createEntity(0, Consts.screenWidth * 2);
		}

		// add objects generation timer
		this.triggerTimer = this.scene.time.addEvent({
			callback: () => {
				this._createNow = true;
			},
			// callbackScope: this,
			delay: 2000,
			loop: true
		});
	}

	canCreate() {
		return Phaser.Math.Between(0, 100) < this._chance;
	}

	createEntity(xMin, xMax) {
		let name;
		let yOffset;
		let scale = 1;
		let frame = undefined;

		switch (Phaser.Math.Between(0, 2)) {
			case 0:
				name = 'trap_road_h_block';
				yOffset = 8;
				scale = 1;
				frame = 0;
				break;
			case 1:
			case 2:
				name = 'trap_hole';
				yOffset = 17;
				scale = 1;
				break;
			// case 3:
			// 	name = 'trap_road_pole';
			// 	yOffset = 15;
			// 	scale = 2;
			// 	frame = 0;
			// 	break;
		}

		const x = Phaser.Math.Between(xMin, xMax);
		const y = Consts.laneStartY + this._obstacleLanes[this.lastLaneIdx] * 32 + yOffset;
		// console.log('y=' ,y, 'type= ', name, 'scale=', scale, 'yoff=', yOffset)
		const entity = this.group.get(x, y, name, frame);
		if (entity) {
			entity
				.setActive(true)
				.setVisible(true)
				.setScale(scale)
				.setFlipX(Phaser.Math.Between(0, 100) > 50);

			this.lastLaneIdx += 1;
			if (this.lastLaneIdx >= this._obstacleLanes.length) {
				this.lastLaneIdx = 0;
			}
		}
	}

	update(time, delta) {
		const x = this.scene.cameras.main.worldView.centerX;

		if (this._createNow) {
			this._createNow = false;

			if (this.canCreate()) {
				const min = x + Consts.screenWidth * 1.75;
				const max = x + Consts.screenWidth * 2;
				this.createEntity(min, max);
			}
		}

		this.group.getChildren().forEach((entity) => {
			if (entity.x < x - Consts.screenWidth) {
				this.group.killAndHide(entity);
			}
		});
	}

	/**
	 * The more chance added, the more often obstacles get generated
	 * 
	 * @param {Number} value 
	 */
	addChance(value) {
		this._chance = Math.max(25, this._chance - (value || 1));
	}

	get obstacleLanes() {
		return this._obstacleLanes;
	}
}
