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
    
  }

  <template>
    <DModal @closeModal={{@closeModal}}>
    </DModal
  </template>
}
