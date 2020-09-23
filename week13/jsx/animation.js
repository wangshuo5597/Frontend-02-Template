const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start-time");
export class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set();
    this[ADD_TIME] = new Map();
  }
  start() {
    let startTime = Date.now();
    this[TICK] = () => {
      let t = Date.now() - startTime;
      for (let animation of this[ANIMATIONS]) {
        let t0;
        if (this[START_TIME].get(animation) < startTime) t0 = now - startTime;
        else t0 = now - this[START_TIME].get(animation);
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t0 = animation.duration;
        }
        animation.reveive(t0);
      }
      requestAnimationFrame(this[TICK]);
    };
    this[TICK]();
  }

  pause() {}
  resume() {}
  reset() {}
  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }
  remove(animation) {
    this[ANIMATIONS].delete(animation);
  }
  set rate(val) {}
  get rate() {}
}

export class Animation {
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    delay,
    timingFunction
  ) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
    this.deplay = delay;
  }
  reveive(time) {
    console.log(time);
    let range = this.endValue - this.startValue;
    this.object[this.property] =
      this.startValue + (range * time) / this.duration;
  }
}
