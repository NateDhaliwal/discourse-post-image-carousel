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
          `[carousel=${settings.carousel_software}]\n[image]`,
          "[/image]\n[/carousel]",
          "image_carousel_placeholder"
        );
      }
    });
  });
});
