finch.startFinch()
let Rid = 0
radio.setGroup(0)
let phase = "space"
finch.startFinch()
let spacing = 10
let speed = 50
// trust i have no idea how to use classes i watched a few tutorials and now im praying i understood
class Formation {
    len: number
    id: number
    constructor(id: any) {
        this.len = finch.getDistance()
        this.id = Rid
    }
    
    public organize() {
        if (this.len < spacing) {
            finch.setMove(MoveDir.Forward, this.len - spacing, speed)
        } else {
            finch.setMove(MoveDir.Backward, spacing - this.len, speed)
        }
        
    }
    
    public set_turn_and_move(turn_dir: number, move_distance: number) {
        finch.setTurn(turn_dir, 90, speed)
        finch.setMove(MoveDir.Forward, move_distance, speed)
    }
    
}

function formation(len: any, id: number) {
    //  organize goes first
    if (id == 0) {
        return
    }
    
    if (id % 2 == 0) {
        finch.setMove(MoveDir.Forward, spacing, speed)
        finch.setTurn(RLDir.Right, 90, speed)
        finch.setMove(MoveDir.Forward, spacing, speed)
        finch.setTurn(RLDir.Left, 90, speed)
    } else {
        finch.setTurn(RLDir.Left, 90, speed)
        finch.setMove(MoveDir.Forward, spacing, speed)
        finch.setTurn(RLDir.Right, 90, speed)
    }
    
    if (id % 2 == 0 && id != 1 && id != 2) {
        finch.setTurn(RLDir.Right, 90, speed)
        finch.setMove(MoveDir.Forward, spacing * ((id - 2) / 2), speed)
        finch.setTurn(RLDir.Left, 90, speed)
    } else if (id % 2 == 1 && id != 1 || 2) {
        finch.setTurn(RLDir.Left, 90, speed)
        finch.setMove(MoveDir.Forward, spacing * ((id - 1) / 2), speed)
        finch.setTurn(RLDir.Right, 90, speed)
    }
    
    function attack(id: any) {
        
    }
    
}

//  circle an object when the formation reaches a desired distance
class MusicPlayer {
    notes: number[]
    constructor(notes: number[]) {
        this.notes = notes
    }
    
    public play_notes(delay: number) {
        for (let note of this.notes) {
            music.ringTone(note)
            control.waitMicros(delay * 1000)
        }
        //  Play the frequency directly
        music.stopAllSounds()
    }
    
}

//  Initialize music notes
let Music = [64.99, 75.83, 89.83, 99.80]
//  Your music notes
let Music2 = [90.36, 79.96, 175.72, 56.37]
//  Additional music notes
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (phase == "space") {
        Rid += 1
        basic.showNumber(Rid)
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    basic.clearScreen()
    let treble = new MusicPlayer(Music)
    treble.play_notes(250)
    let bass = new MusicPlayer(Music2)
    bass.play_notes(250)
})
