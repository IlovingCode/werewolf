import { find, Node } from "cc"
import { Player } from "./Player"
import taskController from "./Task"

class RoleMap {
    soidaudan: Player = null
    phuthuy: Player = null
    thosan: Player = null
    tientri: Player = null
    baove: Player = null
    sayruou: Player = null
    soi: Player[] = []
    danlang: Player[] = []
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
    picker: Player = null
    taskDone = false
    heal_potion = true
    poison = true

    ROLES = ['soi', 'soi', 'phuthuy', 'tientri', 'danlang']

    players = new Map<string, Player>

    async doSelectPlayer(node: Node) {
        this.taskDone = false
        uiController.hideAllAndShow(node)

        await taskController.check(() => this.taskDone)

        uiController.filter(this.players)
    }

    async doSoiDauDan(node: Node) {
        if (!this.roleMap.soidaudan) {
            this.taskDone = false
            uiController.hideAllAndShow(node)
            uiController.filter(this.players)

            await taskController.check(() => this.taskDone)

            this.roleMap.soidaudan = this.picker
            this.picker.enabled = false
        }
    }

    async doSayRuou(node: Node) {
        if (!this.roleMap.sayruou) {
            let children = node.children[1].children
            children[1].active = false

            this.taskDone = false
            uiController.hideAllAndShow(node)
            uiController.filter(this.players)

            await taskController.check(() => this.taskDone)

            this.roleMap.sayruou = this.picker
            this.picker.enabled = false
            this.players.get(this.picker.node.name).role = node.name

            children[1].active = true
        }
    }

    async doBaoVe(node: Node) {
        if (!this.roleMap.baove) {
            let children = node.children[1].children
            children[1].active = false

            this.taskDone = false
            uiController.hideAllAndShow(node)
            uiController.filter(this.players)

            await taskController.check(() => this.taskDone)

            this.roleMap.baove = this.picker
            this.picker.enabled = false
            this.players.get(this.picker.node.name).role = node.name

            children[1].active = true

            return
        }

        this.taskDone = false
        await taskController.check(() => this.taskDone)

        this.sessionTarget.baove = this.picker
    }

    async doTientri(node: Node) {
        if (!this.roleMap.tientri) {
            let children = node.children[1].children
            children[1].active = false

            this.taskDone = false
            uiController.hideAllAndShow(node)
            uiController.filter(this.players)

            await taskController.check(() => this.taskDone)

            this.roleMap.tientri = this.picker
            this.picker.enabled = false
            this.players.get(this.picker.node.name).role = node.name

            children[1].active = true

            return
        }

        this.taskDone = false
        await taskController.check(() => this.taskDone)

        this.sessionTarget.tientri = this.picker
    }

    async doThoSan(node: Node) {
        if (!this.roleMap.thosan) {
            let children = node.children[1].children
            children[1].active = false

            this.taskDone = false
            uiController.hideAllAndShow(node)
            uiController.filter(this.players)

            await taskController.check(() => this.taskDone)

            this.roleMap.thosan = this.picker
            this.picker.enabled = false
            this.players.get(this.picker.node.name).role = node.name

            children[1].active = true

            return
        }

        this.taskDone = false
        await taskController.check(() => this.taskDone)

        this.sessionTarget.thosan = this.picker
    }

    async doSoi(node: Node) {
        if (!this.roleMap.soi) {
            let children = node.children[1].children
            children[1].active = false

            for (let i of this.ROLES) {
                if (i == 'soi') {
                    this.taskDone = false
                    uiController.hideAllAndShow(node)
                    uiController.filter(this.players)

                    await taskController.check(() => this.taskDone)

                    this.roleMap.soi.push(this.picker)
                    this.picker.enabled = false
                    this.players.get(this.picker.node.name).role = node.name
                }
            }

            children[1].active = true

            return
        }

        this.taskDone = false
        await taskController.check(() => this.taskDone)

        this.sessionTarget.soi = this.picker
    }

    async doPhuThuy(node: Node) {
        let children = node.children[1].children
        //Phu Thuy must be called right after Soi
        children[1].getComponent(Player).copy(this.picker)
        children[2].active = false

        if (!this.roleMap.phuthuy) {
            children[1].active = false

            this.taskDone = false
            uiController.hideAllAndShow(node)
            uiController.filter(this.players)

            await taskController.check(() => this.taskDone)

            this.roleMap.phuthuy = this.picker
            this.picker.enabled = false
            this.players.get(this.picker.node.name).role = node.name

            children[1].active = true

            return
        }

        if (this.heal_potion) {
            this.taskDone = false
            await taskController.check(() => this.taskDone)

            this.sessionTarget.soi = null
            this.heal_potion = false
        }

        if (this.poison) {
            children[2].active = true
            this.taskDone = false
            await taskController.check(() => this.taskDone)

            this.sessionTarget.phuthuy = this.picker
            this.poison = false
        }
    }

    chiabai() {


        for (let i of this.players) {

        }
    }
}

let gameController = new GameController
export default gameController

