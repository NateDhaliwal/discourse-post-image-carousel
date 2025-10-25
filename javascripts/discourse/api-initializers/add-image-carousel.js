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
          <script>
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
          if (settings.show_pagination_buttons) {
            imgCarslsContent += "\n<div class='swiper-pagination'></div>";
            initScript += `
              // Pagination
              pagination: {
                el: '.swiper-pagination',
                clickable: true
              },
            `;
            if (settings.autoplay) {
              initScript += `
              autoplay: {
                delay: ${settings.autoplay_interval}
              }
            });
            </script>
            `;
            }
          }
          imgCarslsContent += `
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
            </div>
            
          `;

          imgCarslsContent += initScript;
          imgCarsls.innerHTML = imgCarslsContent;

        } else {
          let imgCarslsContent = `
          <div class="splide" id="${allImgCarslsArr.indexOf(imgCarsls)}">
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
          <script>
          `;
          
          if (settings.show_pagination_buttons) {
            imgCarslsContent += `
              new Splide('#${allImgCarslsArr.indexOf(imgCarsls)}', {
                pagination: true,
            `;
            if (settings.autoplay) {
              imgCarslsContent += `
                autoplay: true,
                interval: ${settings.autoplay_interval}
              `;
            }
          } else {
            imgCarslsContent += `
              new Splide('#${allImgCarslsArr.index(imgCarsls)}', {
                pagination: false,
            `;
            if (settings.autoplay) {
              imgCarslsContent += `
                autoplay: true,
                interval: ${settings.autoplay_interval}
              `;
            }
          }

          imgCarslsContent += `
            }).mount();
            </script>
          `;
          
          imgCarsls.innerHTML = imgCarslsContent;
        }
      });
    }
  });
});
