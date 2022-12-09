import { _decorator, Component, Node, resources, SpriteFrame, instantiate, Label, Sprite, log, EventTouch, find } from 'cc';
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
            log(err)
            if (err) resolve(null)
            else resolve(res)
        })
    })
}

@ccclass('Game')
export class Game extends Component {
    @property(Node)
    playerContainer: Node = null

    players = new Map<string, Node>

    async initProfile(name: string, node: Node) {
        node.name = name

        node.getComponentInChildren(Label).string = name

        let sprite = node.getComponentInChildren(Sprite)
        sprite.spriteFrame = await loadAvatar(name + '/spriteFrame')
        sprite.grayscale = true
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

            this.initProfile(i, p)
        }
    }

    onPlayerSelect(ev: EventTouch) {
        let node = ev.target as Node
        let players = this.players

        if (!players.has(node.name)) {
            node.getComponentInChildren(Sprite).grayscale = false
            players.set(node.name, node)
        } else {
            node.getComponentInChildren(Sprite).grayscale = true
            players.set(node.name, null)
        }
    }

    onGameStart(ev: EventTouch) {
        (ev.target as Node).active = false

        for (let i of this.playerContainer.children) {
            if (!this.players.has(i.name)) i.active = false
        }
    }

    hideAllButThis(node: Node) {
        let children = this.node.children
        for (let i = 1; i < children.length; i++) {
            children[i].active = false
        }

        node.active = true
    }

    doSoiDauDan(node: Node) {
        let source = find('role/source', node)

        
    }

    async start() {
        this.initPlayers()

        let selectScreen = find('selectScreen', this.node)
        let soidaudan = find('soidaudan', this.node)
        let sayruou = find('sayruou', this.node)

        // while(true) 
        {
            this.hideAllButThis(soidaudan)
        }
    }

    // update(deltaTime: number) {

    // }
}

