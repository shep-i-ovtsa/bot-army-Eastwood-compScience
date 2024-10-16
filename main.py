finch.start_finch()
Rid = 0
radio.set_group(0)
phase = "id"
spacing = 15
speed = 50
#trust i have no idea how to use classes i watched a few tutorials and now im praying i understood
def space():
    if finch.get_distance() <spacing:
        finch.set_move(MoveDir.FORWARD,finch.get_distance() - spacing, speed)
    else:
        finch.set_move(MoveDir.BACKWARD,spacing - finch.get_distance(), speed)

def formation():
    # organize goes first
    if Rid == 0:
        return
    if Rid%2 ==0:
        control.wait_micros(2000000)
        finch.set_move(MoveDir.FORWARD, spacing, speed)
        finch.set_turn(RLDir.RIGHT, 90, speed)
        finch.set_move(MoveDir.FORWARD, spacing, speed)
        finch.set_turn(RLDir.LEFT, 90, speed)

    else:
        finch.set_turn(RLDir.LEFT, 90, speed)
        finch.set_move(MoveDir.FORWARD, spacing, speed)
        finch.set_turn(RLDir.RIGHT, 90, speed)



def attack():
    global phase
    basic.show_leds("""
    # . . . #
    . # . # .
    . # . # .
    . . # . .
    . # . # .
    """)
    if Rid == 0:
        pass
    else:
        finch.set_move(MoveDir.FORWARD, spacing, speed)# circle an object when the formation reaches a desired distance
        if Rid %2 == 0:
            finch.set_turn(RLDir.LEFT, 45, speed)
            space()
        else:
            finch.set_turn(RLDir.RIGHT, 45, speed)
            space()
    finch.set_beak(100, 0, 0)

    while phase == "attack":
        treble.stop()
        bass.stop()  
        music.stop_all_sounds()
        music.play(music.tone_playable(Note.G4, music.beat(BeatFraction.WHOLE)), music.PlaybackMode.UNTIL_DONE)
        if input.button_is_pressed(Button.B):
            finch.set_beak(0, 100, 0)
            music.stop_all_sounds()
            if Rid %2 == 0:
                finch.set_turn(RLDir.Right, 45, speed)
            else:
                finch.set_turn(RLDir.Left, 45, speed)
            if Rid != 0:
                finch.set_move(MoveDir.BACKWARD, spacing*2, speed)
            return
        finch.set_move(MoveDir.FORWARD, spacing*.90, speed)
        music.play(music.tone_playable(Note.C3, music.beat(BeatFraction.WHOLE)), music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(Note.G4, music.beat(BeatFraction.WHOLE)), music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(Note.C3, music.beat(BeatFraction.WHOLE)), music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(Note.G4, music.beat(BeatFraction.WHOLE)), music.PlaybackMode.UNTIL_DONE)
        control.wait_micros(100000)
        music.play(music.tone_playable(Note.G4, music.beat(BeatFraction.EIGHTH)), music.PlaybackMode.UNTIL_DONE)
        music.play(music.tone_playable(Note.G4, music.beat(BeatFraction.EIGHTH)), music.PlaybackMode.UNTIL_DONE)
        space()
        control.wait_micros(100000)




def invert():
    finch.set_turn(RLDir.RIGHT, 180, speed)
    if Rid == 0:
        finch.set_move(MoveDir.FORWARD, spacing+16, speed)


def march():
    global phase
    finch.set_beak(0, 100, 0)
    
    for l in range(5):
        for i in range(15):

            # Check if the phase has changed during the march
            if input.button_is_pressed(Button.B):
                treble.stop()
                bass.stop()
                phase = "hold"
                radio.send_string(phase)
                return  # Exit march
            if Rid == 0 and finch.get_distance() < 20 and finch.get_distance() > 5:
                radio.send_string("attack")
                attack()
            else:
                finch.set_move(MoveDir.FORWARD, 10, speed)
        invert()



class Speaker:
    def __init__(self, notes):#oh wow i wrote this...damn guess the youtube tutorials payed off, wish i remembered to take notes
        self.notes = notes
        self.is_playing = False
        self.filternote = []
        for i in self.notes:
            if i >= 100:
                self.filternote.append(i)

    def play_notes(self, delay):
        self.is_playing = True
        for note in self.filternote:
            if phase == "attack":  # Check for stop
                self.stop()
                return
            music.ring_tone(note*1.5)
            control.wait_micros(delay * 1000)
        self.stop()

    def stop(self):
        music.stop_all_sounds()
        self.is_playing = False
phase = "id"

Music = [0]#left frequencies go here
Music2 = [0]#right frequencies go here



def on_button_pressed_a():
    global Rid
    if phase == "id":
        Rid += 1
        basic.show_number(Rid)
    
input.on_button_pressed(Button.A, on_button_pressed_a)



def on_button_pressed_b():
    global phase
    if Rid == 0:
        if phase == "id":
            phase = "space"
        elif phase == "space":
            phase = "formation"
        elif phase == "formation":
            phase = "march"
        radio.send_string(phase)
        basic.show_string(phase)
        if phase == "march":
            march()
input.on_button_pressed(Button.B, on_button_pressed_b)

def on_received_string(receivedString):
    global phase
    phase = receivedString
    basic.show_string(phase)
    if phase == "space":
        space()
    elif phase == "formation":
        formation()
    elif phase == "march":
        march()
    elif phase == "attack":
        attack()
    elif phase == "hold":
        basic.clear_screen()
radio.on_received_string(on_received_string)
treble = Speaker(Music)
bass = Speaker(Music2)
def background():
    if phase == "march":
        
        if Rid == 1:
            treble.play_notes(250)
        elif Rid == 2:
            bass.play_notes(250)
control.in_background(background)