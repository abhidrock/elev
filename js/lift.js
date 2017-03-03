var ElevatorController = (function() {
    /**
     * Constructor.  Takes an array of the names of the floors, from bottom
     * to top.
     */
    function ElevatorController(floors) {
      console.log("Constructor");
        this.floors = floors.map(function(fl) { return fl.toString(); });
        console.log(this.floors);
        this.travelTime = 1500;     // milliseconds from floor to floor
        this.currentIndex = 0;
        this.queue = [];
        this.callbacks = [];

        this.elevator = {
            motion: 0,              // -1 = Downward, 0 = Stopped; +1 = Upward
            currentFloor: this.floors[0]
        };
    }

    /**
     * Registers a function to be called when an event occurs.
     * Returns this object, for convenient chaining.
     *
     * The callback will be called with two parameters.  The first
     * parameter is the elevator state, which is an object with
     * attributes named "motion" (+1, 0, or -1) and "currentFloor".
     * The second parameter is a string describing the event type:
     * "up", "down", "arrived", or "floor".
     */
    ElevatorController.prototype.addCallback = function(callback) {
        console.log("CallBack call");
        this.callbacks.push(callback);
        return this;
    };

    ElevatorController.prototype.removeCallback = function(callback) {
      console.log("remove callback");
        for (var i = this.callbacks.length - 1; i >= 0; i--) {
            if (this.callbacks[i] === callback) {
                this.callbacks.splice(i, 1);
            }
        }
        return this;
    };

    /**
     * Informs callbacks of the current state by sending them a "floor"
     * event.
     */
      ElevatorController.prototype.refresh = function() {
        console.log("refresh");
        fireEvent(this, 'floor');
        return this;
    };

    ElevatorController.prototype.press = function(floor) {
      console.log("press");
        var index = this.floors.indexOf(floor.toString());
        if (index < 0) return;      // Ignore invalid presses

        this.queue.push(index);
        console.log("queue "+this.queue);
        react(this);
        return this;
    };

    function react(ctrl) {
      if(ctrl.elevator.motion == '1') {
        ctrl.queue.sort(function(a, b){return a-b});
        console.log("sort: "+ctrl.queue);
      } else if(ctrl.elevator.motion == '-1') {
        ctrl.queue.sort(function(a, b){return b-a});
        console.log("reverse: "+ctrl.queue);
      }

        if (ctrl.queue.length == 0) return;

        if (ctrl.currentIndex == ctrl.queue[0]) {
            ctrl.elevator.motion = 0;
            ctrl.queue.shift();
            fireEvent(ctrl, "arrived");
            window.clearInterval(ctrl.interval);
            ctrl.interval = null;
        }

        if (ctrl.queue.length == 0) return;

        if (ctrl.elevator.motion) {
            ctrl.elevator.currentFloor = ctrl.floors[ctrl.currentIndex += ctrl.elevator.motion];
            fireEvent(ctrl, "floor");
            return;
        }

        if (ctrl.currentIndex < ctrl.queue[0]) {
            ctrl.elevator.motion = +1;
            fireEvent(ctrl, "up");
        } else if (ctrl.currentIndex > ctrl.queue[0]) {
            ctrl.elevator.motion = -1;
            fireEvent(ctrl, "down");
        }
        if (!ctrl.interval) {
            ctrl.interval = window.setInterval(function() { react(ctrl); }, ctrl.travelTime);
        }
    }

    function fireEvent(ctrl, event) {
        for (var i = 0; i < ctrl.callbacks.length; i++) {
            ctrl.callbacks[i](ctrl.elevator, event);
        }
    }

    return ElevatorController;
})();



var elev = new ElevatorController(['P2', 'P1', 1, 2, 3, 4, 5]);
elev.addCallback(function debugReporting(ctrl, event) {
    console.log(event + " at " + ctrl.currentFloor);
}).addCallback(function buttonPanelCallback(ctrl, event) {
    if (event === "arrived") {
        $('button[value="' + ctrl.currentFloor + '"].lit').removeClass('lit');
    }
}).addCallback(function arrowLightCallback(ctrl, event) {
    if (event === "up") {
        $('#up-indicator-lift-one').addClass('lit');
    } else if (event === "down") {
        $('#down-indicator-lift-one').addClass('lit');
    } else if (event === "arrived") {
        $('#up-indicator-lift-one').add('#down-indicator-lift-one').removeClass('lit');
    }
}).addCallback(function floorNumberCallback(ctrl, event) {
    if (event === "floor") {
        $('#floor-number-lift-one').text(ctrl.currentFloor);
    }
});

/*var elev1 = new ElevatorController(['P2', 'P1', 1, 2, 3, 4, 5]);
elev1.addCallback(function debugReporting(ctrl, event) {
    console.log(event + " at " + ctrl.currentFloor);
}).addCallback(function buttonPanelCallback(ctrl, event) {
    if (event === "arrived") {
        $('button[value="' + ctrl.currentFloor + '"].lit').removeClass('lit');
    }
}).addCallback(function arrowLightCallback(ctrl, event) {
    if (event === "up") {
        $('#up-indicator-lift-two').addClass('lit');
    } else if (event === "down") {
        $('#down-indicator-lift-two').addClass('lit');
    } else if (event === "arrived") {
        $('#up-indicator-lift-two').add('#down-indicator-lift-two').removeClass('lit');
    }
}).addCallback(function floorNumberCallback(ctrl, event) {
    if (event === "floor") {
        $('#floor-number-lift-two').text(ctrl.currentFloor);
    }
});

var elev2 = new ElevatorController(['P2', 'P1', 1, 2, 3, 4, 5]);
elev2.addCallback(function debugReporting(ctrl, event) {
    console.log(event + " at " + ctrl.currentFloor);
}).addCallback(function buttonPanelCallback(ctrl, event) {
    if (event === "arrived") {
        $('button[value="' + ctrl.currentFloor + '"].lit').removeClass('lit');
    }
}).addCallback(function arrowLightCallback(ctrl, event) {
    if (event === "up") {
        $('#up-indicator-lift-three').addClass('lit');
    } else if (event === "down") {
        $('#down-indicator-lift-three').addClass('lit');
    } else if (event === "arrived") {
        $('#up-indicator-lift-three').add('#down-indicator-lift-three').removeClass('lit');
    }
}).addCallback(function floorNumberCallback(ctrl, event) {
    if (event === "floor") {
        $('#floor-number-lift-three').text(ctrl.currentFloor);
    }
});*/

$(function init() {
    $('.liftOne button').click(function() {
        $(this).addClass('lit');
        elev.press($(this).val());
    });
    elev.refresh();

    /*$('.liftTwo button').click(function() {
        $(this).addClass('lit');
        elev1.press($(this).val());
    });
    elev1.refresh();

    $('.liftThree button').click(function() {
        $(this).addClass('lit');
        elev2.press($(this).val());
    });
    elev2.refresh();*/
});
