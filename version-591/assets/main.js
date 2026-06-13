(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-main-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dots] button'));
    var index = 0;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(index + 1);
      }, 5600);
    }
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var typeFilter = document.querySelector('[data-type-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.filterable-list .movie-card'));

  if (filterInput && cards.length) {
    var params = new URLSearchParams(location.search);
    var query = params.get('q');

    if (query) {
      filterInput.value = query;
    }

    function applyFilter() {
      var text = filterInput.value.trim().toLowerCase();
      var type = typeFilter ? typeFilter.value : '';

      cards.forEach(function (card) {
        var haystack = card.getAttribute('data-search') || '';
        var cardType = card.getAttribute('data-type') || '';
        var matchedText = !text || haystack.indexOf(text) !== -1;
        var matchedType = !type || cardType === type;
        card.classList.toggle('is-hidden', !(matchedText && matchedType));
      });
    }

    filterInput.addEventListener('input', applyFilter);

    if (typeFilter) {
      typeFilter.addEventListener('change', applyFilter);
    }

    applyFilter();
  }
})();

function initMoviePlayer(source) {
  var video = document.getElementById('site-player');
  var button = document.getElementById('start-player');
  var loaded = false;
  var hlsInstance = null;

  if (!video || !source) {
    return;
  }

  function loadSource() {
    if (loaded) {
      return Promise.resolve();
    }

    loaded = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return Promise.resolve();
    }

    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);

      return new Promise(function (resolve) {
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
          resolve();
        });
      });
    }

    video.src = source;
    return Promise.resolve();
  }

  function startPlay() {
    loadSource().then(function () {
      var playResult = video.play();

      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {});
      }
    });

    if (button) {
      button.classList.add('is-hidden');
    }
  }

  if (button) {
    button.addEventListener('click', startPlay);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      startPlay();
    }
  });

  video.addEventListener('play', function () {
    if (button) {
      button.classList.add('is-hidden');
    }
  });

  video.addEventListener('error', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
      loaded = false;
    }
  });
}
