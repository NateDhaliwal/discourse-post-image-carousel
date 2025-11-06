import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { concat, fn } from '@ember/helper';
import { action } from "@ember/object";
import { eq } from "truth-helpers";
import DModal from "discourse/components/d-modal";
import Form from "discourse/components/form";
import I18n, { i18n } from "discourse-i18n";

export default class CreateCarouselModal extends Component {
  @tracked formData = {
    images: []
  };

  constructor() {
    super(...arguments);
    const currentLocale = I18n.currentLocale();
    I18n.translations[currentLocale].js.composer.image_carousel_placeholder =
      `<img src="${settings.image_carousel_placeholder}" />`;
  }

  @action
  handleSubmit(data) {
    const toolbarEvent = this.args.model.toolbarEvent;
    // eslint-disable-next-line no-console
    console.log(data.images);
    if (settings.carousel_software === "Splide") {
      toolbarEvent.applySurround(
        `[wrap="Carousel" autoplay=${data.enable_autoplay !== undefined} interval=${data.enable_autoplay !== undefined && data.autoplay_interval > 1 ? data.autoplay_interval : false} loop=${data.enable_loop !== undefined}]\n`,
        "\n[/wrap]",
        "image_carousel_placeholder"
      );
    } else {
      toolbarEvent.applySurround(
        `[wrap="Carousel" autoplay=${data.enable_autoplay !== undefined} interval=${data.enable_autoplay !== undefined && data.autoplay_interval > 1 ? data.autoplay_interval : false} loop=${data.enable_loop !== undefined} thumbs=${data.enable_thumbs !== undefined} thumbs_loop=${data.enable_thumbs_loop !== undefined}]\n`,
        "\n[/wrap]",
        "image_carousel_placeholder"
      );
    }
    this.args.closeModal();
  }

  <template>
    <DModal
      @title={{i18n (themePrefix "carousel.modal.modal_title")}}
      @closeModal={{@closeModal}}
    >
      <:body>
        <Form @data={{this.formData}} @onSubmit={{this.handleSubmit}} as |form|>
          {{#if (eq settings.carousel_software "Swiper")}}
            <form.Field
              @name="enable_thumbs"
              @title="Enable thumbnails"
              @description={{i18n
                (themePrefix "carousel.modal.enable_thumbs_description")
              }}
              as |field|
            >
              <field.Toggle />
            </form.Field>
          {{/if}}

          <form.Field
            @name="enable_loop"
            @title="Enable loop"
            @description={{i18n
              (themePrefix "carousel.modal.enable_loop_description")
            }}
            as |field|
          >
            <field.Toggle />
          </form.Field>

          <form.Field
            @name="enable_thumbs_loop"
            @title="Enable thumbnail loop"
            @description={{i18n
              (themePrefix "carousel.modal.enable_thumbs_loop_description")
            }}
            as |field|
          >
            <field.Toggle />
          </form.Field>

          <form.Field
            @name="enable_autoplay"
            @title="Enable autoplay"
            @description={{i18n
              (themePrefix "carousel.modal.enable_autoplay_description")
            }}
            as |field|
          >
            <field.Toggle />
          </form.Field>

          <form.Field
            @name="autoplay_interval"
            @title="Autoplay interval"
            @description={{i18n
              (themePrefix "carousel.modal.autoplay_interval_description")
            }}
            as |field|
          >
            <field.Input @type="number" />
          </form.Field>

          <form.Button @action={{fn form.addItemToCollection "images" ""}}>
            Add image
          </form.Button>
          <form.Collection @name="images" as |collection index|>
            <collection.Field
              @name={{concat "image_" index}}
              @title={{concat "Image " index}}
              as |field|
            >
              <field.Image @type="composer" />
              <form.Button @action={{fn collection.remove index}}>
                Remove image
              </form.Button>
            </collection.Field>
          </form.Collection>

          <form.Submit />
        </Form>
      </:body>
    </DModal>
  </template>
}
