const FPS = 30;
const POPULATION = 100;
let dataJalan;
let road;
let currentCarIndex = 0;
let cars = [];
let found_solution = false;

function setup() {
    createCanvas(1000, 640);
    frameRate(FPS);
    fetch('./dataJalan.json')
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

    // fetch('./bestCar.json')
    // .then(response => {
    //     if (response.status !== 200) {
    //         console.log('Error: ' + response.status);
    //         return;
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     for (let i = 0; i < POPULATION; i++) {
    //         cars.push(new Car(236, 440, true, NeuralNetwork.deserialize(data)));
    //     }
    // })
    // .catch(error => {
    //     console.log('Error: ' + error);
    // });

    for (let i = 0; i < POPULATION; i++) {
        cars.push(new Car(236, 440, true));
    }
}

function isNoCarSurvived() {
    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        if (car.alive) {
            return false;
        }
    }

    return true;
}

function draw() {
    background(0, 0, 0);

    if (road !== undefined && cars.length > 0) {
        cars.forEach(car => {
            car.update();
    
            if (car.isCollide(road.finishLine)) {
                car.setFinish();
                console.log("BestCar : ", car.brain.serialize());
                found_solution = true;
            }
    
            car.readSensor(road.segments);
            if (!found_solution) {
                car.think();
            }
            if (car.isCollideWithArray(road.segments)) {
                car.destroy();
            }
            car.draw();
        });

        if (isNoCarSurvived()) {
            nextGeneration();
        }

        road.draw();
    }
}

