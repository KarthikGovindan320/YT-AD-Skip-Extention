console.log("YouTube Speed Controller extension loaded");

function injectSpeedControls() {
  const video = document.querySelector('video');
  const container = document.querySelector('.html5-video-player');

  if (!video || !container) {
    console.log('Video or container not found yet.');
    return;
  }

  if (document.getElementById('yt-speed-controller')) {
    console.log('Speed controller already injected.');
    return;
  }

  console.log('Injecting speed controls...');

  const controlBar = document.createElement('div');
  controlBar.id = 'yt-speed-controller';
  controlBar.style.position = 'absolute';
  controlBar.style.top = '10px';
  controlBar.style.left = '10px';
  controlBar.style.zIndex = '9999';
  controlBar.style.display = 'flex';
  controlBar.style.gap = '10px';
  controlBar.style.padding = '8px';
  controlBar.style.background = 'rgba(0, 0, 0, 0.7)';
  controlBar.style.borderRadius = '8px';
  controlBar.style.color = 'white';
  controlBar.style.alignItems = 'center';
  controlBar.style.fontFamily = 'Arial, sans-serif';

  let speed = 1.0;
  const speedDisplay = document.createElement('span');
  speedDisplay.textContent = speed.toFixed(2);

  const decreaseBtn = document.createElement('button');
  decreaseBtn.textContent = '<<';
  decreaseBtn.style.cursor = 'pointer';
  decreaseBtn.onclick = () => {
    speed = Math.max(0.25, speed - 0.25);
    updateSpeed();
  };

  const increaseBtn = document.createElement('button');
  increaseBtn.textContent = '>>';
  increaseBtn.style.cursor = 'pointer';
  increaseBtn.onclick = () => {
    speed = Math.min(16, speed + 0.25);
    updateSpeed();
  };

  function updateSpeed() {
    // Only update if not in ad
    if (!player.classList.contains('ad-showing')) {
      video.playbackRate = speed;
      speedDisplay.textContent = speed.toFixed(2);
    }
  }

  controlBar.appendChild(decreaseBtn);
  controlBar.appendChild(speedDisplay);
  controlBar.appendChild(increaseBtn);
  container.appendChild(controlBar);

  updateSpeed(); // Initial set
  monitorAds(video, speedDisplay);
}

function monitorAds(video, speedDisplay) {
  const player = document.querySelector('.html5-video-player');
  if (!player) return;

  const observer = new MutationObserver(() => {
    if (player.classList.contains('ad-showing')) {
      console.log('Ad detected — speeding up to 16x');
      video.playbackRate = 16.0;
      if (speedDisplay) speedDisplay.textContent = 'AD';
    } else {
      console.log('Ad ended — restoring user speed');
      const speed = parseFloat(document.getElementById('yt-speed-controller')?.querySelector('span')?.textContent) || 1.0;
      video.playbackRate = speed;
      if (speedDisplay && speed !== 16.0) speedDisplay.textContent = speed.toFixed(2);
    }
  });

  observer.observe(player, { attributes: true, attributeFilter: ['class'] });
}

// Observe the DOM for changes since YouTube is a SPA
const observer = new MutationObserver(() => {
  injectSpeedControls();
});

observer.observe(document.body, { childList: true, subtree: true });

// Try injecting once immediately
injectSpeedControls();
