<template>
  <p v-if="!checkboxValue">Ative para começar</p>
  <LabelWithTooltip
    v-if="checkboxValue"
    :labelValue="`Enviando ${
      sendingFunction == false ? ' booleano verdadeiro' : ' função'
    }`"
    :tooltip="
      'Options.Manipulation.DeleteNode (Toggle boolean/function) - Alterne o envio de booleano e função para o Adicionar Vértice. ' +
      `Se booleano, alterna a exclusão de nós na GUI. Se função, será chamado quando um nó for selecionado e o botão 'Excluir selecionado' for pressionado. Ao usar uma função, ele receberá um retorno de chamada e um objeto com uma matriz de nodeIds selecionados e uma matriz de edge Ids selecionados. Esses são os itens que serão excluídos se o retorno de chamada for executado.`
    "
    :forId="'options-manipulation-deleteNode-toggle'"
    :hasSwitch="true"
    :switchId="'options-manipulation-deleteNode-toggle'"
    :switchDisabled="false"
    :switchInitialValue="sendingFunction"
    :switchLabelEnabled="false"
    :switchTooltipEnabled="false"
    @checkbox-status-changed="changeManipulationObjectSending"
  ></LabelWithTooltip>
  <InputTextArea
    v-if="sendingFunction"
    :inputId="'options.manipulation.deleteNodeFunction'"
    :inputEnabled="deleteNodeFunctionEditingEnabled"
    :inputInitialValue="deleteNodeFunctionText"
    :inputPlaceholder="'//JS para adicionar vértices'"
    :inputRows="5"
    :isLabelEnabled="true"
    :labelValue="''"
    :tooltip="'Options.Manipulation.deleteNode Function Sending - ' + `Se booleano, alterna a exclusão de nós na GUI. Se função, será chamado quando um nó for selecionado e o botão 'Excluir selecionado' for pressionado. Ao usar uma função, ele receberá um retorno de chamada e um objeto com uma matriz de nodeIds selecionados e uma matriz de edge Ids selecionados. Esses são os itens que serão excluídos se o retorno de chamada for executado.`"
    :hasSwitch="true"
    :switchId="'options.manipulation.deleteNodeFunction.switch'"
    :switchTooltip="'Options.Manipulation.deleteNode Function Editing Enabled - Ative ou desative a edição da função de Adição de vértices.'"
    :switchDisabled="false"
    :switchInitialValue="deleteNodeFunctionEditingEnabled"
    :switchLabelEnabled="true"
    :switchLabelValue="'Habilitar edição da função'"
    @input-value-change="changeDeleteNodeFunction"
    @checkbox-value-change="changeDeleteNodeFunctionEditing"
  ></InputTextArea>
  <button
    type="button"
    class="btn btn-primary btn-sm form-control mt-2"
    v-if="deleteNodeFunctionEditingEnabled"
    @click.prevent="sendUpdateNodeFunction"
  >
    <i class="fa-solid fa-right-to-bracket"></i> Enviar Função
  </button>
</template>
<script>
import LabelWithTooltip from "../Common/LabelWithTooltip.vue";
import InputTextArea from "../Common/Inputs/InputTextArea.vue";
export default {
  name: "Delete Node Base Component",
  props: ["checkboxValue", "bsModalReturnValue", "accordionType", "options"],
  data() {
    return {
      sendingFunction: false,
      deleteNodeFunctionEditingEnabled: false,
      deleteNodeFunction: null,
      deleteNodeFunctionText: "",
    };
  },
  methods: {
    changeManipulationObjectSending: function (value) {
      this.sendingFunction = value;
      if (!value) {
        this.$emit(
          "message",
          "options-manipulation-deleteNode-booelan",
          this.accordionType,
          true
        );
      } else if (this.deleteNodeFunctionText != "") {
        this.deleteNodeFunction = eval(this.deleteNodeFunctionText);
        this.$emit(
          "message",
          "options-manipulation-deleteNode-function",
          this.accordionType,
          this.deleteNodeFunction
        );
      } else {
        import("./Scripts/DeleteNodeHelpScript.js?raw")
          .then((res) => res.default)
          .then((t) => {
            this.sendUpdateNodeFunction(t);
          });
      }
    },
    changeDeleteNodeFunction: function (value) {
      this.deleteNodeFunctionText = value;
    },
    changeDeleteNodeFunctionEditing: function (value) {
      this.deleteNodeFunctionEditingEnabled = value;
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
        this.deleteNodeFunctionText = t;
        this.deleteNodeFunction = eval(t);
      } else {
        this.deleteNodeFunction = eval(this.deleteNodeFunctionText);
      }
      if (this.deleteNodeFunction != null) {
        this.$emit(
          "message",
          "options-manipulation-deleteNode-function",
          this.accordionType,
          this.deleteNodeFunction
        );
      }
      this.deleteNodeFunctionEditingEnabled = false;
    },
  },
  mounted() {
    console.log("Delete Node Base Component Mounted");
  },
  watch: {
    options: function (newValue, oldValue) {
      if (newValue != null) {
        if (
          newValue.manipulation != null &&
          newValue.manipulation.deleteNode != null &&
          typeof newValue.manipulation.deleteNode == "function"
        ) {
          this.deleteNodeFunction = this.options.manipulation.deleteNode;
          this.deleteNodeFunctionText = this.options.manipulation.deleteNode;
          this.sendingFunction = true;
        }
      }
    },
  },
  components: {
    LabelWithTooltip,
    InputTextArea,
  },
  emits: ["message", "open-bs-modal", "send-toast"],
};
</script>
