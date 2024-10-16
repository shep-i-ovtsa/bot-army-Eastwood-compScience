finch.startFinch()
let Rid = 0
radio.setGroup(0)
let phase = "id"
let spacing = 15
let speed = 50
// trust i have no idea how to use classes i watched a few tutorials and now im praying i understood
function space() {
    if (finch.getDistance() < spacing) {
        finch.setMove(MoveDir.Forward, finch.getDistance() - spacing, speed)
    } else {
        finch.setMove(MoveDir.Backward, spacing - finch.getDistance(), speed)
    }
    
}

function formation() {
    //  organize goes first
    if (Rid == 0) {
        return
    }
    
    if (Rid % 2 == 0) {
        control.waitMicros(2000000)
        finch.setMove(MoveDir.Forward, spacing, speed)
        finch.setTurn(RLDir.Right, 90, speed)
        finch.setMove(MoveDir.Forward, spacing, speed)
        finch.setTurn(RLDir.Left, 90, speed)
    } else {
        finch.setTurn(RLDir.Left, 90, speed)
        finch.setMove(MoveDir.Forward, spacing, speed)
        finch.setTurn(RLDir.Right, 90, speed)
    }
    
}

function attack() {
    
    basic.showLeds(`
    # . . . #
    . # . # .
    . # . # .
    . . # . .
    . # . # .
    `)
    if (Rid == 0) {
        
    } else {
        finch.setMove(MoveDir.Forward, spacing, speed)
        //  circle an object when the formation reaches a desired distance
        if (Rid % 2 == 0) {
            finch.setTurn(RLDir.Left, 45, speed)
            space()
        } else {
            finch.setTurn(RLDir.Right, 45, speed)
            space()
        }
        
    }
    
    finch.setBeak(100, 0, 0)
    while (phase == "attack") {
        treble.stop()
        bass.stop()
        music.stopAllSounds()
        music.play(music.tonePlayable(Note.G4, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        if (input.buttonIsPressed(Button.B)) {
            finch.setBeak(0, 100, 0)
            music.stopAllSounds()
            if (Rid % 2 == 0) {
                finch.setTurn(RLDir.Right, 45, speed)
            } else {
                finch.setTurn(RLDir.Left, 45, speed)
            }
            
            if (Rid != 0) {
                finch.setMove(MoveDir.Backward, spacing * 2, speed)
            }
            
            return
        }
        
        finch.setMove(MoveDir.Forward, spacing * .90, speed)
        music.play(music.tonePlayable(Note.C3, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(Note.G4, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(Note.C3, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(Note.G4, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        control.waitMicros(100000)
        music.play(music.tonePlayable(Note.G4, music.beat(BeatFraction.Eighth)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(Note.G4, music.beat(BeatFraction.Eighth)), music.PlaybackMode.UntilDone)
        space()
        control.waitMicros(100000)
    }
}

function invert() {
    finch.setTurn(RLDir.Right, 180, speed)
    if (Rid == 0) {
        finch.setMove(MoveDir.Forward, spacing + 16, speed)
    }
    
}

function march() {
    
    finch.setBeak(0, 100, 0)
    for (let l = 0; l < 5; l++) {
        for (let i = 0; i < 15; i++) {
            //  Check if the phase has changed during the march
            if (input.buttonIsPressed(Button.B)) {
                treble.stop()
                bass.stop()
                phase = "hold"
                radio.sendString(phase)
                return
            }
            
            //  Exit march
            if (Rid == 0 && finch.getDistance() < 20 && finch.getDistance() > 5) {
                radio.sendString("attack")
                attack()
            } else {
                finch.setMove(MoveDir.Forward, 10, speed)
            }
            
        }
        invert()
    }
}

class Speaker {
    notes: any[]
    is_playing: boolean
    filternote: number[]
    constructor(notes: any[]) {
        // oh wow i wrote this...damn guess the youtube tutorials payed off, wish i remembered to take notes
        this.notes = notes
        this.is_playing = false
        this.filternote = []
        for (let i of this.notes) {
            if (i >= 100) {
                this.filternote.push(i)
            }
            
        }
    }
    
    public play_notes(delay: number) {
        this.is_playing = true
        for (let note of this.filternote) {
            if (phase == "attack") {
                //  Check for stop
                this.stop()
                return
            }
            
            music.ringTone(note * 1.5)
            control.waitMicros(delay * 1000)
        }
        this.stop()
    }
    
    public stop() {
        music.stopAllSounds()
        this.is_playing = false
    }
    
}

phase = "id"
let Music = [0]
// left frequencies go here
let Music2 = [0]
// right frequencies go here
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (phase == "id") {
        Rid += 1
        basic.showNumber(Rid)
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    if (Rid == 0) {
        if (phase == "id") {
            phase = "space"
        } else if (phase == "space") {
            phase = "formation"
        } else if (phase == "formation") {
            phase = "march"
        }
        
        radio.sendString(phase)
        basic.showString(phase)
        if (phase == "march") {
            march()
        }
        
    }
    
})
radio.onReceivedString(function on_received_string(receivedString: string) {
    
    phase = receivedString
    basic.showString(phase)
    if (phase == "space") {
        space()
    } else if (phase == "formation") {
        formation()
    } else if (phase == "march") {
        march()
    } else if (phase == "attack") {
        attack()
    } else if (phase == "hold") {
        basic.clearScreen()
    }
    
})
let treble = new Speaker(Music)
let bass = new Speaker(Music2)
control.inBackground(function background() {
    if (phase == "march") {
        if (Rid == 1) {
            treble.play_notes(250)
        } else if (Rid == 2) {
            bass.play_notes(250)
        }
        
    }
    
})
