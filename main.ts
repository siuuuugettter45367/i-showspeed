enum SpriteKindCustom {
    Fireball,
    Meme,
    Powerup,
    CollectedMeme
}

let collectedMemes: number[] = []

// Spieler-Sprite
let speed = sprites.create(img`
    . . f f f f . . 
    . f f f f f f . 
    f f f f f f f f 
    f f e e e e f f 
    f e e d d e e f 
    f e d d d d e f 
    f f d d d d f f 
    . f f f f f f . 
`, SpriteKind.Player)

speed.setFlag(SpriteFlag.StayInScreen, true)
controller.moveSprite(speed, 100, 0)
speed.y = 100

info.setScore(0)
info.setLife(3)
scene.setBackgroundColor(9)

let rageActive = false

// Feuerbälle
game.onUpdateInterval(700, function () {
    let fireball = sprites.create(img`
        . . 2 2 2 2 . . 
        . 2 4 5 5 4 2 . 
        2 4 5 5 5 5 4 2 
        2 5 5 5 5 5 5 2 
        2 5 5 5 5 5 5 2 
        2 4 5 5 5 5 4 2 
        . 2 4 5 5 4 2 . 
        . . 2 2 2 2 . . 
    `, SpriteKindCustom.Fireball)
    fireball.setVelocity(-70 - info.score(), 0)
    fireball.left = 160
    fireball.y = randint(10, 110)
})

// Meme einsammeln
game.onUpdateInterval(2500, function () {
    let meme = sprites.create(img`
        . . . . . . . .
        . . 9 9 9 9 . .
        . 9 1 1 1 1 9 .
        9 1 0 1 0 1 1 9
        9 1 1 1 1 1 1 9
        . 9 1 1 1 1 9 .
        . . 9 9 9 9 . .
        . . . . . . . .
    `, SpriteKindCustom.Meme)
    meme.setVelocity(-50, 0)
    meme.left = 160
    meme.y = randint(20, 100)
})

// Power-Up mit Rage-Modus
game.onUpdateInterval(8000, function () {
    let powerup = sprites.create(img`
        . . 5 5 . .
        . 5 f f 5 .
        5 f 5 5 f 5
        5 f 5 5 f 5
        . 5 f f 5 .
        . . 5 5 . .
    `, SpriteKindCustom.Powerup)
    powerup.setVelocity(-60, 0)
    powerup.left = 160
    powerup.y = randint(10, 110)
})

// Kollisionsbehandlung
sprites.onOverlap(SpriteKind.Player, SpriteKindCustom.Fireball, function (player, fireball) {
    fireball.destroy()
    info.changeLifeBy(-1)
    music.zapped.play()
})

sprites.onOverlap(SpriteKind.Player, SpriteKindCustom.Meme, function (player, meme) {
    meme.destroy()
    info.changeScoreBy(5)
    music.baDing.play()
    collectedMemes.push(1)
})

sprites.onOverlap(SpriteKind.Player, SpriteKindCustom.Powerup, function (player, power) {
    power.destroy()
    speed.startEffect(effects.trail, 3000)
    rageActive = true
    controller.moveSprite(speed, 150, 0)

    // nach 3 Sekunden zurücksetzen
    game.onUpdateInterval(3000, function () {
        if (rageActive) {
            controller.moveSprite(speed, 100, 0)
            rageActive = false
        }
    })

    music.powerUp.play()
})

// Score automatisch erhöhen
game.onUpdateInterval(500, function () {
    info.changeScoreBy(1)
})

// Meme-Menü mit Taste A
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    game.splash("Gesammelte Memes:", "Du hast " + collectedMemes.length + " Memes!")
})

// Soundboard-Tipp mit Taste B
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    game.showLongText("Tipp: Spiele über dein Handy ein IShowSpeed-Soundboard ab! z.B. 'SUIIIII', 'Ronaldo!', 'CALM DOWN!'", DialogLayout.Bottom)
})

// Spielstart
game.splash("🔥 IShowSpeed: Rage Run! 🔥", "Sammle Memes & überlebe die Feuerbälle!")

// Game Over
info.onLifeZero(function () {
    music.wawawawaa.play()
    game.over(false, effects.melt)
})

