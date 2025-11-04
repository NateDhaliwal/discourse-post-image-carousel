import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { Input } from "@ember/component";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import DModal from "discourse/components/d-modal";
import DButton from "discourse/components/d-button";
import Form from "discourse/components/form";
import { i18n } from "discourse-i18n";

export default class CreateCarouselModal extends Component {
  @service appEvents;

  @action
  handleSubmit(data) {
    console.log(data.enable_thumbs);
    console.log(data.enable_loop);
    console.log(data.enable_autoplay);
    this.args.closeModal();
  }

  <template>
    <DModal @title={{i18n (themePrefix "carousel.modal.title")}} @closeModal={{@closeModal}}>
      <:body>
        <Form @onSubmit={{this.handleSubmit}} as |form|>
        <form.Field
          @name="enable_thumbs"
          @title="Enable thumbs"
          @validation="required"
          as |field|
        >
          <field.Toggle />
        </form.Field>

        <form.Field
          @name="enable_loop"
          @title="Enable loop"
          @validation="required"
          as |field|
        >
          <field.Toggle />
        </form.Field>

        <form.Field
          @name="enable_autoplay"
          @title="Enable autoplay"
          @validation="required"
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
