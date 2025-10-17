namespace SpriteKind {
    export const effects = SpriteKind.create()
}
function player_update () {
    if (guy.y >= 100) {
        guy.y = 100
        guy.vy = 0
        if (controller.A.isPressed() || controller.up.isPressed()) {
            music.play(music.melodyPlayable(music.knock), music.PlaybackMode.InBackground)
            if (controller.down.isPressed()) {
                guy.vy = -230
            } else {
                guy.vy = -150
            }
        }
    } else if (guy.vy < 1000) {
        guy.vy += 9.8
        if (guy.vy < 0) {
            if (!(controller.A.isPressed()) && !(controller.up.isPressed())) {
                guy.vy = guy.vy / 2
            }
        }
    }
    if (controller.down.isPressed()) {
        guy.vy += 30
    }
    if (controller.dx() > 0) {
        guy.setImage(assets.image`player flip`)
        animation.runImageAnimation(
        guy,
        assets.animation`player anim flip`,
        83,
        false
        )
        guy.startEffect(effects.starField, 1)
    } else if (controller.dx() < 0) {
        guy.setImage(assets.image`player dont know`)
        animation.runImageAnimation(
        guy,
        assets.animation`player anim`,
        83,
        false
        )
        guy.startEffect(effects.starField, 1)
    } else {
        animation.stopAnimation(animation.AnimationTypes.All, guy)
    }
    guy.setBounceOnWall(true)
}
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    sprite.vx = -1 * sprite.vx
    sprite.setFlag(SpriteFlag.DestroyOnWall, true)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    sprites.destroy(otherSprite, effects.ashes, 1)
    info.changeScoreBy(1)
    music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground)
})
function gameover () {
    if (info.highScore() < info.score()) {
        game.setGameOverEffect(true, effects.confetti)
    } else {
        game.setGameOverEffect(true, effects.melt)
    }
    game.setGameOverPlayable(true, music.stringPlayable("F E D - - - - - ", 700), false)
    game.setGameOverMessage(true, "GAME OVER!")
    game.setGameOverScoringType(game.ScoringType.HighScore)
    game.gameOver(true)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (Math.abs(Math.max(otherSprite.y, sprite.y) - Math.min(otherSprite.y, sprite.y)) < 4) {
        if (Math.abs(Math.max(otherSprite.x, sprite.x) - Math.min(otherSprite.x, sprite.x)) < 9) {
            gameover()
        }
    }
})
let fire: Sprite = null
let fruit: Sprite = null
let time_last_frame = 0
let delta = 0
let guy: Sprite = null
let background_effects = sprites.create(assets.image`backgroud`, SpriteKind.effects)
background_effects.startEffect(effects.clouds)
background_effects.startEffect(effects.clouds)
scene.setBackgroundColor(13)
game.setDialogCursor(assets.image`menu button`)
game.setDialogFrame(assets.image`menu background`)
game.splash("Collect the fruits")
game.showLongText("jump and avoid the red bullets while eating the berries :)", DialogLayout.Full)
info.setScore(0)
let shadow = sprites.create(assets.image`shadow`, SpriteKind.effects)
shadow.y = 106
guy = sprites.create(assets.image`player`, SpriteKind.Player)
guy.setFlag(SpriteFlag.ShowPhysics, false)
controller.moveSprite(guy, 100, 0)
guy.setPosition(80, 100)
game.onUpdate(function () {
    player_update()
    shadow.x = guy.x
    delta = (game.runtime() - time_last_frame) / 1000
    time_last_frame = game.runtime()
    console.logValue("fps", 1 / delta)
})
game.onUpdateInterval(700, function () {
    fruit = sprites.create(assets.image`fruit`, SpriteKind.Food)
    fruit.setPosition(randint(25, 135), -8)
    fruit.setVelocity(0, 50)
    animation.runImageAnimation(
    fruit,
    assets.animation`fruit anim`,
    166,
    true
    )
    fruit.setFlag(SpriteFlag.AutoDestroy, true)
})
game.onUpdateInterval(1000, function () {
    fire = sprites.create(assets.image`fire`, SpriteKind.Enemy)
    if (randint(0, 1) == 0) {
        fire.setPosition(-8, randint(80, 100))
        fire.vx = 50
    } else {
        fire.setPosition(168, randint(80, 100))
        fire.vx = -50
        fire.image.flipX()
    }
})
