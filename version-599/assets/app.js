(() => {
  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      mobileNav.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let current = slides.findIndex((slide) => slide.classList.contains('is-active'));

    if (current < 0) {
      current = 0;
    }

    const showSlide = (index) => {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        showSlide(Number(dot.dataset.slide || 0));
      });
    });

    if (prev) {
      prev.addEventListener('click', () => showSlide(current - 1));
    }

    if (next) {
      next.addEventListener('click', () => showSlide(current + 1));
    }

    setInterval(() => {
      showSlide(current + 1);
    }, 5600);
  }

  const searchGrid = document.getElementById('searchGrid');

  if (searchGrid) {
    const input = document.getElementById('movieSearch');
    const region = document.getElementById('filterRegion');
    const type = document.getElementById('filterType');
    const year = document.getElementById('filterYear');
    const clear = document.getElementById('clearFilters');
    const empty = document.getElementById('emptyState');
    const cards = Array.from(searchGrid.querySelectorAll('.movie-card'));
    const params = new URLSearchParams(window.location.search);

    if (input && params.get('q')) {
      input.value = params.get('q') || '';
    }

    const matchText = (card, keyword) => {
      if (!keyword) {
        return true;
      }

      const haystack = [
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.tags
      ].join(' ').toLowerCase();

      return haystack.includes(keyword.toLowerCase());
    };

    const applyFilters = () => {
      const keyword = input ? input.value.trim() : '';
      const selectedRegion = region ? region.value : '';
      const selectedType = type ? type.value : '';
      const selectedYear = year ? year.value : '';
      let visible = 0;

      cards.forEach((card) => {
        const isVisible =
          matchText(card, keyword) &&
          (!selectedRegion || card.dataset.region === selectedRegion) &&
          (!selectedType || card.dataset.type === selectedType) &&
          (!selectedYear || card.dataset.year === selectedYear);

        card.style.display = isVisible ? '' : 'none';

        if (isVisible) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    };

    [input, region, type, year].forEach((element) => {
      if (element) {
        element.addEventListener('input', applyFilters);
        element.addEventListener('change', applyFilters);
      }
    });

    if (clear) {
      clear.addEventListener('click', () => {
        if (input) {
          input.value = '';
        }

        if (region) {
          region.value = '';
        }

        if (type) {
          type.value = '';
        }

        if (year) {
          year.value = '';
        }

        applyFilters();
      });
    }

    applyFilters();
  }
})();
