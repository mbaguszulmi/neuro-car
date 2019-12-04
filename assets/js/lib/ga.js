const nextGeneration = () => {
    console.log('New Generation');
    calculateFitness();
    sortBestCar();

    for (let i = 0; i < POPULATION; i++) {
        // cars[i] = new Car(236, 440, true);
        cars[i] = pickOne();
    }
}

const sortBestCar = () => {
    for (let gap = POPULATION/2; gap > 0; gap = floor(gap/2)) {
        for(let i = gap; i < POPULATION; i++) {
            let tempCar = cars[i];
            let j;

            for(j = i; j >= gap && cars[j - gap].fitness > tempCar.fitness; j -= gap) {
                cars[j] = cars[j - gap];
            }

            cars[j] = tempCar;
        }
    }
}

const pickOne = () => {
    let index = 0;
    let r = random(1);

    // while(r > 0) {
    //     r = r - cars[index].fitness;
    //     index++;
    //     // if (index >= cars.length) {
    //     //     break;
    //     // }
    // }
    // index--;
    let car = cars[cars.length-1];

    // let car = cars[index];
    let child = new Car(236, 440, true, car.brain.copy());
    child.brain.mutate(randomGaussian);
    // child.brain.mutate(x=>x*0.1);
    return child;
}

const calculateFitness = () => {
    let sum = 0;
    cars.forEach(car => {
        sum += car.distance;
    });

    cars.forEach(car => {
        car.fitness = car.distance / sum;
    });
}