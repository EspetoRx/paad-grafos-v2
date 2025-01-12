<template>
  <p v-if="!checkboxValue">Ative para começar</p>
  <InputTextArea
    v-if="sendingFunction"
    :inputId="'options.manipulation.editNodeFunction'"
    :inputEnabled="editNodeFunctionEditingEnabled"
    :inputInitialValue="editNodeFunctionText"
    :inputPlaceholder="'//JS para editar vértices'"
    :inputRows="5"
    :isLabelEnabled="true"
    :labelValue="''"
    :tooltip="'Options.Manipulation.editNode Function Sending - A edição de vértices só é possível quando uma função de gestão é fornecida. Se este não for o caso, a edição de vértices será desativada. A função será chamada quando um vértice for selecionado e o botão \'Editar vértice\' na barra de ferramentas for pressionado. Essa função será chamada como a função addNode com os dados do vértice e uma função de retorno de chamada.'"
    :hasSwitch="true"
    :switchId="'options.manipulation.editNodeFunction.switch'"
    :switchTooltip="'Options.Manipulation.editNode Function Editing Enabled - Ative ou desative a edição da função de Edição de vértices.'"
    :switchDisabled="false"
    :switchInitialValue="editNodeFunctionEditingEnabled"
    :switchLabelEnabled="true"
    :switchLabelValue="'Habilitar edição da função'"
    @input-value-change="changeEditNodeFunction"
    @checkbox-value-change="changeEditNodeFunctionEditing"
  ></InputTextArea>
  <button
    type="button"
    class="btn btn-primary btn-sm form-control mt-2"
    v-if="editNodeFunctionEditingEnabled"
    @click.prevent="sendUpdateNodeFunction"
  >
    <i class="fa-solid fa-right-to-bracket"></i> Enviar Função
  </button>
</template>
<script>
import LabelWithTooltip from "../Common/LabelWithTooltip.vue";
import InputTextArea from "../Common/Inputs/InputTextArea.vue";
export default {
  name: "Edit Node Base Component",
  props: ["checkboxValue", "bsModalReturnValue", "accordionType", "options"],
  data() {
    return {
      sendingFunction: false,
      editNodeFunctionEditingEnabled: false,
      editNodeFunction: null,
      editNodeFunctionText: "",
    };
  },
  methods: {
    changeEditNodeFunction: function (value) {
      this.editNodeFunctionText = value;
    },
    changeEditNodeFunctionEditing: function (value) {
      this.editNodeFunctionEditingEnabled = value;
      if (value) {
        this.$emit("message", "send-toast", {
          toastTitle: "Cuidado",
          toastIcon: "fa-circle-exclamation",
          toastBody:
            "O input de Javascript pode levar a erros e a travamentos da aplicação. Use com cautela!",
          toastClasses: " bg-danger text-black",
        });
      }
    },
    sendUpdateNodeFunction: function (t) {
      if (t != undefined && typeof t == "string") {
        this.editNodeFunctionText = t;
        this.editNodeFunction = eval(t);
      } else {
        this.editNodeFunction = eval(this.editNodeFunctionText);
      }
      if (this.editNodeFunction != null) {
        this.$emit(
          "message",
          "options-manipulation-editNode-function",
          this.accordionType,
          this.editNodeFunction
        );
      }
      this.editNodeFunctionEditingEnabled = false;
    },
  },
  mounted() {
    console.log("Edit Node Base Component Mounted");
  },
  watch: {
    checkboxValue: function (newValue, oldValue) {
      this.sendingFunction = newValue;
      if (newValue) {
        if (this.editNodeFunctionText != "") {
          this.editNodeFunction = eval(this.editNodeFunctionText);
          this.sendUpdateNodeFunction(this.editNodeFunction);
        } else {
          import("./Scripts/EditNodeHelpScript.js?raw")
            .then((res) => res.default)
            .then((t) => {
              this.sendUpdateNodeFunction(t);
            });
        }
      }
    },
    "options": function(newValue, oldValue) {
      if (newValue != null) {
        if (
          newValue.manipulation != null &&
          newValue.manipulation.editNode != null &&
          typeof newValue.manipulation.editNode == "function"
        ) {
          this.editNodeFunction = this.options.manipulation.editNode;
          this.editNodeFunctionText = this.options.manipulation.editNode;
          this.sendingFunction = true;
        }
      }
    }
  },
  components: {
    LabelWithTooltip,
    InputTextArea,
  },
  emits: ["message", "open-bs-modal", "send-toast"],
};
</script>
