import { _decorator, Component, Node, resources, SpriteFrame, instantiate, Label, Sprite, log, EventTouch, find, Button } from 'cc';
import animController from './AnimController';
import gameController from './GameController';
import { Player } from './Player';
import taskController from './Task';
const { ccclass, property } = _decorator;

let users = [
    'player_0',
    'player_1',
    'player_2',
    'player_3',
    'player_4',
    'player_5',
    'player_6',
    'player_7',
]

let loadAvatar = async function (url: string): Promise<SpriteFrame> {
    return new Promise((resolve, reject) => {
        resources.load(url, SpriteFrame, (err, res) => {
            if (err) resolve(null)
            else resolve(res)
        })
    })
}

declare global {
    var uiController: UIController
}

@ccclass('UIController')
export class UIController extends Component {
    @property(Node) playerContainer: Node = null
    @property(Label) title: Label = null
    @property(Label) body: Label = null
    @property(Node) popup: Node = null
    @property(Node) selection: Node = null
    @property(Node) nextButton: Node = null

    screens: Node[] = null

    async initProfile(name: string, player: Player) {
        let spriteFrame = await loadAvatar(name + '/spriteFrame')
        player.set(name, spriteFrame)
        player.switch(false)
    }

    initPlayers() {
        let content = this.playerContainer

        let count = 0
        for (let i of users) {
            let p = content.children[count++]
            if (!p) {
                p = instantiate(content.children[0])
                content.addChild(p)
            }

            this.initProfile(i, p.getComponent(Player))
        }
    }

    async onPlayerSelect(player: Player) {
        if (gameController.picker) {
            gameController.picker.copy(player)

            animController.hide(this.selection)
            await taskController.delay(.5)

            this.selection.active = false
            this.nextButton.active = true
        } else {
            let players = gameController.players

            if (!players.has(player.node.name)) {
                player.switch(true)
                players.set(player.node.name, player)
            } else {
                player.switch(false)
                players.delete(player.node.name)
            }

            this.nextButton.active = players.size > 5
        }
    }

    filter(players: Map<string, Player>, role: string = null) {
        for (let i of this.playerContainer.children) {
            i.active = players.has(i.name) && (role == '' || players.get(i.name).role == role)
        }
    }

    async onTargetClick(target: Player) {
        gameController.picker = target

        animController.show(this.selection)
    }

    async onNext(ev: EventTouch) {
        let target = (ev.target as Node).getComponent(Button)
        target.node.active = false

        gameController.taskDone = true
        // await taskController.check(() => !this.taskDone)

        // target.node.active = true
    }

    async closePopup() {
        animController.hide(this.popup)

        await taskController.delay(.5)

        this.popup.active = false
    }

    // showPopup(content: Localization) {
    //     log(content)
    //     if (!content) {
    //         this.popup.active = false
    //         return
    //     }

    //     this.title.string = content.title
    //     this.body.string = content.body

    //     animController.show(this.popup)
    // }

    hideAllAndShow(node: Node) {
        for (let i of this.screens) i.active = false
        this.selection.active = false
        this.popup.active = false
        this.nextButton.active = false

        node && animController.show(node)
    }

    onLoad() { for (let i of this.node.children) i.active = true }

    async start() {
        window.uiController = this

        animController.init()
        this.initPlayers()

        let node = this.node
        let soidaudan = find('soidaudan', node)
        let soi = find('soi', node)
        let sayruou = find('sayruou', node)
        let tientri = find('tientri', node)
        let phuthuy = find('phuthuy', node)
        let thosan = find('thosan', node)
        let baove = find('baove', node)
        let danlang = find('danlang', node)

        this.screens = [soidaudan, soi, sayruou, tientri, phuthuy, thosan, baove, danlang]

        this.hideAllAndShow(null)

        //delay for engine init
        await taskController.delay(.5)
        // while(true) 
        {
            await gameController.doSelectPlayer(this.selection)
            await taskController.delay(.5)

            await gameController.doSoiDauDan(soidaudan)
            await gameController.doSayRuou(sayruou)
            await gameController.doBaoVe(baove)

            // await taskController.check(() => this.taskDone)

            // this.taskDone = false
            // this.hideAllAndShow(soi)

            // await taskController.check(() => this.taskDone)

            // this.taskDone = false
            // this.hideAllAndShow(tientri)

            // await taskController.check(() => this.taskDone)

            // this.taskDone = false
            // this.hideAllAndShow(phuthuy)

            // await taskController.check(() => this.taskDone)

            // this.taskDone = false
            // this.hideAllAndShow(thosan)

            // await taskController.check(() => this.taskDone)
        }
    }

    update(deltaTime) {
        taskController.update()
    }
}