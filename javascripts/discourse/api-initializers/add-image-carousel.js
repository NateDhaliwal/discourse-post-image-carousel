import { apiInitializer } from "discourse/lib/api";
import I18n from "discourse-i18n";

export default apiInitializer((api) => {
  const currentLocale = I18n.currentLocale();
  I18n.translations[currentLocale].js.composer.image_carousel_placeholder =
    settings.image_carousel_placeholder;

  api.addComposerToolbarPopupMenuOption({
    id: "image-carousel",
    group: "extras",
    perform: (toolbarEvent) => {
      toolbarEvent.applySurround(
        `[carousel=${settings.carousel_software}]\n[image]`,
        "[/image]\n[/carousel]",
        "image_carousel_placeholder"
      );
    },
    icon: "images",
    title: themePrefix("add_image_carousel")
  });
});
