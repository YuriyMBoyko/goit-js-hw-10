export class timer {
  #timerId = 0;
  #defaults = {
    timerInterval: 1000,
    onTimer: function() {},
    onTimerStarted: function() {},
    onTimerKilled: function() {}
  };

  #settings = {};

  static extend = function(defaults, options) {
    var extended ={};
    for (var prop in defaults) {
      extended[prop] = defaults[prop];
    }
    for (var prop in options) {
      extended[prop] = options[prop];
    }
    return extended;
  };

  constructor(options) {
    this.#timerId = 0;
    this.#defaults = timer.extend(this.#defaults, options || {});
  }

  get id() {
    return this.#timerId;
  }

  get isRunning() {
    return (this.#timerId !== 0);
  }

  get getTimerProc() {
    return function() {
      this.timerProc();
    }
  }

  timerProc() {
    if (this.isRunning) {
      if (this.#settings.onTimer !== null) {
        this.#settings.onTimer();
      }
    }
  }

  #internalTimerProc(timer) {
    timer.timerProc();
  }

  startTimer(options) {
    this.#internalKillTimer();

    this.#settings = timer.extend(this.#defaults, options || {});

    this.#timerId = setInterval(this.#internalTimerProc, this.#settings.timerInterval, this);

    if (this.#settings.onTimerStarted !== null) {
      this.#settings.onTimerStarted();
    }
  }

  #internalKillTimer() {
    if (this.isRunning) {
      clearInterval(this.#timerId);
      this.#timerId = 0;
      return true;
    }
    return false;
  }

  killTimer() {
    this.#internalKillTimer();
    if (typeof this.#settings.onTimerKilled === 'function' && this.#settings.length !== 0) {
      this.#settings.onTimerKilled.apply();
    }
  }

}

export class countdownTimer extends timer {
  #defaults = {
    timerStopDateTime: Date.now()
  }

  #settings = {};

  constructor(options) {
    super(options);

    this.#defaults = timer.extend(this.#defaults, options || {});
  }

  get stopDateTime() {
    if (this.isRunning) {
      return this.#settings.timerStopDateTime;
    } else {
      return this.#defaults.timerStopDateTime;
    }
  }

  set stopDateTime(newStopDateTime) {
    if (this.isRunning) {
      this.#settings.timerStopDateTime = newStopDateTime;
    } else {
      this.#defaults.timerStopDateTime = newStopDateTime;
    }
  }

  get getTimerProc() {
    return function() {
      this.timerProc();
    }
  }

  startTimer(options) {
    this.#settings = timer.extend(this.#defaults, options || {});

    super.startTimer(options);
  }

  timerProc() {
    if (this.isRunning) {
      const timeLeft = this.stopDateTime - Date.now();
      if (timeLeft < 0) {
        this.killTimer();
      } else {
        super.timerProc();
      }
    }
  }

}
