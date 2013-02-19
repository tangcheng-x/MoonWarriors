//bomb
var Bomb = cc.Sprite.extend({
    active:true,
    xVelocity:0,
    yVelocity:150,
    power:5,
    HP:5,
    moveType:null,
    zOrder:4000,
    attackMode:MW.ENEMY_MOVE_TYPE.NORMAL,
    parentType:MW.BULLET_TYPE.PLAYER,
    ctor:function (bombSpeed, weaponType, attackMode) {
        // needed for JS-Bindings compatibility
        cc.associateWithNative( this, cc.Sprite );

        this.yVelocity = -bombSpeed;
        this.attackMode = attackMode;
        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_bullet_plist);
        this.initWithSpriteFrameName(weaponType);
        this.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    },
    update:function (dt) {
        var p = this.getPosition();
        p.x -= this.xVelocity * dt;
        p.y -= this.yVelocity * dt;
        this.setPosition( p );
        if (this.HP <= 0) {
            this.active = false;
        }
    },
    destroy:function () {
        var explode = cc.Sprite.create(s_hit);
        explode.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
        explode.setPosition(this.getPosition());
        explode.setRotation(Math.random()*360);
        explode.setScale(0.75);
        this.getParent().addChild(explode,9999);
        cc.ArrayRemoveObject(MW.CONTAINER.ENEMY_BULLETS,this);
        cc.ArrayRemoveObject(MW.CONTAINER.PLAYER_BULLETS,this);
        this.removeFromParentAndCleanup(true);
        var removeExplode = cc.CallFunc.create(explode,explode.removeFromParentAndCleanup);
        explode.runAction(cc.ScaleBy.create(0.3, 2,2));
        explode.runAction(cc.Sequence.create(cc.FadeOut.create(0.3), removeExplode));
    },
    hurt:function () {
        this.HP--;
    },
    collideRect:function(){
        var p = this.getPosition();
        return cc.rect(p.x - 3, p.y - 3, 6, 6);
    }
});
