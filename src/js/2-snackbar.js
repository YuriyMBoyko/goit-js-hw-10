import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const makePromiseProc = ({delay, shouldResolve = true}) =>
{
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(`✅ Fulfilled promise in ${delay}ms`);
      } else {
        reject(`❌ Rejected promise in ${delay}ms`);
      }
    }, delay);
  });
};

const refs = {
  form: document.querySelector('.form')
};

refs.form.addEventListener('submit', event => {
  event.preventDefault();

  const delay = Number(event.currentTarget.elements.delay.value);
  const state = event.currentTarget.elements.state.value;

  console.log(`delay is ${delay}ms`)
  console.log(`state is ${state}`);

  if (!isNaN(delay) && (delay >= 0)) {

    makePromiseProc({delay: delay, shouldResolve: (state === 'fulfilled')})
      .then(value => {
        iziToast.success({
          title: 'Ok',
          message: value,
          position: 'topRight',
        });
      })
      .catch(value => {
        iziToast.error({
          title: 'Error',
          message: value,
          position: 'topRight',
        })
      })

  }

  refs.form.reset();
});
