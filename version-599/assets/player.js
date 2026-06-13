(() => {
  const video = document.getElementById('movieVideo');
  const startButton = document.getElementById('playerStart');
  const toggleButton = document.getElementById('playerToggle');
  const muteButton = document.getElementById('playerMute');
  const fullscreenButton = document.getElementById('playerFullscreen');

  if (!video) {
    return;
  }

  const shell = video.closest('.video-shell');
  const sourceElement = video.querySelector('source');
  const source = sourceElement ? sourceElement.getAttribute('src') : '';

  if (source) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });

      hls.loadSource(source);
      hls.attachMedia(video);
    }
  }

  const updateState = () => {
    const playing = !video.paused && !video.ended;

    if (shell) {
      shell.classList.toggle('is-playing', playing);
    }

    if (startButton) {
      startButton.classList.toggle('is-hidden', playing);
    }

    if (toggleButton) {
      toggleButton.textContent = playing ? '暂停' : '播放';
    }

    if (muteButton) {
      muteButton.textContent = video.muted ? '取消静音' : '静音';
    }
  };

  const startPlayback = async () => {
    try {
      await video.play();
    } catch (error) {
      if (startButton) {
        startButton.classList.remove('is-hidden');
      }
    }

    updateState();
  };

  const togglePlayback = () => {
    if (video.paused || video.ended) {
      startPlayback();
    } else {
      video.pause();
      updateState();
    }
  };

  if (startButton) {
    startButton.addEventListener('click', startPlayback);
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', togglePlayback);
  }

  video.addEventListener('click', togglePlayback);
  video.addEventListener('play', updateState);
  video.addEventListener('pause', updateState);
  video.addEventListener('ended', updateState);

  if (muteButton) {
    muteButton.addEventListener('click', () => {
      video.muted = !video.muted;
      updateState();
    });
  }

  if (fullscreenButton && shell) {
    fullscreenButton.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (shell.requestFullscreen) {
        shell.requestFullscreen();
      }
    });
  }

  updateState();
})();
