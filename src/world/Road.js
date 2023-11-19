import Phaser from 'phaser';
import Consts from '../consts';
import Utils from '../utils';

const MAP_WIDTH = 50;
const MAP_HEIGHT = 18;

export class Road {
    constructor(scene) {
        this.scene = scene;
        this.currentLayerIdx = 0;
    }

    generate() {
        const scene = this.scene;

        const map = scene.make.tilemap({
            tileWidth: 16,
            tileHeight: 16,
            width: MAP_WIDTH * 2,
            height: MAP_HEIGHT * 2
        });
        const tileset = map.addTilesetImage('road_tiles');

        const ypos = 100;
        const layers = [
            map.createBlankLayer('layer1', tileset, 0, ypos),
            map.createBlankLayer('layer2', tileset, Consts.screenWidth, ypos),
            map.createBlankLayer('layer3', tileset, Consts.screenWidth * 2, ypos),
        ];

        for (let y = 0; y < MAP_HEIGHT; y += 3) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                if (x == 0) {
                    // crossroad tiles
                    layers.forEach(l => {
                        l.putTileAt(4, x, y);
                        l.putTileAt(4 + 6, x, y + 1);
                        l.putTileAt(4 + 12, x, y + 2);
                    });
                } else if (x == 1) {
                    // crossroad tiles
                    layers.forEach(l => {
                        l.putTileAt(5, x, y);
                        l.putTileAt(5 + 6, x, y + 1);
                        l.putTileAt(5 + 12, x, y + 2);
                    });
                } else {
                    // lane tiles
                    layers.forEach(l => {
                        l.putTileAt(0, x, y);
                        l.putTileAt((x - 2) % 4 + 6, x, y + 1);
                        l.putTileAt(0, x, y + 2);
                    });
                }
            }
        }

        layers.forEach((l, i) => {
            l.setScale(1);
            l.setDepth(-99);
        });

        this.layers = layers;
    }

    update(player) {
        const x = this.scene.cameras.main.worldView.centerX;
        const screenWidthLimit_1 = Consts.screenWidth + Consts.screenWidth * 0.5; // 1200

        if (x % screenWidthLimit_1 >= screenWidthLimit_1 - player.speed ||
            (x % Consts.screenWidth >= Consts.screenWidth - player.speed && this.currentLayerIdx > 1)) {
            Utils.debug('(change) road tiles layer', x % 1200)

            const layer = this.layers[this.currentLayerIdx];
            layer.x = layer.x + Consts.screenWidth * this.layers.length;
            Utils.debug('(change) road tiles layer', this.currentLayerIdx, layer.x)

            this.currentLayerIdx += 1;
            if (this.currentLayerIdx >= this.layers.length) {
                this.currentLayerIdx = 0;
            }
        }
    }
}