<template>
  <p v-if="!checkboxValue">Ative para começar</p>
  <LabelWithTooltip
    v-if="checkboxValue"
    :labelValue="`Enviando ${
      sendingFunction == false ? ' booleano verdadeiro' : ' função'
    }`"
    :tooltip="
      'Options.Manipulation.editEdge (Toggle boolean/function) - Alterne o envio de booleano e função para o Editar Aresta. ' +
      `Se booleano, alterna a edição de arestas na GUI. Se uma função for fornecida, ela será chamada quando uma aresta for selecionada e o botão 'Editar Aresta' na barra de ferramentas for pressionado. Inicialmente, os pontos finais da aresta podem ser arrastados para conectar a um nó diferente, então a função será chamada da mesma forma que a função addEdge é chamada. Se um objeto, se uma função for fornecida para a propriedade 'editWithoutDrag', a função será chamada imediatamente (sem arrastar nenhum ponto final) da mesma forma que a função addEdge é chamada. Se o retorno de chamada não for executado, a aresta permanecerá pendurada onde foi liberada. Para cancelar, chame a função de retorno de chamada com nulo como argumento ou sem argumentos.`
    "
    :forId="'options-manipulation-editEdge-toggle'"
    :hasSwitch="true"
    :switchId="'options-manipulation-editEdge-toggle'"
    :switchDisabled="false"
    :switchInitialValue="sendingFunction"
    :switchLabelEnabled="false"
    :switchTooltipEnabled="false"
    @checkbox-status-changed="changeManipulationObjectSending"
  ></LabelWithTooltip>
  <InputTextArea
    v-if="sendingFunction"
    :inputId="'options.manipulation.editEdgeFunction'"
    :inputEnabled="editEdgeFunctionEditingEnabled"
    :inputInitialValue="editEdgeFunctionText"
    :inputPlaceholder="'//JS para adicionar vértices'"
    :inputRows="5"
    :isLabelEnabled="true"
    :labelValue="''"
    :tooltip="
      'Options.Manipulation.editEdge Function Sending - ' +
      `Se booleano, alterna a edição de arestas na GUI. Se uma função for fornecida, ela será chamada quando uma aresta for selecionada e o botão 'Editar Aresta' na barra de ferramentas for pressionado. Inicialmente, os pontos finais da aresta podem ser arrastados para conectar a um nó diferente, então a função será chamada da mesma forma que a função addEdge é chamada. Se um objeto, se uma função for fornecida para a propriedade 'editWithoutDrag', a função será chamada imediatamente (sem arrastar nenhum ponto final) da mesma forma que a função addEdge é chamada. Se o retorno de chamada não for executado, a aresta permanecerá pendurada onde foi liberada. Para cancelar, chame a função de retorno de chamada com nulo como argumento ou sem argumentos.`
    "
    :hasSwitch="true"
    :switchId="'options.manipulation.editEdgeFunction.switch'"
    :switchTooltip="'Options.Manipulation.editEdge Function Editing Enabled - Ative ou desative a edição da função de Edição de arestas.'"
    :switchDisabled="false"
    :switchInitialValue="editEdgeFunctionEditingEnabled"
    :switchLabelEnabled="true"
    :switchLabelValue="'Habilitar edição da função'"
    @input-value-change="changeEditEdgeFunction"
    @checkbox-value-change="changeEditEdgeFunctionEditing"
  ></InputTextArea>
  <button
    type="button"
    class="btn btn-primary btn-sm form-control mt-2"
    v-if="editEdgeFunctionEditingEnabled"
    @click.prevent="sendUpdateEdgeFunction"
  >
    <i class="fa-solid fa-right-to-bracket"></i> Enviar Função
  </button>
</template>
<script>
import LabelWithTooltip from "../Common/LabelWithTooltip.vue";
import InputTextArea from "../Common/Inputs/InputTextArea.vue";
export default {
  name: "Edit Edge Base Component",
  props: ["checkboxValue", "bsModalReturnValue", "accordionType", "options"],
  data() {
    return {
      sendingFunction: false,
      editEdgeFunctionEditingEnabled: false,
      editEdgeFunction: null,
      editEdgeFunctionText: "",
    };
  },
  methods: {
    changeManipulationObjectSending: function (value) {
      this.sendingFunction = value;
      if (!value) {
        this.$emit(
          "message",
          "options-manipulation-editEdge-booelan",
          this.accordionType,
          true
        );
      } else if (this.editEdgeFunctionText != "") {
        this.editEdgeFunction = eval(this.editEdgeFunctionText);
      } else {
        import("./Scripts/EditEdgeHelpScript.js?raw")
          .then((res) => res.default)
          .then((t) => {
            this.sendUpdateEdgeFunction(t);
          });
      }
    },
    changeEditEdgeFunction: function (value) {
      this.editEdgeFunctionText = value;
    },
    changeEditEdgeFunctionEditing: function (value) {
      this.editEdgeFunctionEditingEnabled = value;
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
    sendUpdateEdgeFunction: function (t) {
      if (t != undefined && typeof t == "string") {
        this.editEdgeFunctionText = t;
        this.editEdgeFunction = eval(t);
      } else {
        this.editEdgeFunction = eval(this.editEdgeFunctionText);
      }
      if (this.editEdgeFunction != null) {
        this.$emit(
          "message",
          "options-manipulation-editEdge-function",
          this.accordionType,
          this.editEdgeFunction
        );
      }
      this.editEdgeFunctionEditingEnabled = false;
    },
  },
  mounted() {
    console.log("Edit Edge Base Component Mounted");
  },
  watch: {
    "options": function(newValue, oldValue) {
      if (newValue != null) {
        if (
          newValue.manipulation != null &&
          newValue.manipulation.editEdge != null &&
          typeof newValue.manipulation.editEdge == "function"
        ) {
          this.editEdgeFunction = this.options.manipulation.editEdge;
          this.editEdgeFunctionText = this.options.manipulation.editEdge;
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
