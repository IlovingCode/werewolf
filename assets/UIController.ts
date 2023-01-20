import { _decorator, Component, Node, resources, SpriteFrame, instantiate, Label, Sprite, log, EventTouch, find, Button, game } from 'cc';
import animController from './AnimController';
import gameController from './GameController';
import { Player } from './Player';
import { RolePanel } from './RolePanel';
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
    @property(Node) playerSelection: Node = null
    @property(Node) roleSelection: Node = null
    @property(Node) nextButton: Node = null
    @property(SpriteFrame) defaultAvatar: SpriteFrame = null

    defaultName = '???'
    screens: RolePanel[] = null
    picker: Player = null

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
        if (this.picker) {
            this.picker.copy(player)

            animController.hide(this.playerSelection)
            await taskController.delay(.5)

            this.playerSelection.active = false
            gameController.doPick(player)
        } else {
            let players = gameController.players

            if (!players.has(player.text.string)) {
                player.switch(true)
                players.set(player.text.string, player)
            } else {
                player.switch(false)
                players.delete(player.text.string)
            }
        }
    }

    onRoleSelect(ev: EventTouch) {
        let node = ev.target as Node

        node.getComponent(Sprite).grayscale = gameController.onRolePick(ev.target)
    }

    filter(players: Map<string, Player>, role: string = null) {
        for (let i of this.playerContainer.children) {
            i.active = players.has(i.name) && (role == '' || players.get(i.name).role == role)
        }
    }

    async onTargetClick(target: Player) {
        this.picker = target
        target.reset()

        animController.show(this.playerSelection)
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
        for (let i of this.screens) i.node.active = false
        this.playerSelection.active = false
        this.roleSelection.active = false
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
        let soidaudan = find('soidaudan', node).getComponent(RolePanel)
        let soi = find('soi', node).getComponent(RolePanel)
        let sayruou = find('sayruou', node).getComponent(RolePanel)
        let tientri = find('tientri', node).getComponent(RolePanel)
        let phuthuy = find('phuthuy', node).getComponent(RolePanel)
        let thosan = find('thosan', node).getComponent(RolePanel)
        let baove = find('baove', node).getComponent(RolePanel)
        let danlang = find('danlang', node).getComponent(RolePanel)

        this.screens = [soidaudan, soi, sayruou, tientri, phuthuy, thosan, baove, danlang]

        this.hideAllAndShow(null)

        //delay for engine init
        await taskController.delay(.5)
        await gameController.doSelectPlayer(this.playerSelection)
        await gameController.doSelectRole(this.roleSelection)

        let tasks = []
        log(gameController.ROLES)

        if (gameController.ROLES.indexOf('phuthuy') >= 0) {
            tasks.push(gameController.callPhuThuy.bind(gameController, phuthuy))
        }

        if (gameController.ROLES.indexOf('baove') >= 0) {
            tasks.push(gameController.callBaoVe.bind(gameController, baove))
        }

        if (gameController.ROLES.indexOf('tientri') >= 0) {
            tasks.push(gameController.callTientri.bind(gameController, tientri))
        }

        if (gameController.ROLES.indexOf('thosan') >= 0) {
            tasks.push(gameController.callThoSan.bind(gameController, thosan))
        }

        let check = 0
        while (check == 0) {
            await gameController.callSoi(soi)

            for (let i of tasks) await i()

            await gameController.callDanlang(danlang)

            this.filter(gameController.players, '')

            check = gameController.check()
        }

        log(check < 0 ? 'soi thang' : 'dan lang thang')
    }

    update(deltaTime) {
        taskController.update()
    }
}