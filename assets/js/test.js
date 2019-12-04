const FPS = 30;
const POPULATION = 100;
let dataJalan;
let bestCar;
let road;
let car;

function setup() {
    createCanvas(1000, 640);
    frameRate(FPS);
    fetch('/dataJalan.json')
    .then(response => {
        if (response.status !== 200) {
            console.log('Error: ' + response.status);
            return;
        }
        return response.json();
    })
    .then(data => {
        dataJalan = data;
        road = new Road(dataJalan);
    })
    .catch(error => {
        console.log('Error: ' + error);
    });

    fetch('/bestCar.json')
    .then(response => {
        if (response.status !== 200) {
            console.log('Error: ' + response.status);
            return;
        }
        return response.json();
    })
    .then(data => {
        bestCar = data;
        car = new Car(236, 440, true, NeuralNetwork.deserialize(bestCar));
    })
    .catch(error => {
        console.log('Error: ' + error);
    });
}

function draw() {
    background(0, 0, 0);

    if (road !== undefined && car !== undefined) {
        car.update();
        if (car.isCollide(road.finishLine)) {
            car.setFinish();
        }
        car.readSensor(road.segments);
        car.think();
        if (car.isCollideWithArray(road.segments)) {
            car.destroy();
        }

        if (!car.alive) {
            car = new Car(236, 440, true, NeuralNetwork.deserialize(bestCar));
        }

        car.draw();

        road.draw();
    }
}

