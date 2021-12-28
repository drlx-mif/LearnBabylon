import { Base, Sprite } from "./base";

export class RainAndSnow extends Base {

    /** 风力 */
    public windPower: BABYLON.Vector3 = new BABYLON.Vector3();
    /** 重力 */
    public gravity: BABYLON.Vector3 = new BABYLON.Vector3(0, -9.81, 0);
    /** 空气阻力比例系数 */
    public airDragK: number = 0.2;
    /** 质量(单位 kg) */
    public mass: number = 0.01; // 若需改变下落速度，最好不要改变阻力系数，而是调节质量大小

    /** 地面精灵数量 */
    private _groundSpriteCount: number = 0;

    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 初始化
     */
    protected _init(): void {

        super._init();

        const { engine, scene } = this;

        const snowManager: BABYLON.SpriteManager = new BABYLON.SpriteManager("SpriteManager", "./textures/snow.png", 10000, { width: 8, height: 8 }, scene);

        for (let i = 0; i < 10000; i++)
            this._addSprite(snowManager, Math.floor(new Date().getTime() + i / 10));

        const length = this.sprites.length;

        engine.runRenderLoop((): void => {

            if (this._groundSpriteCount < length) {

                const time: number = new Date().getTime(),
                    deltaTime = 10;

                if (time - this._currentTime > deltaTime) {

                    for (let i = 0; i < length; i++) {

                        const sprite: Sprite = this.sprites[i],
                            position: BABYLON.Vector3 = sprite.content.position,
                            size: number = sprite.content.size,
                            totalTime: number = (time - sprite.time) / 1000;

                        if (position.y > size / 2) {

                            if (totalTime > 0) {

                                const acceleration = this.gravity.y - this.airDragK * sprite.velocity / this.mass;
                                if (acceleration < 0) sprite.velocity = acceleration * totalTime;

                                position.y += sprite.velocity * deltaTime / 1000;
                                sprite.content.angle += 0.05 * Math.random();

                            }

                        } else {

                            position.y = size / 2;

                            if (!sprite.isStop) {

                                sprite.isStop = true;

                                this._groundSpriteCount += 1;

                            }

                        }

                    }

                }

            }

            scene.render();

        });

    }

    /**
     * 添加精灵
     * @param spriteManager 精灵管理器
     */
    private _addSprite(spriteManager: BABYLON.SpriteManager, time: number = new Date().getTime()): void {

        const sprite = new BABYLON.Sprite("sprite", spriteManager),
            groundX = this.ground._boundingInfo.boundingBox.extendSize.x * 2,
            groundY = this.ground._boundingInfo.boundingBox.extendSize.x * 2;

        sprite.cellIndex = 0;
        sprite.position.x = Math.random() * groundX - groundX / 2;
        sprite.position.y = 100;
        sprite.position.z = Math.random() * groundY - groundY / 2;
        sprite.size = 0.1;

        this.sprites.push({
            content: sprite,
            direction: new BABYLON.Vector3(),
            time: time,
            velocity: 0,
            isStop: false
        });

    }

}