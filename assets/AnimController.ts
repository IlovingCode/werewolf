import { _decorator, Component, Node, tween, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

class AnimController {
    private panelOn: Tween<Node> = null
    private panelOff: Tween<Node> = null

    init() {
        this.panelOn = tween(uiController.node)
            .set({ scale: Vec3.ZERO })
            .to(.2, { scale: new Vec3(1.1, 1.1, 1.1) })
            .to(.1, { scale: Vec3.ONE })

        this.panelOff = tween(uiController.node)
            .set({ scale: Vec3.ONE })
            .to(.2, { scale: new Vec3(1.1, 1.1, 1.1) })
            .to(.1, { scale: Vec3.ZERO })
    }

    show(node: Node) {
        node.active = true
        return this.panelOn.clone(node.children[1]).start()
    }

    hide(node: Node) {
        return this.panelOff.clone(node.children[1]).start()
    }
}

let animController = new AnimController
export default animController

