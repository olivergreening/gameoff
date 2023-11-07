import Phaser from 'phaser';
import Consts from '../consts';
import { Controls } from '../controls';

export class Transition extends Phaser.Scene {
    constructor() {
        super('Transition');
    }

    create() {
        this.controls = new Controls(this.input);

        // todo: add a background image instead
        this.add.rectangle(0, 0, Consts.screenWidth, Consts.screenHeight, 0x5079bf).setOrigin(0);

        this.add.bitmapText(Consts.screenWidth * 0.5, Consts.screenHeight * 0.5 - 50, Consts.font, 'Get ready to escape!', 48).setOrigin(0.5);
        this.add.bitmapText(Consts.screenWidth * 0.5, Consts.screenHeight - 50, Consts.font, 'Press space to continue...', 24).setOrigin(0.5);

        this.countdownText = this.add.bitmapText(Consts.screenWidth * 0.5, Consts.screenHeight - 150, Consts.font, '', 24);
        this.countdownText.setOrigin(0.5);

        this.countdownTimer = this.time.addEvent({ delay: 1000, repeat: 10 });
    }

    update(time, delta) {
        this.controls.update(time);

        if (this.controls.action1.isPressed) {
            this.scene.start('Game');
        }
        if (this.countdownTimer.getRepeatCount() > 0) {
            this.countdownText.setText(this.countdownTimer.getRepeatCount() + '');
        } else {
            this.scene.start('Game');
        }
    }
}
