import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import {countdownTimer} from './timer.js';


(() => {
  function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }

  const refs = {
    edtDateTimePicker: document.getElementById('datetime-picker'),
    btnStartTimer: document.querySelector('[data-start]'),
    txtDays: document.querySelector('[data-days]'),
    txtHours: document.querySelector('[data-hours]'),
    txtMinutes: document.querySelector('[data-minutes]'),
    txtSeconds: document.querySelector('[data-seconds]'),
  };

  let selectedDateTime = Date.now();

  const timerCountDown = new countdownTimer();

  const timerCheck = new countdownTimer();

  const timerCountDownOptions = {
    timerInterval: 1000,
    timerStopDateTime: Date.now(),
    onTimer: function() {
      displayTimeLeft(selectedDateTime - Date.now());
    },
    onTimerStarted: function() {
      checkControlsDisabled();
    },
    onTimerKilled: function() {
      displayTimeLeft(0);
      checkControlsDisabled();
    }
  }

  const timerCheckOptions = {
    timerInterval: 1000,
    timerStopDateTime: Date.now(),
    onTimer: function() {},
    onTimerStarted: function() {
      checkControlsDisabled();
    },
    onTimerKilled: function() {
      checkControlsDisabled();
    }
  }

  const flatpickrOptions = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      selectedDateTime = selectedDates[0];
      const isCorrectTime = (selectedDateTime - Date.now()) > 1000;
      if (!isCorrectTime) {
        iziToast.error({
          id: 'error',
          title: 'Error', 
          message: 'Please choose a date in the future',
          position: 'topRight'
        });

        timerCheck.killTimer();
      } else {
        timerCheckOptions.timerStopDateTime = selectedDateTime;
        timerCheck.startTimer(timerCheckOptions);
      }
    },
  };

  flatpickr('#datetime-picker', flatpickrOptions);

  refs.btnStartTimer.disabled = true;
  refs.btnStartTimer.addEventListener('click', startTimerOutput);

  function startTimerOutput() {
    timerCheck.killTimer();
    timerCountDownOptions.timerStopDateTime = selectedDateTime;
    timerCountDown.startTimer(timerCountDownOptions);
  }

  function checkControlsDisabled() {
    refs.edtDateTimePicker.disabled = (timerCountDown.isRunning);
    refs.btnStartTimer.disabled = (!timerCheck.isRunning);
  }

  function displayTimeLeft(ms) {
    if ((!timerCountDown.isRunning) || (ms < 0)) {
      ms = 0;
    }

    const values = convertMs(ms);

    refs.txtDays.textContent = addLeadingZero(values.days);
    refs.txtHours.textContent = addLeadingZero(values.hours);
    refs.txtMinutes.textContent = addLeadingZero(values.minutes);
    refs.txtSeconds.textContent = addLeadingZero(values.seconds);
  }

  function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
  }

})();

