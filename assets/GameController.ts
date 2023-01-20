import { find, log, Node } from "cc"
import { Player } from "./Player"
import { RolePanel } from "./RolePanel"
import taskController from "./Task"

class RoleMap {
    soidaudan: Player = null
    phuthuy: Player = null
    thosan: Player = null
    tientri: Player = null
    baove: Player = null
    sayruou: Player = null
    soi: Player[] = null
    danlang: Player[] = null
}

class SessionTarget {
    soi: Player = null
    baove: Player = null
    tientri: Player = null
    phuthuy: Player = null
    thosan: Player = null
}

class GameController {
    roleMap = new RoleMap
    sessionTarget = new SessionTarget
    // picker: Player = null
    taskDone = false
    heal_potion = true
    poison = true

    ROLES = []

    players = new Map<string, Player>

    onRolePick(node: Node) {
        let id = this.ROLES.indexOf(node.name)

        if (id < 0) {
            id = this.ROLES.indexOf('danlang')
            if (id < 0) return true
            this.ROLES[id] = node.name
        } else {
            this.ROLES[id] = 'danlang'
            return true
        }
    }

    doPick(player: Player) { }

    check() {
        let soi = 0
        let danlang = 0

        for (let i of this.players.values()) {
            if (i.isDead) continue

            if (i.role && i.role.includes('soi')) soi++
            else danlang++
        }

        log('check', soi, danlang)
        return soi <= 0 ? 1 : (soi < danlang ? 0 : -1)
    }

    async doSelectPlayer(node: Node) {
        uiController.hideAllAndShow(node)

        await taskController.check(() => this.players.size > 5)

        this.taskDone = false
        uiController.nextButton.active = true

        await taskController.check(() => this.taskDone)
    }

    async doSelectRole(node: Node) {
        uiController.hideAllAndShow(node)

        let soi = Math.round((this.players.size - 1) / 3)
        let danlang = this.players.size - soi
        let roles = []
        // await taskController.check(() => this.players.size > 5)

        while (soi-- > 0) roles.push('soi')
        while (danlang-- > 0) roles.push('danlang')

        this.ROLES = roles
        log(roles)

        this.taskDone = false
        uiController.nextButton.active = true

        await taskController.check(() => this.taskDone)
    }

    async callSoiDauDan(panel: RolePanel) {
        uiController.hideAllAndShow(panel.node)

        if (!this.roleMap.soidaudan) {
            this.roleMap.soidaudan = await panel.inputSource()[0]
            log('soi dau dan', this.roleMap.soidaudan.node.name)
        }
    }

    async callSayRuou(panel: RolePanel) {
        uiController.hideAllAndShow(panel.node)

        if (!this.roleMap.sayruou) {
            this.roleMap.sayruou = await panel.inputSource(panel.node.name)[0]
            log('say ruou', this.roleMap.sayruou.node.name)
            return
        }
    }

    async callBaoVe(panel: RolePanel) {
        uiController.hideAllAndShow(panel.node)

        if (!this.roleMap.baove) {
            this.roleMap.baove = (await panel.inputSource(panel.node.name))[0]
            log('bao ve', this.roleMap.baove.node.name)
            return
        }

        this.sessionTarget.baove = (await panel.inputTarget())[0]

        let name = this.sessionTarget.baove.node.name
        if (name != uiController.defaultName) log('bao ve chon', name)
        else log('bao ve khong chon ai')
    }

    async callTientri(panel: RolePanel) {
        uiController.hideAllAndShow(panel.node)

        if (!this.roleMap.tientri) {
            this.roleMap.tientri = (await panel.inputSource(panel.node.name))[0]
            log('tien tri', this.roleMap.tientri.node.name)
            return
        }

        this.sessionTarget.tientri = (await panel.inputTarget())[0]

        let name = this.sessionTarget.tientri.node.name
        let role = this.players.get(name).role
        if (name != uiController.defaultName) log('tien tri soi', name, role == 'soi' ? 'la soi' : 'khong phai soi')
        else log('tien tri khong soi ai')
    }

    async callThoSan(panel: RolePanel) {
        uiController.hideAllAndShow(panel.node)

        if (!this.roleMap.thosan) {
            this.roleMap.thosan = (await panel.inputSource(panel.node.name))[0]
            log('tho san', this.roleMap.thosan.node.name)
            return
        }

        this.sessionTarget.thosan = (await panel.inputTarget())[0]

        let name = this.sessionTarget.thosan.node.name
        if (name != uiController.defaultName) log('tho san ghim', name)
        else log('tho san khong ghim ai')
    }

    async callSoi(panel: RolePanel) {
        uiController.hideAllAndShow(panel.node)

        if (!this.roleMap.soi) {
            let count = 0
            for (let i of this.ROLES) if (i.includes('soi')) count++
            for (let i of panel.sources) i.node.active = count-- > 0

            let sources = await panel.inputSource(panel.node.name)
            this.roleMap.soi = sources.filter(s => s.node.active)

            let str = ''
            for (let i of this.roleMap.soi) str += i.node.name + ' '
            log('soi', str)
            return
        }

        this.sessionTarget.soi = (await panel.inputTarget())[0]

        let name = this.sessionTarget.soi.node.name
        if (name != uiController.defaultName) log('soi can', name)
        else log('soi khong can ai')
    }

    async callPhuThuy(panel: RolePanel) {
        uiController.hideAllAndShow(panel.node)

        if (!this.roleMap.phuthuy) {
            this.roleMap.phuthuy = (await panel.inputSource(panel.node.name))[0]
            log('phu thuy', this.roleMap.phuthuy.node.name)
            return
        }

        let victim = panel.targets[1]
        if (this.heal_potion) {
            victim.copy(this.sessionTarget.soi)
            victim.switch(false)
        } else victim.reset()

        let target = (await panel.inputTarget())[0]

        if (victim.node.name != uiController.defaultName && !victim.isDead) {
            log('phu thuy cuu', victim.node.name)
            this.sessionTarget.soi.reset()
            this.heal_potion = false
        } else log('phu thuy khong cuu ai')

        if (this.poison) {
            this.sessionTarget.phuthuy = target

            let name = this.sessionTarget.phuthuy.node.name
            if (name != uiController.defaultName) log('phu thuy giet', name)
            else log('phu thuy khong giet ai')
        }
    }

    async callDanlang(panel: RolePanel) {
        uiController.hideAllAndShow(panel.node)

        if (!this.roleMap.danlang) {
            let count = 0
            for (let i of this.ROLES) if (i == 'danlang') count++
            for (let i of panel.sources) i.node.active = count-- > 0

            let sources = await panel.inputSource(panel.node.name)
            this.roleMap.danlang = sources.filter(s => s.node.active)

            let str = ''
            for (let i of this.roleMap.danlang) str += i.node.name + ' '
            log('dan lang', str)
            return
        }

        // proccess the night
        this.kill(this.sessionTarget.soi)
        this.kill(this.sessionTarget.phuthuy)
        this.roleMap.thosan?.isDead && this.kill(this.sessionTarget.thosan)

        this.sessionTarget.baove?.reset()
        this.sessionTarget.tientri?.reset()

        //Notify
        await taskController.delay(2)
        log('a night passed')

        // proccess the day
        let target = (await panel.inputTarget())[0]

        let name = target.node.name
        if (name != uiController.defaultName) log('dan lang treo co', name)
        else log('dan lang khong treo co ai')

        this.kill(target)

        //Notify
        await taskController.delay(2)
        log('the night is coming')
    }

    kill(player: Player) {
        if (player && player.node.name != uiController.defaultName) {
            this.players.get(player.node.name).kill()
            log(player.node.name, 'da chet')
            player.reset()
        }
    }

    chiabai() {
        for (let i of this.players) {

        }
    }
}

const gameController = new GameController
export default gameController

