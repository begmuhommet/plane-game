import { World } from './World';

const hideClass = 'hidden';

async function main() {
  const container = document.querySelector('#container');
  if (!container) return;

  const world = new World(container);
  await world.init();
  world.start();

  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const overlay = document.getElementById('overlay');
  const planeCount = document.getElementById('planeCount');
  const starCount = document.getElementById('starCount');

  if (!planeCount || !starCount) {
    return;
  }

  planeCount.innerText = world.planeCount.toString();
  starCount.innerText = world.starCount.toString();

  world.addEventListener('score_inc', (data: any) => {
    starCount.innerText = data.count.toString();
  });

  world.addEventListener('score_dec', (data: any) => {
    if (data.count > 0) {
      planeCount.innerText = data.count.toString();
    } else {
      stopButton?.click();
      planeCount.innerText = '0';
      setTimeout(() => {
        world.resetScore();
        planeCount.innerText = world.planeCount.toString();
        starCount.innerText = world.starCount.toString();
      }, 500);
    }
  });

  if (!startButton || !overlay || !stopButton) {
    return;
  }

  startButton.addEventListener('click', () => {
    startButton.classList.add(hideClass);
    overlay.classList.add(hideClass);
    stopButton.classList.remove(hideClass);
    world.setActive(true);
  });

  stopButton.addEventListener('click', () => {
    stopButton.classList.add(hideClass);
    startButton.classList.remove(hideClass);
    overlay.classList.remove(hideClass);
    world.setActive(false);
  });
}

main().catch(err => {
  console.error('main -> ', err);
});
