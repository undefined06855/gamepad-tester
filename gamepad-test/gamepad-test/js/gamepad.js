var detected = [
    false,
    false,
    false,
    false
];

var msgs = 0;
var id = 0;

const gamepad = { //Define gamepad-related functions

    newmsg: function(msg, col) {
        //Handle adding a message
        if(!client.isUsingMobile(400)) {
            //Not using mobile
            if(msgs >= 5) {
                document.getElementById("out").innerHTML = ""
                msgs = 0
            }
        } else {
            //Is using mobile
            document.getElementById("out").innerHTML = ""
            msgs = 0
        }
        msgs++;
        msgn = document.createElement("div");
        msgn.id = "message".concat(msgs.toString());
        msgn.innerHTML = msg
        msgn.style.backgroundColor = col;
        msgn.style.borderRadius = "5px";
        msgn.style.padding = "2px";
        document.getElementById("out").appendChild(msgn);
        console.log("New message added:\n".concat(msg))
    },
    
    check: function(cid) {
        //Runs before anything is done to the controller
        if(detected[cid]) {
            return true;
        } else {
            gamepad.newmsg("Controller not detected!", "#ff8000")
            return false;
        }
    },

    check2: function(cid) {
        //Checks if controller is connected without message
        return detected[cid];
    },

    startloop: function() {
        if(gamepad.check(id)) {
            gamepad.loop()
        }
    },

    loop: function() {
        //Auto refresh stuff
        if(gamepad.check2(id)) {
            f = document.getElementById("updatetiming").value;
            document.getElementById("autostarted").innerText = "Auto refresh started at ".concat(f.toString(), "ms")
            setTimeout(function() {
                gamepad.update.buttons();
                gamepad.loop();
            }, f);
        }
    },
    start: function() {
        //Adds event listeners
        addEventListener("gamepadconnected", function(e) {
            gamepad.newmsg("Controller ".concat(e.gamepad.index.toString(), " connected!"), "#0f0")
            detected[e.gamepad.index] = true;
        });
        addEventListener("gamepaddisconnected", function(e) {
            gamepad.newmsg("Controller ".concat(e.gamepad.index.toString(), " disconnected!"), "#f00")
            detected[e.gamepad.index] = false;
        })
    },

    return: function() {
        //Returns a list of 4 gamepads
        return navigator.getGamepads();
    },

    rumble: function() {
        //Rumble
        gamepad.check(id);

        d = Number(document.getElementById("length").value);
        s1 = Number(document.getElementById("s1").value);
        s2 = Number(document.getElementById("s2").value);
        gamepad.return()[id].vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration: d,
            weakMagnitude: s1,
            strongMagnitude: s2
        });
    },

    update: {
        id: function() {
            //Update id variable
            id = Number(document.getElementById("gpid").value);
        },

        buttons: function() {
            gamepad.check(id)
            //Get amount of controller buttons
            buttonlen = gamepad.return()[id]["buttons"].length
            document.getElementById("buttons").innerHTML = "";
            for(var i = 0; i < buttonlen; i++) {
                var button = document.createElement("div");
                button.id = "button_".concat(i.toString());
                document.getElementById("buttons").appendChild(button)
                document.getElementById("button_".concat(i.toString())).innerHTML = "".concat("Button ", i, ": ", gamepad.return()[id]["buttons"][i]["value"])
            }
            document.getElementById("info").innerHTML = "".concat(
                "Controller name: ", gamepad.return()[id]["id"],
                "<br/>connected: ", gamepad.return()[id]["connected"],
                "<br/>index: ", gamepad.return()[id]["index"],
                "<br/>mapping: ", gamepad.return()[id]["mapping"],
                "<br/>timestamp: ", gamepad.return()[id]["timestamp"],
            );
            document.getElementById("axes").innerHTML = "axes: ".concat(JSON.stringify(gamepad.return()[id]["axes"]).replace(/\,/g, ",<br/>   ").replace(/\]/g, "<br/>]").replace(/\[/g, "[<br/>"))
        },
        load: function() {
            //This runs when the update buttons is pressed
            console.log("gamepad.update.load()");
            gamepad.update.buttons();
        }
    }
};

//Handle wether client is using a mobile device
const client = {isUsingMobile:(threshold)=>threshold>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth,document.body.offsetWidth,document.documentElement.offsetWidth,document.documentElement.clientWidth)}