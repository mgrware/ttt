import { Application } from "@hotwired/stimulus"
import RoomController from "./room_controller"

const application = Application.start()
// Configure Stimulus development experience
application.debug = true
window.Stimulus   = application
// Creates & launches a Stimulus application instance
// Registers controller in Stimulus application instance
Stimulus.register("room", RoomController)

export { application }
