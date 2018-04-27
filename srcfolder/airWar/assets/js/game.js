// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0,
        height: 0,
        //生成敌人的时间 0.5秒
        enemyDuration: 0.5,
        enemyPrefab: {
            default: null,
            type: cc.Prefab
        },
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    //生成一个敌人的位置
    newPosition: function () {
        return cc.p(Math.random() * 500, Math.random() * 800);
    },

    //生成敌人
    produceEnemy() {
        var enemy = this.enemyPool.get();
        cc.director.getScene().addChild(enemy);
        enemy.setPosition(this.newPosition());
        this.enemyArr.push(enemy);
    },
    //销毁敌人
    destroyEnemy(){
        this.enemyPool.put(this.enemyArr.shift());
    },

    onLoad() {
        //加载两个背景图片
        this.bgUp = this.node.getChildByName("bg_up");
        this.bgDown = this.node.getChildByName("bg_down");
        //开启碰撞系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //生成对象池，用来装敌人
        this.enemyPool = new cc.NodePool();
        let initCount = 20;
        for (let i = 0; i < initCount; ++i) {
            let enemy = cc.instantiate(this.enemyPrefab); // 创建节点
            this.enemyPool.put(enemy); // 通过 putInPool 接口放入对象池
        }
        //存储屏幕上的敌人
        this.enemyArr=[];
        this.schedule(this.produceEnemy, this.enemyDuration);
        var _this = this;
        _this.scheduleOnce(function () {
            _this.schedule(this.destroyEnemy, this.enemyDuration);
        },4);

    },

    start() {

    },
    //循环两张背景图片，营造出前进的效果
    loopBackground: function () {
        var bgUp = this.bgUp;
        var bgDown = this.bgDown;
        var speed = this.speed;
        var height = this.height;
        //判断边界情况
        if (bgUp.y - speed < 0) {
            bgUp.y += height;
            bgDown.y += height;
        }
        bgUp.y -= speed;
        bgDown.y -= speed;
    },
    update(dt) {
        this.loopBackground();

    },
});
