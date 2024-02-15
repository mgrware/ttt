// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `bin/rails generate channel` command.

import { createConsumer } from "@rails/actioncable"
const cableUrl  = "ws://localhost:3000/cable"

console.log(cableUrl)
export default createConsumer(cableUrl)
