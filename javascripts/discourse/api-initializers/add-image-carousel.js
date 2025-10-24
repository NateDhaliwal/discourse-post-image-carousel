import { apiInitializer } from "discourse/lib/api";

export default apiInitializer((api) => {
  api.addComposerToolbarPopupMenuOption({
    action: (toolbarEvent) => {
      toolbarEvent.applySurround(`[carousel=${settings.carousel_software}]\n[image]`, "[/image]\n[/carousel]");
    },
    icon: 'fa-images',
    label: 'add_image_carousel'
  });
});
