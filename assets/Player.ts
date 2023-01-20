import { _decorator, Component, Node, SpriteFrame, Label, Sprite, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(Sprite) sprite: Sprite = null
    @property(Label) text: Label = null

    onTargetClick() { this.enabled && uiController.onTargetClick(this) }

    onPlayerSelect() { this.enabled && uiController.onPlayerSelect(this) }

    onSwitch() { this.enabled && this.switch(this.isDead) }

    role: string = null

    set(name: string, spriteFrame: SpriteFrame, role: string = null) {
        this.node.name = name
        this.text.string = name
        this.sprite.spriteFrame = spriteFrame
        this.role = role
    }

    kill() {
        this.enabled = false
        this.switch(false)
    }

    switch(isOn: boolean) { this.sprite.grayscale = !isOn }

    get isDead() { return this.sprite.grayscale }

    reset() {
        this.sprite.spriteFrame = uiController.defaultAvatar
        this.text.string = uiController.defaultName
        this.node.name = uiController.defaultName
        this.role = null
    }

    copy(player: Player) {
        this.set(player.node.name, player.sprite.spriteFrame, player.role)
    }

    // update(deltaTime: number) {

    // }
}

