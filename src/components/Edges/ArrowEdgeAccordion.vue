<template>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-warning" v-if="!checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Ative Setas para começar
  </p>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-danger" v-if="checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Desativar Setas repinta canvas
  </p>
  <LabelWithTooltip
    v-if="checkboxValue"
    :labelValue="`${
      switchObjectEnabled ? `Enviando objeto para setas` : `Enviando 'string' para setas`
    }`"
    :tooltip="
      'Options.Edges.Arrows (Toggle string/object sending) - Alterne entre envio de string e de objeto para o campo.' +
      ' Options.Edges.Arrows (String) - Para desenhar uma seta com configurações padrão, uma string pode ser fornecida. Por ' +
      'exemplo: <code>arrows:\'to, from, middle\'</code> ou <code>\'to;from\'</code>' +
      ', qualquer combinação com qualquer símbolo separador está bem.'
    "
    :forId="'options.edges.arrows.string.select.switch'"
    :hasSwitch="true"
    :switchId="'options.edges.arrows.string.select.switch'"
    :switchTooltip="false"
    :switchDisabled="false"
    :switchInitialValue="switchObjectEnabled"
    :switchLabelEnabled="false"
    @checkbox-status-changed="changeObjectSending"
  ></LabelWithTooltip>
  <InputSelect
    v-if="checkboxValue && !switchObjectEnabled"
    :options="optionsArrowsType"
    :disabled="false"
    :selectId="'options.edges.arrows.string.select'"
    @update-selection="changeArrowsString"
  ></InputSelect>
  <div class="p-1" v-if="checkboxValue && switchObjectEnabled">
    <Accordion
      :accordionData="accordionData"
      @message="message"
      @open-bs-modal="openBsModal"
      :bsModalReturnValue="bsModalReturnValue"
      :options="options"
    ></Accordion>
  </div>
</template>
<script>
import InputGroupWithLabel from "../Common/Inputs/InputGroupWithLabel.vue";
import SwitchWithInfo from "../Common/SwitchWithInfo.vue";
import LabelWithTooltip from "../Common/LabelWithTooltip.vue";
import InputSelect from "../Common/Inputs/InputSelect.vue";

export default {
  name: "Arrow Edge Accordion",
  props: {
    checkboxValue: Boolean,
    bsModalReturnValue: {},
    accordionType: String,
    options: Object,
  },
  data() {
    return {
      switchObjectEnabled: false,
      arrowsString: "",
      invalidArrowsString: false,
      arrowObject: {},
      accordionData: [
        {
          id: "from",
          title: "Setas De (From)",
          body: "ArrowsEdgeBaseComponent",
          tooltip: "Options.Edges.Arrows.From - Altere informações das setas de 'de'.",
          checkboxValue: false,
        },
        {
          id: "middle",
          title: "Setas Ao Meio (Middle)",
          body: "ArrowsEdgeBaseComponent",
          tooltip:
            "Options.Edges.Arrows.Middle - Altere informações das setas de 'meio'.",
          checkboxValue: false,
        },
        {
          id: "to",
          title: "Setas Para (To)",
          body: "ArrowsEdgeBaseComponent",
          tooltip: "Options.Edges.Arrows.To - Altere informações das setas de 'para'.",
          checkboxValue: false,
        },
      ],
      optionsArrowsType: [
        { value: "to", label: "Para", selected: true },
        { value: "from", label: "De", selected: false },
        { value: "middle", label: "Meio", selected: false },
        { value: "to;from", label: "Para, De", selected: false },
        { value: "to;middle", label: "Para, Meio", selected: false },
        { value: "to;from;middle", label: "Para, De, Meio", selected: false },
        { value: "middle;from", label: "Meio, De", selected: false },
      ],
    };
  },
  mounted() {
    console.log("Arrow Edge Accordion Component Mounted");
    this.accordionData.push();
  },
  methods: {
    changeObjectSending: function (value) {
      this.switchObjectEnabled = value;
      if (value) {
        switch (this.arrowsString) {
          case "to": {
            this.arrowObject.from = { enabled: false };
            this.arrowObject.middle = { enabled: false };
            this.arrowObject.to = { enabled: true };
            this.accordionData[0].checkboxValue = false;
            this.accordionData[1].checkboxValue = false;
            this.accordionData[2].checkboxValue = true;
            break;
          }
          case "from": {
            this.arrowObject.from = { enabled: true };
            this.arrowObject.middle = { enabled: false };
            this.arrowObject.to = { enabled: false };
            this.accordionData[0].checkboxValue = true;
            this.accordionData[1].checkboxValue = false;
            this.accordionData[2].checkboxValue = false;
            break;
          }
          case "middle": {
            this.arrowObject.from = { enabled: false };
            this.arrowObject.middle = { enabled: true };
            this.arrowObject.to = { enabled: false };
            this.accordionData[0].checkboxValue = false;
            this.accordionData[1].checkboxValue = true;
            this.accordionData[2].checkboxValue = false;
            break;
          }
          case "to;from": {
            this.arrowObject.to = { enabled: true };
            this.arrowObject.middle = { enabled: false };
            this.arrowObject.from = { enabled: true };
            this.accordionData[0].checkboxValue = true;
            this.accordionData[1].checkboxValue = false;
            this.accordionData[2].checkboxValue = true;
            break;
          }
          case "to;middle": {
            this.arrowObject.to = { enabled: true };
            this.arrowObject.middle = { enabled: true };
            this.arrowObject.from = { enabled: false };
            this.accordionData[0].checkboxValue = true;
            this.accordionData[1].checkboxValue = true;
            this.accordionData[2].checkboxValue = false;
            break;
          }
          case "to;from;middle": {
            this.arrowObject.to = { enabled: true };
            this.arrowObject.middle = { enabled: true };
            this.arrowObject.from = { enabled: true };
            this.accordionData[0].checkboxValue = true;
            this.accordionData[1].checkboxValue = true;
            this.accordionData[2].checkboxValue = true;
            break;
          }
          case "middle;from": {
            this.arrowObject.to = { enabled: false };
            this.arrowObject.from = { enabled: true };
            this.arrowObject.middle = { enabled: true };
            this.accordionData[0].checkboxValue = false;
            this.accordionData[1].checkboxValue = true;
            this.accordionData[2].checkboxValue = true;
            break;
          }
        }
        this.$emit("message", "arrows-object", this.accordionType, this.arrowObject);
      } else {
        this.arrowsString = "";
        if (typeof this.arrowObject.to == "object") {
          if (this.arrowObject.to.enabled) {
            this.arrowsString += "to";
          }
        }
        if (typeof this.arrowObject.from == "object") {
          if (!this.arrowObject.to.enabled) {
            if (this.arrowObject.from.enabled) {
              this.arrowsString += "from";
            }
          } else {
            if (this.arrowObject.from.enabled) {
              this.arrowsString += ";from";
            }
          }
        }
        if (typeof this.arrowObject.middle == "object") {
          if (!this.arrowObject.to.enabled && !this.arrowObject.from.enabled) {
            if (this.arrowObject.middle.enabled) {
              this.arrowsString += "middle";
            }
          } else {
            if (this.arrowObject.middle.enabled) {
              this.arrowsString += ";middle";
            }
          }
        }
        this.optionsArrowsType.forEach((element) => {
          if (element.id == this.arrowsString) {
            element.selected = true;
          } else {
            element.selected = false;
          }
        });
        this.$emit(
          "message",
          "arrow-string-changed",
          this.accordionType,
          this.arrowsString
        );
      }
    },

    changeArrowsString: function (value) {
      this.arrowsString = value;
      this.$emit("message", "arrow-string-changed", this.accordionType, value);
    },

    message: function (message, accordionItem, value) {
      if (message == "update-checkbox-accordion") {
        this.$emit(
          "message",
          "options-edges-arrows-" + accordionItem + "-enabled",
          this.accordionType,
          value
        );
      }
      if (message == "toggle-image-height-enabled") {
        this.$emit(
          "message",
          "options-edges-arrows-" + accordionItem + "-image-height-enabled",
          this.accordionType,
          value
        );
      }
      if (message == "image-height-value") {
        this.$emit(
          "message",
          "options-edges-arrows-" + accordionItem + "-image-height-value",
          this.accordionType,
          value
        );
      }
      if (message == "toggle-image-width-enabled") {
        this.$emit(
          "message",
          "options-edges-arrows-" + accordionItem + "-image-width-enabled",
          this.accordionType,
          value
        );
      }
      if (message == "image-width-value") {
        this.$emit(
          "message",
          "options-edges-arrows-" + accordionItem + "-image-width-value",
          this.accordionType,
          value
        );
      }
      if (message == "scale-factor") {
        this.$emit(
          "message",
          "options-edges-arrows-" + accordionItem + "-scale-factor",
          this.accordionType,
          value
        );
      }
      if (message == "type") {
        this.$emit(
          "message",
          "options-edges-arrows-" + accordionItem + "-type",
          this.accordionType,
          value
        );
      }
      if (message == "src") {
        this.$emit(
          "message",
          "options-edges-arrows-" + accordionItem + "-src",
          this.accordionType,
          value
        );
      }
    },
    openBsModal: function (title, body) {
      this.$emit("open-bs-modal", title, body);
    },
  },
  watch: {
    options: {
      handler: function (newValue, oldValue) {
        if (typeof newValue.edges == "object") {
          if (typeof newValue.edges.arrows == "string") {
            this.switchObjectEnabled = false;
            this.optionsArrowsType.forEach((element) => {
              if (element.value == newValue.edges.arrows) {
                element.selected = true;
              } else {
                element.selected = false;
              }
            });
            this.arrowsString = newValue.edges.arrows;
          } else if (typeof newValue.edges.arrows == "object") {
            this.switchObjectEnabled = true;
            if (typeof newValue.edges.arrows.to == "object") {
              if (typeof newValue.edges.arrows.to.enabled == "boolean") {
                if (typeof this.arrowObject.to != "object") {
                  this.arrowObject.to = newValue.edges.arrows.to;
                }
                this.arrowObject.to.enabled = newValue.edges.arrows.to.enabled;
                this.accordionData[2].checkboxValue = newValue.edges.arrows.to.enabled;
              }
            }
            if (typeof newValue.edges.arrows.middle == "object") {
              if (typeof newValue.edges.arrows.middle.enabled == "boolean") {
                if (typeof this.arrowObject.middle != "object") {
                  this.arrowObject.middle = newValue.edges.arrows.middle;
                }
                this.arrowObject.middle.enabled = newValue.edges.arrows.middle.enabled;
                this.accordionData[1].checkboxValue =
                  newValue.edges.arrows.middle.enabled;
              }
            }
            if (typeof newValue.edges.arrows.from == "object") {
              if (typeof newValue.edges.arrows.from.enabled == "boolean") {
                if (typeof this.arrowObject.from != "object") {
                  this.arrowObject.from = newValue.edges.arrows.from;
                }
                this.arrowObject.from.enabled = newValue.edges.arrows.from.enabled;
                this.accordionData[0].checkboxValue = newValue.edges.arrows.from.enabled;
              }
            }
          }
        }
      },
      deep: true,
    },
  },
  components: {
    SwitchWithInfo,
    InputGroupWithLabel,
    LabelWithTooltip,
    InputSelect,
  },
  emits: ["message", "open-bs-modal"],
};
</script>
