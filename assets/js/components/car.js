const Car = class {
    constructor(x, y, ai = false, brain) {
        this.width = 20;
        this.height = 40;
        this.maxSensorLength = 100;
        this.ai = ai;

        this.centerLine = new Segment(x, y, x, y-this.height);
        this.v = createVector(0, 0);
        this.maxSpeed = 6;
        this.acceleration = 0.3;
        this.brakeValue = 0.8;
        this.deceleration = 0.01;
        this.a = createVector(0, 0);
        this.angle = 270;
        this.maxAngleSpeed = 5;
        this.minAngleSpeed = 1;
        this.maxAngle = 45;
        this.alive = true;
        this.distance = 1.0;
        this.finish = false;
        // this.fitness = 0.0;

        this.frontBumper = new Segment(this.centerLine.end.x-(this.width/2), this.centerLine.end.y, this.centerLine.end.x+(this.width/2), this.centerLine.end.y);
        this.backBumper = new Segment(this.centerLine.start.x-(this.width/2), this.centerLine.start.y, this.centerLine.start.x+(this.width/2), this.centerLine.start.y);

        this.sensors = [
            new Segment(this.centerLine.end.x, y-this.height, this.centerLine.end.x, y-this.height-this.maxSensorLength),
            new Segment(this.centerLine.end.x, y-this.height, this.centerLine.end.x, y-this.height-this.maxSensorLength),
            new Segment(this.centerLine.end.x, y-this.height, this.centerLine.end.x, y-this.height-this.maxSensorLength),
            new Segment(this.centerLine.end.x, y-this.height, this.centerLine.end.x, y-this.height-this.maxSensorLength),
            new Segment(this.centerLine.end.x, y-this.height, this.centerLine.end.x, y-this.height-this.maxSensorLength),
        ];

        this.sensors[0].rotate(270);
        this.sensors[1].rotate(225);
        this.sensors[3].rotate(-45);
        this.sensors[4].rotate(-90)

        if (brain) {
            this.brain = brain.copy();
        }
        else {
            this.brain = new NeuralNetwork(6, 12, 2);
        }
        this.counter = 0;
    }

    destroyWhenNotMove(dur) {
        if (this.v.mag() < 1) {
            this.counter++;    
        }
        else {
            this.counter = 0;
        }

        if (this.counter == FPS*dur) {
            // check if counter hit in {dur} seconds
            this.destroy();
        }
    }

    think() {
        if (this.ai && this.alive) {
            this.destroyWhenNotMove(5);
            let inputs = [
                this.sensors[0].start.dist(this.sensors[0].end), // panjang sensor kiri
                this.sensors[1].start.dist(this.sensors[1].end), // panjang sensor pojok kiri
                this.sensors[2].start.dist(this.sensors[2].end), // panjang sensor tengah
                this.sensors[3].start.dist(this.sensors[3].end), // panjang sensor pojok kanan
                this.sensors[4].start.dist(this.sensors[4].end), // panjang sensor kanan
                this.v.mag(),
                // this.angle
            ];
            let outputs = this.brain.predict(inputs);

            if (outputs[0] > 0.66) {
                this.forward();
            }
            else if (outputs[0] > 0.33) {
                this.brake();
            }
            else {
                this.decelerate();
            }

            // if (outputs[0] > 0.5) {
            //     this.forward();
            // }

            if (outputs[1] > 0.5) {
                this.turnLeft();
            }
            else {
                this.turnRight();
            }
        }
        else {
            this.a = createVector(0, 0);
        }
    }

    destroy() {
        this.alive = false;
    }

    setFinish() {
        this.finish = true;
    }

    forward() {
        this.a = p5.Vector.fromAngle(radians(this.angle), this.acceleration);
    }

    brake() {
        if (Math.round(this.v.heading()) == Math.round(radians((this.angle-180)))) {
            this.v = createVector(0, 0);
            this.a = createVector(0, 0);
        }
        else {
            this.a = p5.Vector.fromAngle(radians(this.angle-180), this.brakeValue);
        }
    }

    decelerate() {
        this.a = p5.Vector.fromAngle(radians(this.angle-180), this.deceleration);
        if (Math.round(this.v.heading()) == Math.round(radians((this.angle-180)))) {
            this.v = createVector(0, 0);
            this.a = createVector(0, 0);
        }
    }

    turnRight() {
        if (this.v.mag() > 0.3) {
            this.angle += this.maxAngleSpeed;
            this.centerLine.rotate(this.angle);
            this.v = p5.Vector.fromAngle(radians(this.angle), this.v.mag());
        }
    }

    turnLeft() {
        if (this.v.mag() > 0.3) {
            this.angle -= this.maxAngleSpeed;
            this.centerLine.rotate(this.angle);
            this.v = p5.Vector.fromAngle(radians(this.angle), this.v.mag());
        }
    }

    draw() {
        push();
        if (this.alive) {
            stroke('white');
        }
        else {
            stroke('red');
        }
        this.centerLine.draw();
        this.frontBumper.draw();
        this.backBumper.draw();

        stroke('green');
        this.sensors.forEach(sensor => {
            sensor.draw();
        });
        pop();
    }

    update() {
        this.v.add(this.a);
        if (this.v.mag() > this.maxSpeed) {
            this.v.setMag(this.maxSpeed);
        }

        if (Math.round(this.v.heading()) != Math.round(radians((this.angle-180))) && this.alive) {
            this.centerLine.start.add(this.v);
            this.centerLine.end.add(this.v);
            this.distance += this.v.mag();
        }

        if (!this.ai) {
            // control enabled when not in ai
            if (keyIsDown(UP_ARROW)) {
                this.forward();
            }
            else if (keyIsDown(DOWN_ARROW)) {
                this.brake();
            }
            else {
                this.decelerate();
            }
    
            if (keyIsDown(LEFT_ARROW) && this.alive) {
                this.turnLeft();
            }
            else if (keyIsDown(RIGHT_ARROW) && this.alive) {
                this.turnRight();
            }
        }

        this.frontBumper.start.x = Math.cos(radians(this.angle-90)) * this.width/2 + this.centerLine.end.x;
        this.frontBumper.start.y = Math.sin(radians(this.angle-90)) * this.width/2 + this.centerLine.end.y;
        this.frontBumper.end.x = Math.cos(radians(this.angle-270)) * this.width/2 + this.centerLine.end.x;
        this.frontBumper.end.y = Math.sin(radians(this.angle-270)) * this.width/2 + this.centerLine.end.y;

        this.backBumper.start.x = Math.cos(radians(this.angle-90)) * this.width/2 + this.centerLine.start.x;
        this.backBumper.start.y = Math.sin(radians(this.angle-90)) * this.width/2 + this.centerLine.start.y;
        this.backBumper.end.x = Math.cos(radians(this.angle-270)) * this.width/2 + this.centerLine.start.x;
        this.backBumper.end.y = Math.sin(radians(this.angle-270)) * this.width/2 + this.centerLine.start.y;

        this.sensors.forEach((sensor, index) => {
            let angleAdd = 0;
            if (index == 0) {
                angleAdd = -90;
            }
            else if (index == 1) {
                angleAdd = -45;
            }
            else if (index == 3) {
                angleAdd = 45;
            }
            else if (index == 4) {
                angleAdd = 90;
            }
            sensor.start.x = this.centerLine.end.x;
            sensor.start.y = this.centerLine.end.y;
            sensor.end.x = Math.cos(radians(this.angle+angleAdd)) * this.maxSensorLength + this.centerLine.end.x;
            sensor.end.y = Math.sin(radians(this.angle+angleAdd)) * this.maxSensorLength + this.centerLine.end.y;
        });

        if (this.angle < 0) {
            this.angle = 360 - this.angle;
        }
        else if (this.angle > 360) {
            this.angle -= 360;
        }
    }

    isCollide(lineData) {
        return (this.centerLine.isCollide(lineData, Segment.LIMIT_ALL) || this.frontBumper.isCollide(lineData, Segment.LIMIT_ALL) || this.backBumper.isCollide(lineData, Segment.LIMIT_ALL));
    }

    isCollideWithArray(lineArray) {
        for (let i = 0; i < lineArray.length; i++) {
            const line = lineArray[i];
            
            if (this.isCollide(line)) {
                return true;
            }
        }

        return;
    }

    readSensor(road) {
        this.sensors.forEach(sensor => {
            let minDist;
            road.forEach(segment => {
                let intersection = sensor.isCollide(segment, Segment.UNLIMIT_THIS);
                if (intersection) {
                    let dist = sensor.start.dist(intersection);

                    if (minDist === undefined || minDist > dist) {
                        minDist = dist;
                        sensor.end.x = intersection.x;
                        sensor.end.y = intersection.y;
                    }
                }
            });
        });
    }
}