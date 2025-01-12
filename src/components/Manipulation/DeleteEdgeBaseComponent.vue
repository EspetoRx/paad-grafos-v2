<template>
  <p v-if="!checkboxValue">Ative para começar</p>
  <LabelWithTooltip
    v-if="checkboxValue"
    :labelValue="`Enviando ${
      sendingFunction == false ? ' booleano verdadeiro' : ' função'
    }`"
    :tooltip="
      'Options.Manipulation.DeleteEdge (Toggle boolean/function) - Alterne o envio de booleano e função para o Adicionar Vértice. ' +
      `Se booleano, alterna a exclusão de nós na GUI. Se função, será chamado quando um nó for selecionado e o botão 'Excluir selecionado' for pressionado. Ao usar uma função, ele receberá um retorno de chamada e um objeto com uma matriz de nodeIds selecionados e uma matriz de edge Ids selecionados. Esses são os itens que serão excluídos se o retorno de chamada for executado.`
    "
    :forId="'options-manipulation-deleteEdge-toggle'"
    :hasSwitch="true"
    :switchId="'options-manipulation-deleteEdge-toggle'"
    :switchDisabled="false"
    :switchInitialValue="sendingFunction"
    :switchLabelEnabled="false"
    :switchTooltipEnabled="false"
    @checkbox-status-changed="changeManipulationObjectSending"
  ></LabelWithTooltip>
  <InputTextArea
    v-if="sendingFunction"
    :inputId="'options.manipulation.deleteEdgeFunction'"
    :inputEnabled="deleteEdgeFunctionEditingEnabled"
    :inputInitialValue="deleteEdgeFunctionText"
    :inputPlaceholder="'//JS para adicionar vértices'"
    :inputRows="5"
    :isLabelEnabled="true"
    :labelValue="''"
    :tooltip="'Options.Manipulation.deleteEdge Function Sending - ' + `Se booleano, alterna a exclusão de nós na GUI. Se função, será chamado quando um nó for selecionado e o botão 'Excluir selecionado' for pressionado. Ao usar uma função, ele receberá um retorno de chamada e um objeto com uma matriz de nodeIds selecionados e uma matriz de edge Ids selecionados. Esses são os itens que serão excluídos se o retorno de chamada for executado.`"
    :hasSwitch="true"
    :switchId="'options.manipulation.deleteEdgeFunction.switch'"
    :switchTooltip="'Options.Manipulation.deleteEdge Function Editing Enabled - Ative ou desative a edição da função de Adição de vértices.'"
    :switchDisabled="false"
    :switchInitialValue="deleteEdgeFunctionEditingEnabled"
    :switchLabelEnabled="true"
    :switchLabelValue="'Habilitar edição da função'"
    @input-value-change="changeDeleteEdgeFunction"
    @checkbox-value-change="changeDeleteEdgeFunctionEditing"
  ></InputTextArea>
  <button
    type="button"
    class="btn btn-primary btn-sm form-control mt-2"
    v-if="deleteEdgeFunctionEditingEnabled"
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
      deleteEdgeFunctionEditingEnabled: false,
      deleteEdgeFunction: null,
      deleteEdgeFunctionText: "",
    };
  },
  methods: {
    changeManipulationObjectSending: function (value) {
      this.sendingFunction = value;
      if (!value) {
        this.$emit(
          "message",
          "options-manipulation-deleteEdge-booelan",
          this.accordionType,
          true
        );
      } else if (this.deleteEdgeFunctionText != "") {
        this.deleteEdgeFunction = eval(this.deleteEdgeFunctionText);
        this.$emit(
          "message",
          "options-manipulation-deleteEdge-function",
          this.accordionType,
          this.deleteEdgeFunction
        );
      } else {
        import("./Scripts/DeleteEdgeHelpScript.js?raw")
          .then((res) => res.default)
          .then((t) => {
            this.sendUpdateNodeFunction(t);
          });
      }
    },
    changeDeleteEdgeFunction: function (value) {
      this.deleteEdgeFunctionText = value;
    },
    changeDeleteEdgeFunctionEditing: function (value) {
      this.deleteEdgeFunctionEditingEnabled = value;
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
        this.deleteEdgeFunctionText = t;
        this.deleteEdgeFunction = eval(t);
      } else {
        this.deleteEdgeFunction = eval(this.deleteEdgeFunctionText);
      }
      if (this.deleteEdgeFunction != null) {
        this.$emit(
          "message",
          "options-manipulation-deleteEdge-function",
          this.accordionType,
          this.deleteEdgeFunction
        );
      }
      this.deleteEdgeFunctionEditingEnabled = false;
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
          newValue.manipulation.deleteEdge != null &&
          typeof newValue.manipulation.deleteEdge == "function"
        ) {
          this.deleteEdgeFunction = this.options.manipulation.deleteEdge;
          this.deleteEdgeFunctionText = this.options.manipulation.deleteEdge;
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
