const Segment = class {
    static get UNLIMIT_THIS() {return 1};
    static get UNLIMIT_OTHER() {return 2};
    static get UNLIMIT_ALL() {return 3};
    static get LIMIT_ALL() {return 4};

    constructor(x1, y1, x2, y2) {
        this.start = createVector(x1, y1);
        this.end = createVector(x2, y2);
        this.distance = this.start.dist(this.end);
    }

    rotate(deg) {
        let x, y;
        x = Math.cos(radians(deg))*this.distance + this.start.x;
        y = Math.sin(radians(deg))*this.distance + this.start.y;
        this.end = createVector(x, y);
    }

    draw() {
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }

    isCollide(segment, type) {
        const x1 = segment.start.x;
        const y1 = segment.start.y;
        const x2 = segment.end.x;
        const y2 = segment.end.y;

        const x3 = this.start.x;
        const y3 = this.start.y;
        const x4 = this.end.x;
        const y4 = this.end.y;

        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0) {
            return;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

        if (type === Segment.UNLIMIT_ALL) {
            if (t > 0 && u > 0) {
                let x, y;
                x = x1 + t * (x2-x1);
                y = y1 + t * (y2-y1);
                return createVector(x, y);
            }
            else return;
        }
        else if (type === Segment.UNLIMIT_THIS) {
            if (t > 0 && t < 1 && u > 0) {
                let x, y;
                x = x1 + t * (x2-x1);
                y = y1 + t * (y2-y1);
                return createVector(x, y);
            }
            else return;
        }
        else if (type === Segment.UNLIMIT_OTHER) {
            if (t > 0 && u > 0 && u < 1) {
                let x, y;
                x = x1 + t * (x2-x1);
                y = y1 + t * (y2-y1);
                return createVector(x, y);
            }
            else return;
        }
        else if (type === Segment.LIMIT_ALL) {
            if (t > 0 && t < 1 && u > 0 && u < 1) {
                let x, y;
                x = x1 + t * (x2-x1);
                y = y1 + t * (y2-y1);
                return createVector(x, y);
            }
            else return;
        }
    }
}