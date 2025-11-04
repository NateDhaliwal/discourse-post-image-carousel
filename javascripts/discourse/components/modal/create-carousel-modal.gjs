import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { Input } from "@ember/component";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import DModal from "discourse/components/d-modal";
import DButton from "discourse/components/d-button";
import Form from "discourse/components/form";
import { i18n, I18n } from "discourse-i18n";

export default class CreateCarouselModal extends Component {
  @service appEvents;

  @action
  handleSubmit(data) {
    const toolbarEvent = this.args.model.toolbarEvent;
    toolbarEvent.applySurround();
    this.args.closeModal();
  }

  <template>
    <DModal @title={{i18n (themePrefix "carousel.modal.modal_title")}} @closeModal={{@closeModal}}>
      <:body>
        <Form @onSubmit={{this.handleSubmit}} as |form|>
        <form.Field
          @name="enable_thumbs"
          @title="Enable thumbs"
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
