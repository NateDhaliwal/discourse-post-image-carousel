import { apiInitializer } from "discourse/lib/api";
import I18n from "discourse-i18n";

export default apiInitializer((api) => {
  const currentLocale = I18n.currentLocale();
  I18n.translations[currentLocale].js.composer.image_carousel_placeholder = `<img src="${settings.image_carousel_placeholder}" height="${settings.image_carousel_placeholder_height}" width="${settings.image_carousel_placeholder_width}" />`;

  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      id: "image-carousel",
      group: "extras",
      icon: "images",
      title: themePrefix("add_image_carousel"),
      perform: (e) => {
        e.applySurround(
          `[wrap="Carousel" autoplay=${settings.autoplay}]\n`,
          "\n[/wrap]",
          "image_carousel_placeholder"
        );
      }
    });
  });

  api.decorateCookedElement((element) => {
    let allImgCarsls = element.querySelectorAll('div[data-wrap="Carousel"]');
    
    if (allImgCarsls !== null) {
      let allImgCarslsArr = [...allImgCarsls];

      // Iterate, in case there are multiple carousels in a single post
      allImgCarslsArr.forEach((imgCarsls) => {
        // let allImgDivs = imgCarsls.querySelectorAll('div[data-wrap="carousel-image"]');
        let allImgDivs = imgCarsls.querySelectorAll('img');
        let allImgs = [];
        let autoplay = imgCarsls.dataset.autoplay === "true";
        
        if (allImgDivs !== null) {
          let allImgsDivsArr = [...allImgDivs];
          allImgsDivsArr.forEach((imgDiv) => {
            // allImgs.push(imgDiv.querySelectorAll('img')[0]); // Get the 1st image. Currently only supports 1 image per imgDiv
            allImgs.push(imgDiv);
          });
        }

        if (settings.carousel_software === "Swiper") {
          let imgCarslsContent = `
          <div class="swiper" id="swiper-${allImgCarslsArr.indexOf(imgCarsls)}">
            <div class="swiper-wrapper">
          `
          let imgCarslsThumb = ``;
          if (settings.enable_thumbs) {
            imgCarslsThumb = `
            <div class="swiper" id="swiper-${allImgCarslsArr.indexOf(imgCarsls)}-thumb">
              <div class="swiper-wrapper">
            `
          }
          allImgs.forEach((img) => {
            try {
              imgCarslsContent += `
                <div class="swiper-slide">
                  <img src="${img.src}" height="100%" width="100%" />
                </div>
              `;
              if (settings.enable_thumbs) {
                imgCarslsThumb += `
                  <div class="swiper-slide">
                    <img src="${img.src}" height="100%" width="100%" />
                  </div>
                `;
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(e);
            }
          });
            
          imgCarslsContent += "\n</div>";
          if (settings.enable_thumbs) {
            imgCarslsThumb += "\n</div>";
          }

          if (settings.show_pagination_buttons) {
            imgCarslsContent += `
            <div class="swiper-pagination"></div>
            `;
          }
          imgCarslsContent += `
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
            </div>
          `;
          if (settings.enable_thumbs) {
            imgCarsls.innerHTML = imgCarslsContent + imgCarslsThumb;
          } else {
            imgCarsls.innerHTML = imgCarslsContent;
          }

          setTimeout(() => {
            const swiperElement = imgCarsls.querySelector(`#swiper-${allImgCarslsArr.indexOf(imgCarsls)}`);
            let swiperElementThumb;
            if (settings.enable_thumbs) {
              swiperElementThumb = imgCarsls.querySelector(`#swiper-${allImgCarslsArr.indexOf(imgCarsls)}-thumb`);
            }
            if (swiperElement) {
              if (settings.enable_thumbs) {
                let swiperThumb = new Swiper(swiperElementThumb, {
                  centeredSlides: true,
                  spaceBetween: 10,
                  slidesPerView: 4,
                  freeMode: true,
                  watchSlidesProgress: true,
                  loop: settings.loop,
                });
                let swiperCode = new Swiper(swiperElement, {
                  centeredSlides: true,
                  spaceBetween: 10,
                  navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  },
                  pagination: (settings.show_pagination_buttons) ? {
                    el: '.swiper-pagination',
                    clickable: true
                  } : false,
                  loop: settings.loop,
                  autoplay: (autoplay) ? {
                    delay: settings.autoplay_interval
                  } : false,
                  thumbs: {
                    swiper: swiperThumb
                  }
                });
              } else {
                let swiperCode = new Swiper(swiperElement, {
                  centeredSlides: true,
                  spaceBetween: 10,
                  slidesPerView: 1,
                  navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  },
                  pagination: (settings.show_pagination_buttons) ? {
                    el: '.swiper-pagination',
                    clickable: true
                  } : false,
                  loop: settings.loop,
                  autoplay: (autoplay) ? {
                    delay: settings.autoplay_interval
                  } : false,
                });
              }
            }
          }, 0);
        } else {
          let imgCarslsContent = `
          <div class="splide" id="splide-${allImgCarslsArr.indexOf(imgCarsls)}">
            <div class="splide__track">
              <ul class="splide__list">
          `
          allImgs.forEach((img) => {
            imgCarslsContent += `
              <li class="splide__slide">
                <img src="${img.src}" height="100%" width="100%" />
              </li>
            `;
          });
          imgCarslsContent += `
              </ul>
            </div>
          </div>
          `

          imgCarsls.innerHTML = imgCarslsContent;

          // Use setTimeout or next tick to ensure the element is in DOM
          setTimeout(() => {
            const splideElement = imgCarsls.querySelector(`#splide-${allImgCarslsArr.indexOf(imgCarsls)}`);
            if (splideElement) {
              new Splide(splideElement, {
                pagination: settings.show_pagination_buttons,
                arrows: true,
                perPage: 1,
                type: settings.loop ? 'loop' : 'slide',
                autoplay: autoplay,
                interval: settings.autoplay_interval
              }).mount();
            }
          }, 0);
        }
      });
    }
  });
});
