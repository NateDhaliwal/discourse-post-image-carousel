import { apiInitializer } from "discourse/lib/api";
import I18n from "discourse-i18n";

export default apiInitializer((api) => {
  const currentLocale = I18n.currentLocale();
  I18n.translations[currentLocale].js.composer.image_carousel_placeholder = settings.image_carousel_placeholder;

  api.onToolbarCreate((toolbar) => {
    toolbar.addButton({
      id: "image-carousel",
      group: "extras",
      icon: "images",
      title: themePrefix("add_image_carousel"),
      perform: (e) => {
        e.applySurround(
          `[wrap=${settings.carousel_software}]\n[wrap="carousel-image"]\n`,
          "\n[/wrap]\n[/wrap]",
          "image_carousel_placeholder"
        );
      }
    });
  });

  api.decorateCookedElement((element) => {
    let allImgCarsls = element.querySelectorAll('div[data-wrap="Swiper"]');
    
    if (allImgCarsls !== null) {
      let allImgCarslsArr = [...allImgCarsls];

      // Iterate, in case there are multiple carousels in a single post
      allImgCarslsArr.forEach((imgCarsls) => {
        let allImgDivs = imgCarsls.querySelectorAll('div[data-wrap="carousel-image"]');
        let allImgs = [];

        if (allImgDivs !== null) {
          let allImgsDivsArr = [...allImgDivs];
          allImgsDivsArr.forEach((imgDiv) => {
            allImgs.push(imgDiv.children[0].children[0]);
          });
        }

        if (settings.carousel_software === "Swiper") {
          let initScript = `
          const swiper = new Swiper('.swiper', {
            // Navigation arrows
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            
          `;
          let imgCarslsContent = `
          <div class="swiper">
            <div class="swiper-wrapper">
          `
          allImgs.forEach((img) => {
            imgCarslsContent += `
              <div class="swiper-slide">
                <img src="${img.attributes.getNamedItem('src').value}" height="${img.attributes.getNamedItem('height').value}" width="${img.attributes.getNamedItem('width').value}" />
              </div>
            `;
          });
            
          imgCarslsContent += "\n</div>";
          // if (settings.show_pagination_buttons) {
          //   imgCarslsContent += "\n<div class='swiper-pagination'></div>";
          //   initScript += `
          //     // Pagination
          //     pagination: {
          //       el: '.swiper-pagination',
          //       clickable: true
          //     },
          //   `;
          //   if (settings.autoplay) {
          //     initScript += `
          //     autoplay: {
          //       delay: ${settings.autoplay_interval}
          //     }
          //   });
          //   `;
          //   }
          // }

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

          imgCarslsContent;
          imgCarsls.innerHTML = imgCarslsContent;

          // const initScriptTag = document.createElement('script');
          // initScriptTag.innerHTML = initScript;
          // document.body.appendChild(initScriptTag);
          setTimeout(() => {
            const swiperElement = imgCarsls.querySelector(".swiper");
            if (swiperElement) {
              new Swiper(swiperElement, {
                navigation: {
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                },
                pagination: (settings.show_pagination_buttons) ? {
                  el: '.swiper-pagination',
                  clickable: true
                } : false,
                loop: settings.loop,
                autoplay: (settings.autoplay) ? {
                  delay: settings.autoplay_interval
                } : false,
              });
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
                <img src="${img.attributes.getNamedItem('src').value}" height="${img.attributes.getNamedItem('height').value}" width="${img.attributes.getNamedItem('width').value}" />
              </li>
            `;
          });
          imgCarslsContent += `
              </ul>
            </div>
          </div>
          `

          // let initScript = ``;
          
          // if (settings.show_pagination_buttons) {
          //   initScript += `
          //     new Splide('#splide-${allImgCarslsArr.indexOf(imgCarsls)}', {
          //       pagination: true,
          //       arrows: true,
          //       perPage: 1,
          //       type: 'loop',
          //   `;
          //   if (settings.autoplay) {
          //     initScript += `
          //       autoplay: true,
          //       interval: ${settings.autoplay_interval}
          //     `;
          //   }
          // } else {
          //   initScript += `
          //     new Splide('#splide-${allImgCarslsArr.indexOf(imgCarsls)}', {
          //       pagination: false,
          //   `;
          //   if (settings.autoplay) {
          //     initScript += `
          //       autoplay: true,
          //       interval: ${settings.autoplay_interval}
          //     `;
          //   }
          // }

          // initScript += `
          //   }).mount();
          // `;
          
          imgCarsls.innerHTML = imgCarslsContent;
          // const initScriptTag = document.createElement('script');
          // initScriptTag.innerHTML = initScript;
          // document.body.appendChild(initScriptTag);

          // Use setTimeout or next tick to ensure the element is in DOM
          setTimeout(() => {
            const splideElement = imgCarsls.querySelector(`#splide-${allImgCarslsArr.indexOf(imgCarsls)}`);
            if (splideElement) {
              new Splide(splideElement, {
                pagination: settings.show_pagination_buttons,
                arrows: true,
                perPage: 1,
                type: settings.loop ? 'loop' : 'slide',
                autoplay: settings.autoplay,
                interval: settings.autoplay_interval
              }).mount();
            }
          }, 0);
        }
      });
    }
  });
});
