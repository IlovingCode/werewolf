import { _decorator, Component, Node, SpriteFrame, Label, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(Sprite) sprite: Sprite = null
    @property(Label) text: Label = null

    onTargetClick() { this.enabled && uiController.onTargetClick(this) }

    onPlayerSelect() { this.enabled && uiController.onPlayerSelect(this) }

    role: string = null

    set(name: string, spriteFrame: SpriteFrame, role: string = null) {
        this.node.name = name
        this.text.string = name
        this.sprite.spriteFrame = spriteFrame
        this.role = role
    }

    switch(isOn: boolean) { this.sprite.grayscale = !isOn }

    copy(player: Player) {
        this.set(player.node.name, player.sprite.spriteFrame, player.role)
    }

    // update(deltaTime: number) {

    // }
}

