const catalogList = document.querySelector('.catalog-list');
const catalogMore = document.querySelector('.catalog__more');
const prodModal = document.querySelector('[data-graph-target="prod-modal"] .modal-content');
const prodModalSlider = prodModal.querySelector('.modal-slider .swiper-wrapper');
const prodModalPreview = prodModal.querySelector('.modal-slider .modal-preview');
const prodModalInfo = prodModal.querySelector('.modal-info__wrapper');
const prodModalDescr = prodModal.querySelector('.modal-prod-descr');
const prodModalChars = prodModal.querySelector('.prod-chars');
const prodModalVideo = prodModal.querySelector('.prod-modal__video');
let prodQuantity = 5;
let dataLength = null;

const normalPrice = (str) => {
  return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

const prodSlider = new Swiper('.modal-slider__container', {
  slidesPerView: 1,
  spaceBetween: 20
});

if (catalogList) {
  const loadProducts = (quantity = 5) => {
    fetch('../data/data.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dataLength = data.length;

        catalogList.innerHTML = '';

        for (let i = 0; i < dataLength; i++) {
          if (i < quantity) {
            let item = data[i];
            console.log(item)

            catalogList.innerHTML += `

              <li class="catalog-list__item">
                <article class="product">
                  <div class="product__image">
                    <img src="${item.mainImage}" alt="${item.title}">
                    <div class="product__btns">
                      <button class="btn-reset product__btn" data-graph-path="prod-modal" data-id="${item.id}" aria-label="Показать информацию о товаре">
                        <svg>
                          <use xlink:href="img/sprite.svg#eye"></use>
                        </svg>
                      </button>
                      <button class="btn-reset product__btn" aria-label="Добавить товар в корзину">
                        <svg>
                          <use xlink:href="img/sprite.svg#cart"></use>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h3 class="product__title">${item.title}</h3>
                  <span class="product__price">${normalPrice(item.price)} р</span>
                </article>
              </li>

            `;
          }
        }
      })
      .then(() => {

        const productTitle = document.querySelectorAll('.product__title');
        productTitle.forEach(el => {
          $clamp(el, {clamp: '22px'});
        });


        const modal = new GraphModal({
          isOpen: (modal) => {
            const openBtnId = modal.previousActiveElement.dataset.id;

            loadModalData(openBtnId);

            prodSlider.update();
          },
        });

      });
  };

  loadProducts(prodQuantity);

  const loadModalData = (id = 1) => {
    fetch('../data/data.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        prodModalSlider.innerHTML = '';
        prodModalPreview.innerHTML = '';
        prodModalInfo.innerHTML = '';
        prodModalDescr.textContent = '';
        prodModalChars.innerHTML = '';
        prodModalVideo.innerHTML = '';

        for (let dataItem of data) {
          if (dataItem.id == id) {
            console.log(dataItem);

            const slides = dataItem.gallery.map((image, idx) => {
              return `
                <div class="swiper-slide" data-index="${idx}">
                  <img src="${image}" alt="">
                </div>
              `;
            });

            const preview = dataItem.gallery.map((image, idx) => {
              return `
                <div class="modal-preview__item ${idx === 0 ? 'modal-preview__item--active' : ''}" tabindex="0" data-index="${idx}">
                  <img src="${image}" alt="">
                </div>
              `;
            });

            const sizes = dataItem.sizes.map((size, idx) => {
              return `
                <li class="modal-sizes__item">
                  <button class="btn-reset modal-sizes__btn">${size}</button>
                </li>
              `;
            });

            prodModalSlider.innerHTML = slides.join('');
            prodModalPreview.innerHTML = preview.join('');

            prodModalInfo.innerHTML = `

              <h3 class="modal-info__title">${dataItem.title}</h3>
              <div class="modal-info__rate">
                <img src="img/star.svg" alt="Рейтинг 5 из 5">
                <img src="img/star.svg" alt="">
                <img src="img/star.svg" alt="">
                <img src="img/star.svg" alt="">
                <img src="img/star.svg" alt="">
              </div>
              <div class="modal-info__sizes">
                <span class="modal-info__subtitle">Выберите размер</span>
                <ul class="list-reset modal-info__sizes-list modal-sizes">
                  ${sizes.join('')}
                </ul>
              </div>
              <div class="modal-info__price">
                <span class="modal-info__current-price">${dataItem.price} р</span>
                <span class="modal-info__old-price">${dataItem.oldPrice ? dataItem.oldPrice + 'р' : ''}</span>
              </div>
            `;

            prodModalDescr.textContent = dataItem.description;

            let charsItems = '';

            Object.keys(dataItem.chars).forEach(function eachKey(key) {
              charsItems += `<p class="prod-bottom__descr prod-chars__item">${key}: ${dataItem.chars[key]}</p>`
            });

            prodModalChars.innerHTML = charsItems;

            if (dataItem.video) {
              prodModalVideo.style.display = 'block';
              prodModalVideo.innerHTML = `
                <iframe src="${dataItem.video}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
              `;
            } else {
              prodModalVideo.style.display = 'none';
            }
          }
        }
      })
      .then(() => {
        prodSlider.update();

        prodSlider.on('slideChangeTransitionEnd', function () {
          let idx = document.querySelector('.swiper-slide-active').dataset.index;
          document.querySelectorAll('.modal-preview__item').forEach(el => {el.classList.remove('modal-preview__item--active');});
          document.querySelector(`.modal-preview__item[data-index="${idx}"]`).classList.add('modal-preview__item--active');
        });

        document.querySelectorAll('.modal-preview__item').forEach(el => {
          el.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.dataset.index);
            document.querySelectorAll('.modal-preview__item').forEach(el => {el.classList.remove('modal-preview__item--active');});
            e.currentTarget.classList.add('modal-preview__item--active');

            prodSlider.slideTo(idx);
          });
        });
      });
  };

  catalogMore.addEventListener('click', (e) => {
    prodQuantity = prodQuantity + 3;

    loadProducts(prodQuantity);

    if (prodQuantity >= dataLength) {
      catalogMore.style.display = 'none';
    } else {
      catalogMore.style.display = 'block';
    }
  });
}


