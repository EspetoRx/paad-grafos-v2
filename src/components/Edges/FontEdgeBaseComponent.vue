<template>
  <p v-if="!checkboxValue" class="m-0 p-1">Ative para começar</p>
  <LabelWithTooltip
    v-if="checkboxValue"
    :labelValue="sendObject ? 'Enviando objeto' : 'Enviando String'"
    :tooltip="
      'Options.Edges.Font.' +
      capitalizeFirstLetter(accordionType) +
      ' (Toggle String/Object Sending) - Alterne entre o envio de string e de objeto.'
    "
    :forId="'font-string-sending-' + accordionType"
    :hasSwitch="true"
    :switchId="'font-string-sending-' + accordionType"
    :switchTooltip="
      'Options.Edges.Font.' +
      capitalizeFirstLetter(accordionType) +
      ' (Toggle String/Object Sending) - Alterne entre o envio de string e de objeto.'
    "
    :switchDisabled="false"
    :switchInitialValue="sendObject"
    :switchLabelEnabled="false"
    :switchTooltipEnabled="true"
    @checkbox-status-changed="sendObjectValue"
  ></LabelWithTooltip>
  <InputGroupWithLabel
    v-if="checkboxValue && !sendObject"
    :prepend="'Texto:'"
    :append="true"
    :inputType="'text'"
    :tooltip="
      'Options.Edges.Font.' +
      capitalizeFirstLetter(accordionType) +
      ' (String) - Esse objeto define os detalhes do rótulo . Um versão curta também é suportada na forma ' +
      ' \'size face color\' por exemplo \'14px arial red\'.'
    "
    :inputInitialValue="fontString"
    @input-value-change="changeFontString"
  ></InputGroupWithLabel>
  <InputGroupWithLabel
    v-if="checkboxValue && sendObject"
    :prepend="'Cor:'"
    :append="true"
    :inputType="'color'"
    :tooltip="
      'Options.Edges.Font.' +
      capitalizeFirstLetter(accordionType) +
      '.Color - A cor da letra modificada.'
    "
    :inputInitialValue="fontColor"
    @input-value-change="changeFontColor"
    :classes="'p-0 h-auto'"
  >
  </InputGroupWithLabel>
  <InputRange
    v-if="checkboxValue && sendObject"
    :inputId="'size-range-' + accordionType"
    :isLabelEnabled="true"
    :min="0"
    :max="100"
    :step="0.1"
    :initialValue="fontSize"
    :labelValue="'Tamanho do rótulo modificado:'"
    :tooltip="
      'Options.Edges.Font.' +
      capitalizeFirstLetter(accordionType) +
      '.Size - O tamanho do rótulo modificado.'
    "
    @update-value-from-range-input="changeFontSize"
  ></InputRange>
  <LabelWithTooltip
    v-if="checkboxValue && sendObject"
    :labelValue="'Face'"
    :tooltip="
      'Options.Edges.Font.' +
      capitalizeFirstLetter(accordionType) +
      '.Face - O estilo da fonte do texto.'
    "
    :forId="'options-edges-font-face-' + accordionType"
    :hasSwitch="false"
  ></LabelWithTooltip>
  <InputSelect
    :selectId="'options-edges-font-face-' + accordionType"
    v-if="checkboxValue && sendObject"
    :options="fontChoices"
    @update-selection="changeFace"
  ></InputSelect>
  <InputGroupWithLabel
    v-if="checkboxValue && sendObject"
    :prepend="'Modificador:'"
    :append="true"
    :inputType="'text'"
    :tooltip="
      'Options.Edges.Font.' +
      capitalizeFirstLetter(accordionType) +
      '.Mod - Uma string adicionada à face e ao tamanho ao determinar a fonte em negrito no texto do rótulo.'
    "
    :inputInitialValue="fontMod"
    @input-value-change="changeFontMod"
  >
  </InputGroupWithLabel>
  <InputRange
    v-if="checkboxValue && sendObject"
    :inputId="'vadjust-range-' + accordionType"
    :isLabelEnabled="true"
    :min="-100"
    :max="100"
    :step="0.1"
    :initialValue="fontVadjust"
    :labelValue="'Ajuste vertical:'"
    :tooltip="
      'Options.Edges.Font.' +
      capitalizeFirstLetter(accordionType) +
      '.Vadjust - Uma correção específica da fonte para o posicionamento vertical da fonte em negrito no texto do rótulo. (Positivo está inativo.) O padrão é valign da fonte base.'
    "
    @update-value-from-range-input="changeVadjust"
  ></InputRange>
</template>
<script>
import InputGroupWithLabel from "../Common/Inputs/InputGroupWithLabel.vue";
import LabelWithTooltip from "../Common/LabelWithTooltip.vue";
import InputRange from "../Common/Inputs/InputRange.vue";
import InputSelect from "../Common/Inputs/InputSelect.vue";
export default {
  name: "Font Edge Base Component",
  props: [
    "checkboxValue",
    "openBsModal",
    "bsModalReturnValue",
    "accordionType",
    "options",
  ],
  data() {
    return {
      fontChoices: [
        {
          value: "arial",
          label: "Arial",
          selected: this.accordionType != "mono" ? true : false,
        },
        { value: "verdana", label: "Verdana", selected: false },
        { value: "tahoma", label: "Tahoma", selected: false },
        { value: "Trebuchet MS", label: "Trebuchet MS", selected: false },
        { value: "Times New Roman", label: "Times New Roman", selected: false },
        { value: "Georgia", label: "Georgia", selected: false },
        { value: "Geramond", label: "Geramond", selected: false },
        {
          value: "Courier New",
          label: "Courier New",
          selected: this.accordionType == "mono" ? true : false,
        },
        { value: "Brush Script MT", label: "Brush Script MT", selected: false },
      ],
      sendObject: false,
      fontString:
        this.accordionType == "mono" ? "16px Courier black" : "14px arial black",
      fontColor: "#000000",
      fontSize: this.accordionType == "mono" ? "16" : "14",
      fontFace: this.accordionType == "mono" ? "Courier New" : "arial",
      fontMod:
        this.accordionType == "bold" || this.accordionType == "boldital" ? "bold" : "",
      fontVadjust: "0",
      justStarted: false,
    };
  },
  watch: {
    options: {
      handler: function (newValue, oldValue) {
        this.setValues(newValue, oldValue);
      },
      deep: true,
    },
  },
  methods: {
    capitalizeFirstLetter: function (val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    },
    sendObjectValue: function (val) {
      this.sendObject = val;
      if (val) {
        this.$emit("message", "options-edges-font-object-sending", this.accordionType, {
          color: this.fontColor,
          size: parseInt(this.fontSize),
          face: this.fontFace,
          mod: this.fontMod,
          vadjust: parseInt(this.fontVadjust),
        });
      } else {
        this.$emit(
          "message",
          "options-edges-font-object-sending",
          this.accordionType,
          ""
        );
      }
    },
    changeFontString: function (val) {
      this.fontString = val;
      if (!this.justStarted)
        this.$emit("message", "options-edges-font-string", this.accordionType, val);
    },
    changeFontColor: function (val) {
      this.fontColor = val;
      if (!this.justStarted)
        this.$emit("message", "options-edges-font-color", this.accordionType, val);
    },
    changeFontSize: function (val) {
      this.fontSize = val;
      if (!this.justStarted)
        this.$emit("message", "options-edges-font-size", this.accordionType, val);
    },
    changeFace: function (val) {
      this.fontFace = val;
      if (!this.justStarted)
        this.$emit("message", "options-edges-font-face", this.accordionType, val);
    },
    changeFontMod: function (val) {
      this.fontMod = val;
      if (!this.justStarted)
        this.$emit("message", "options-edges-font-mod", this.accordionType, val);
    },
    changeVadjust: function (val) {
      this.fontVadjust = val;
      if (!this.justStarted)
        this.$emit("message", "options-edges-font-vadjust", this.accordionType, val);
    },
    setValues(newValue, oldValue) {
      if ("edges" in newValue && typeof newValue.edges == "object") {
        if ("font" in newValue.edges && typeof newValue.edges.font == "object") {
          if ("bold" in newValue.edges.font) {
            if (
              typeof newValue.edges.font.bold == "object" &&
              this.accordionType == "bold"
            ) {
              if (Object.keys(newValue.edges.font.bold).length != 0) {
                this.sendObject = true;
                if ("color" in newValue.edges.font.bold) {
                  this.fontColor = newValue.edges.font.bold.color;
                }
                if ("size" in newValue.edges.font.bold) {
                  this.fontSize = newValue.edges.font.bold.size;
                }
                if ("face" in newValue.edges.font.bold) {
                  this.fontChoices.forEach((element, index, array) => {
                    if (element.value == newValue.edges.font.bold.face) {
                      element.selected = true;
                    } else {
                      element.selected = false;
                    }
                  });
                  this.fontFace = newValue.edges.font.bold.face;
                }
                if ("mod" in newValue.edges.font.bold) {
                  this.fontMod = newValue.edges.font.bold.mod;
                }
                if ("vadjust" in newValue.edges.font.bold) {
                  this.fontVadjust = newValue.edges.font.bold.vadjust;
                }
              }
            }
            if (
              typeof newValue.edges.font.bold == "string" &&
              this.accordionType == "bold"
            ) {
              this.sendObject = false;
              this.fontString = newValue.edges.font.bold;
            }
          }
          if ("boldital" in newValue.edges.font) {
            if (
              typeof newValue.edges.font.boldital == "object" &&
              this.accordionType == "boldital"
            ) {
              if (Object.keys(newValue.edges.font.boldital).length != 0) {
                this.sendObject = true;
                if ("color" in newValue.edges.font.boldital) {
                  this.fontColor = newValue.edges.font.boldital.color;
                }
                if ("size" in newValue.edges.font.boldital) {
                  this.fontSize = newValue.edges.font.boldital.size;
                }
                if ("face" in newValue.edges.font.boldital) {
                  this.fontChoices.forEach((element, index, array) => {
                    if (element.value == newValue.edges.font.boldital.face) {
                      element.selected = true;
                    } else {
                      element.selected = false;
                    }
                  });
                  this.fontFace = newValue.edges.font.boldital.face;
                }
                if ("mod" in newValue.edges.font.boldital) {
                  this.fontMod = newValue.edges.font.boldital.mod;
                }
                if ("vadjust" in newValue.edges.font.boldital) {
                  this.fontVadjust = newValue.edges.font.boldital.vadjust;
                }
              }
            }
            if (
              typeof newValue.edges.font.boldital == "string" &&
              this.accordionType == "boldital"
            ) {
              this.sendObject = false;
              this.fontString = newValue.edges.font.boldital;
            }
          }
          if ("ital" in newValue.edges.font) {
            if (
              typeof newValue.edges.font.ital == "object" &&
              this.accordionType == "ital"
            ) {
              if (Object.keys(newValue.edges.font.ital).length != 0) {
                this.sendObject = true;
                if ("color" in newValue.edges.font.ital) {
                  this.fontColor = newValue.edges.font.ital.color;
                }
                if ("size" in newValue.edges.font.ital) {
                  this.fontSize = newValue.edges.font.ital.size;
                }
                if ("face" in newValue.edges.font.ital) {
                  this.fontChoices.forEach((element, index, array) => {
                    if (element.value == newValue.edges.font.ital.face) {
                      element.selected = true;
                    } else {
                      element.selected = false;
                    }
                  });
                  this.fontFace = newValue.edges.font.ital.face;
                }
                if ("mod" in newValue.edges.font.ital) {
                  this.fontMod = newValue.edges.font.ital.mod;
                }
                if ("vadjust" in newValue.edges.font.ital) {
                  this.fontVadjust = newValue.edges.font.ital.vadjust;
                }
              }
            }
            if (
              typeof newValue.edges.font.ital == "string" &&
              this.accordionType == "ital"
            ) {
              this.sendObject = false;
              this.fontString = newValue.edges.font.ital;
            }
          }
          if ("mono" in newValue.edges.font) {
            if (
              typeof newValue.edges.font.mono == "object" &&
              this.accordionType == "mono"
            ) {
              if (Object.keys(newValue.edges.font.mono).length != 0) {
                this.sendObject = true;
                if ("color" in newValue.edges.font.mono) {
                  this.fontColor = newValue.edges.font.mono.color;
                }
                if ("size" in newValue.edges.font.mono) {
                  this.fontSize = newValue.edges.font.mono.size;
                }
                if ("face" in newValue.edges.font.mono) {
                  this.fontChoices.forEach((element, index, array) => {
                    if (element.value == newValue.edges.font.mono.face) {
                      element.selected = true;
                    } else {
                      element.selected = false;
                    }
                  });
                  this.fontFace = newValue.edges.font.mono.face;
                }
                if ("mod" in newValue.edges.font.mono) {
                  this.fontMod = newValue.edges.font.mono.mod;
                }
                if ("vadjust" in newValue.edges.font.mono) {
                  this.fontVadjust = newValue.edges.font.mono.vadjust;
                }
              }
            }
            if (
              typeof newValue.edges.font.mono == "string" &&
              this.accordionType == "mono"
            ) {
              this.sendObject = false;
              this.fontString = newValue.edges.font.mono;
            }
          }
        }
      }
    },
  },
  components: {
    LabelWithTooltip,
    InputGroupWithLabel,
    InputRange,
    InputSelect,
  },
  mounted() {
    this.justStarted = true;
    console.log("Font Edge Base Component Mounted.");
    this.setValues(this.options, this.options);
    setTimeout(
      function () {
        this.justStarted = false;
      }.bind(this),
      5
    );
  },
  emits: ["message", "open-bs-modal"],
};
</script>
