import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { Input } from "@ember/component";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import DModal from "discourse/components/d-modal";
import DButton from "discourse/components/d-button";
import Form from "discourse/components/form";
import I18n from "discourse-i18n";
import { i18n } from "discourse-i18n";

export default class CreateCarouselModal extends Component {
  constructor() {
    super(...arguments);
    const currentLocale = I18n.currentLocale();
    I18n.translations[currentLocale].js.composer.image_carousel_placeholder = `<img src="${settings.image_carousel_placeholder}" />`;
  }

  @action
  handleSubmit(data) {
    console.log(data);
    const toolbarEvent = this.args.model.toolbarEvent;
    toolbarEvent.applySurround(
      `[wrap="Carousel" autoplay=${data.enable_autoplay?} interval=${(data.enable_autoplay && data.autoplay_interval > 1) ? data.autoplay_interval : false} loop=${data.enable_loop?} thumbs=${data.enable_thumbs?}]\n`,
      "\n[/wrap]",
      "image_carousel_placeholder"
    );
    this.args.closeModal();
  }

  <template>
    <DModal @title={{i18n (themePrefix "carousel.modal.modal_title")}} @closeModal={{@closeModal}}>
      <:body>
        <Form @onSubmit={{this.handleSubmit}} as |form|>
        <form.Field
          @name="enable_thumbs"
          @title="Enable thumbnails"
          as |field|
        >
          <field.Toggle />
        </form.Field>

        <form.Field
          @name="enable_loop"
          @title="Enable loop"
          as |field|
        >
          <field.Toggle />
        </form.Field>

        <form.Field
          @name="enable_autoplay"
          @title="Enable autoplay"
          as |field|
        >
          <field.Toggle />
        </form.Field>
  
        <form.Field @name="autoplay_interval" @title="Autoplay interval" as |field|>
          <field.Input @type="number" />
        </form.Field>
  
        <form.Submit />
      </Form>
      </:body>
    </DModal>
  </template>
}
