import { apiInitializer } from "discourse/lib/api";
import I18n from "discourse-i18n";

import CreateCarouselModal from "../components/modal/create-carousel-modal";

function addElement(name, classes, id) {
  const element = document.createElement(name);
  classes.forEach((className) => {
    element.classList.add(className);
  });
  
  if (id !== "") {
    element.id = id;
  }
  
  return element;
}

export default apiInitializer((api) => {
  // const currentLocale = I18n.currentLocale();
  // I18n.translations[currentLocale].js.composer.image_carousel_placeholder = `<img src="${settings.image_carousel_placeholder}" height="${settings.image_carousel_placeholder_height}" width="${settings.image_carousel_placeholder_width}" />`;

  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      id: "image-carousel",
      group: "extras",
      icon: "images",
      title: themePrefix("add_image_carousel"),
      action: (event) => {
        const modal = api.container.lookup("service:modal");
        modal.show(CreateCarouselModal, {
          model: { toolbarEvent: event },
        });
      }
    });
  });

  api.decorateCookedElement((element) => {
    let allImgCarsls = element.querySelectorAll('div[data-wrap="Carousel"]');
    
    if (allImgCarsls !== null) {
      let allImgCarslsArr = [...allImgCarsls];

      // Iterate, in case there are multiple carousels in a single post
      allImgCarslsArr.forEach((imgCarsls) => {
        let allImgDivs = imgCarsls.querySelectorAll('img');
        let allImgs = [];
        let enable_autoplay = imgCarsls.dataset.autoplay === "true";
        let autoplay_interval = imgCarsls.dataset.interval;
        let enable_thumbs = imgCarsls.dataset.thumbs === "true";
        let enable_loop = imgCarsls.dataset.thumbs === "true";
        
        if (allImgDivs !== null) {
          let allImgsDivsArr = [...allImgDivs];
          allImgsDivsArr.forEach((imgDiv) => {
            allImgs.push(imgDiv);
          });
        }

        if (settings.carousel_software === "Swiper") {
          let imgCarslsContent = addElement("div", ["swiper"], `swiper-${allImgCarslsArr.indexOf(imgCarsls)}`);
          let imgCarslsContentWrapper = addElement("div", ["swiper-wrapper"], "");
          // let imgCarslsContent = `
          // <div class="swiper" id="swiper-${allImgCarslsArr.indexOf(imgCarsls)}">
          //   <div class="swiper-wrapper">
          // `
          let imgCarslsThumb;
          let imgCarslsThumbContentWrapper;
          // let imgCarslsThumb = ``;
          if (enable_thumbs) {
            imgCarslsThumb = addElement("div", ["swiper"], `swiper-${allImgCarslsArr.indexOf(imgCarsls)}-thumb`);
            imgCarslsThumbContentWrapper = addElement("div", ["swiper-wrapper"], "");
            // imgCarslsThumb = `
            // <div class="swiper" id="swiper-${allImgCarslsArr.indexOf(imgCarsls)}-thumb">
            //   <div class="swiper-wrapper">
            // `
          }
          
          allImgs.forEach((img) => {
            try {
              let imgElement = addElement("img", [], "");
              imgElement.src = img.src;
              let slide = addElement("div", ["swiper-slide"], "");
              slide.appendChild(imgElement);
              
              imgCarslsContentWrapper.appendChild(slide);
              
              // imgCarslsContent += `
              //   <div class="swiper-slide">
              //     <img src="${img.src}" height="100%" width="100%"/>
              //   </div>
              // `;
              if (enable_thumbs) {
                // imgCarslsThumb += `
                //   <div class="swiper-slide">
                //     <img src="${img.src}" height="100%" width="100%" style="aspect-ratio: 0;" />
                //   </div>
                // `;
                let thumbSlide = slide.cloneNode(true) // Note: `true` here means that there will be a 'deep' clone
                imgCarslsThumbContentWrapper.appendChild(thumbSlide);
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(e);
            }
          });
            
          // imgCarslsContent += "\n</div>";
          // if (enable_thumbs) {
          //   imgCarslsThumb += "\n</div>";
          // }

          imgCarslsContent.appendChild(imgCarslsContentWrapper);
          if (enable_thumbs) {
            imgCarslsThumb.appendChild(imgCarslsThumbContentWrapper);
          }

          if (settings.show_pagination_buttons) {
            let paginationDiv = addElement("div", ["swiper-pagination"], "");
            imgCarslsContent.appendChild(paginationDiv);
            // imgCarslsContent += `
            // <div class="swiper-pagination"></div>
            // `;
          }

          let prevArrow = addElement("div", ["swiper-button-prev"], "");
          let nextArrow = addElement("div", ["swiper-button-next"], "");
          imgCarslsContent.appendChild(prevArrow);
          imgCarslsContent.appendChild(nextArrow);
          // imgCarslsContent += `
          //   <div class="swiper-button-prev"></div>
          //   <div class="swiper-button-next"></div>
          //   </div>
          // `;
          if (enable_thumbs) {
            // imgCarsls.innerHTML = imgCarslsContent + imgCarslsThumb;
            imgCarsls.innerHTML = "";
            imgCarsls.appendChild(imgCarslsContent);
            imgCarsls.appendChild(imgCarslsThumb);
          } else {
            // imgCarsls.innerHTML = imgCarslsContent;
            imgCarsls.innerHTML = "";
            imgCarsls.appendChild(imgCarslsContent);
          }

          setTimeout(() => {
            const swiperElement = imgCarsls.querySelector(`#swiper-${allImgCarslsArr.indexOf(imgCarsls)}`);
            if (swiperElement) {
              if (enable_thumbs) {
                const swiperElementThumb = imgCarsls.querySelector(`#swiper-${allImgCarslsArr.indexOf(imgCarsls)}-thumb`);
                // console.log(swiperElementThumb);
                let swiperThumb = new Swiper(swiperElementThumb, {
                  spaceBetween: 10,
                  slidesPerView: 3,
                  freeMode: true,
                  centeredSlides: true, // settings.thumbs_direction === "horizontal",
                  centeredSlidesBounds: true, // settings.thumbs_direction === "horizontal",
                  watchSlidesVisibility: true,
                  watchSlidesProgress: true,
                  watchOverflow: true,
                  loop: enable_loop,
                  // direction: settings.thumbs_direction,
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
                  loop: enable_loop,
                  autoplay: (enable_autoplay) ? {
                    delay: autoplay_interval
                  } : false,
                  thumbs: {
                    swiper: swiperThumb
                  },
                  effect: settings.image_transition_animation,
                });

                // if (settings.thumbs_direction === "vertical") {
                //   console.log("Offset: " + swiperElement.offsetHeight + "px");
                //   swiperElementThumb.style.setProperty('height', `${swiperElement.offsetHeight}px`, 'important');
                //   console.log("Thumb height: " + swiperElementThumb.style.height);
                // }
              } else {
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
                  loop: enable_loop,
                  autoplay: (enable_autoplay) ? {
                    delay: autoplay_interval
                  } : false,
                  effect: settings.image_transition_animation,
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
                type: enable_loop ? 'loop' : 'slide',
                autoplay: enable_autoplay,
                interval: autoplay_interval
              }).mount();
            }
          }, 0);
        }
      });
    }
  });
});
