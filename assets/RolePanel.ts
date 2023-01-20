import { _decorator, Component, Node, log } from 'cc';
import gameController from './GameController';
import { Player } from './Player';
import taskController from './Task';
const { ccclass, property } = _decorator;

@ccclass('RolePanel')
export class RolePanel extends Component {
    @property(Player) sources: Player[] = []
    @property(Player) targets: Player[] = []
    node: Node = null

    async inputSource(role: string = null) {
        for (let i of this.targets) i.node.active = false

        gameController.taskDone = false
        uiController.filter(gameController.players)

        await taskController.check(() => {
            let flag = true
            for (let i of this.sources) flag &&= (!i.node.active || i.text.string != uiController.defaultName)

            return flag
        })

        uiController.nextButton.active = true

        await taskController.check(() => gameController.taskDone)

        for (let i of this.sources) {
            if (i.node.active) {
                i.enabled = false

                if (role) gameController.players.get(i.node.name).role = role
            }
        }

        for (let i of this.targets) {
            i.node.active = true
            i.reset()
        }

        return this.sources
    }

    async inputTarget() {
        gameController.taskDone = false
        uiController.nextButton.active = true

        await taskController.check(() => gameController.taskDone)

        return this.targets
    }
}

