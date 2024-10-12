finch.start_finch()
Rid = 0
radio.set_group(0)
phase = "space"
finch.start_finch()
spacing = 10
speed = 50
#trust i have no idea how to use classes i watched a few tutorials and now im praying i understood
class Formation:
    def __init__(self, id):
        self.len = finch.get_distance()
        self.id = Rid

    def organize(self):
        if self.len < spacing:
            finch.set_move(MoveDir.FORWARD,self.len - spacing, speed)
        else:
            finch.set_move(MoveDir.BACKWARD,spacing - self.len, speed)

    def set_turn_and_move(self, turn_dir, move_distance):
        finch.set_turn(turn_dir, 90, speed)
        finch.set_move(MoveDir.FORWARD, move_distance, speed)

def formation(len,id):
    # organize goes first
    if id == 0:
        return
    if id%2 ==0:
        finch.set_move(MoveDir.FORWARD, spacing, speed)
        finch.set_turn(RLDir.RIGHT, 90, speed)
        finch.set_move(MoveDir.FORWARD, spacing, speed)
        finch.set_turn(RLDir.LEFT, 90, speed)

    else:
        finch.set_turn(RLDir.LEFT, 90, speed)
        finch.set_move(MoveDir.FORWARD, spacing, speed)
        finch.set_turn(RLDir.RIGHT, 90, speed)
        
    if (id%2 ==0 and id!= 1 and id!=2):
        finch.set_turn(RLDir.RIGHT, 90, speed)
        finch.set_move(MoveDir.FORWARD, spacing*((id-2)/2), speed)
        finch.set_turn(RLDir.LEFT, 90, speed)
    elif id%2 == 1 and id!= 1 or 2:
        finch.set_turn(RLDir.LEFT, 90, speed)
        finch.set_move(MoveDir.FORWARD, spacing*((id-1)/2), speed)
        finch.set_turn(RLDir.RIGHT, 90, speed)

    def attack(id):
        pass# circle an object when the formation reaches a desired distance
class MusicPlayer:
    def __init__(self, notes):
        self.notes = notes

    def play_notes(self, delay):
        for note in self.notes:
            music.ring_tone(note)
            control.wait_micros(delay * 1000)  # Play the frequency directly
        music.stop_all_sounds()
# Initialize music notes
Music = [64.99, 75.83, 89.83, 99.80]  # Your music notes
Music2 = [90.36, 79.96, 175.72, 56.37]  # Additional music notes

def on_button_pressed_a():
    global Rid
    if phase == "space":
        Rid += 1
        basic.show_number(Rid)

input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    basic.clear_screen()
    treble = MusicPlayer(Music)
    treble.play_notes(250)
    bass = MusicPlayer(Music2)
    bass.play_notes(250)

input.on_button_pressed(Button.B, on_button_pressed_b)