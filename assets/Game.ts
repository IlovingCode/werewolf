import { _decorator, Component, Node, resources, SpriteFrame, instantiate, Label, Sprite, log, EventTouch } from 'cc';
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

    players: Node[] = []

    async initProfile(name: string, node: Node) {
        node.name = name

        node.getComponentInChildren(Label).string = name

        let sprite = node.getComponentInChildren(Sprite)
        sprite.spriteFrame = await loadAvatar(name + '/spriteFrame')
        sprite.grayscale = true
    }

    onPlayerSelect(ev: EventTouch) {
        let node = ev.target as Node
        let players = this.players
        let id = this.players.indexOf(node)

        if (id < 0) {
            node.getComponentInChildren(Sprite).grayscale = false
            players.push(node)
        } else {
            node.getComponentInChildren(Sprite).grayscale = true
            players[id] = players[players.length - 1]
            players.length--
        }
    }

    onGameStart(ev: EventTouch) {
        (ev.target as Node).active = false

        for(let i of this.playerContainer.children) {
            if(this.players.indexOf(i) < 0) i.active = false
        }
    }

    async start() {
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

    // update(deltaTime: number) {

    // }
}

