const Road = class {
    constructor(segmentArray) {
        this.segments = [];

        segmentArray.forEach(segmentData => {
            this.segments.push(new Segment(segmentData[0], segmentData[1], segmentData[2], segmentData[3]));
        });

        this.finishLine = this.segments.pop();

        this.segments.push(new Segment(0, 0, width, 0));
        this.segments.push(new Segment(width, 0, width, height));
        this.segments.push(new Segment(width, height, 0, height));
        this.segments.push(new Segment(0, height, 0, 0));
    }

    draw() {
        push();
        stroke('white');
        this.segments.forEach((segment, index) => {
            segment.draw();
        });
        pop();
    }
}