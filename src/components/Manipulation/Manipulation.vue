<template>
  <LabelWithTooltip
    :labelValue="'Habilitado'"
    :tooltip="'Options.Manipulation.Enabled - Ative ou desative o sistema de manipulação. Mesmo quando false, a API de manipulação por meio dos métodos ainda funcionará. Esta propriedade é opcional. Se você definir qualquer uma das opções abaixo e enabled for undefined, isso será definido como verdadeiro.'"
    :forId="'options.manipulation.enabled.switch'"
    :hasSwitch="true"
    :switchId="'options.manipulation.enabled.switch'"
    :switchTooltip="'Options.Manipulation.Enabled - Ative ou desative o sistema de manipulação. Mesmo quando false, a API de manipulação por meio dos métodos ainda funcionará. Esta propriedade é opcional. Se você definir qualquer uma das opções abaixo e enabled for undefined, isso será definido como verdadeiro.'"
    :switchDisabled="false"
    :switchInitialValue="enabled"
    :switchLabelEnabled="false"
    @checkbox-status-changed="changeEnabled"
  ></LabelWithTooltip>
  <LabelWithTooltip
    :labelValue="'Ativo Inicialmente'"
    :tooltip="'Options.Manipulation.initiallyActive - Alterne se a barra de ferramentas fica visível inicialmente ou se somente o botão de edição fica visível inicialmente.'"
    :forId="'options.manipulation.enabled.initiallyActive.switch'"
    :hasSwitch="true"
    :switchId="'options.manipulation.enabled.initiallyActive.switch'"
    :switchTooltip="'Options.Manipulation.initiallyActive - Alterne se a barra de ferramentas fica visível inicialmente ou se somente o botão de edição fica visível inicialmente.'"
    :switchDisabled="false"
    :switchInitialValue="initiallyActive"
    :switchLabelEnabled="false"
    @checkbox-status-changed="changeInitiallyActive"
  ></LabelWithTooltip>
  <Accordion
    :accordionData
    :bsModalReturnValue
    @open-bs-modal="openBsModal"
    @message="message"
    :options
  ></Accordion>
  <InputTextArea
    :inputId="'options.manipulation.controlNodeStyle'"
    :inputEnabled="true"
    :inputInitialValue="controlNodeStyleText"
    :inputPlaceholder="'//JSON para o controle de estilo na '"
    :inputRows="7"
    :isLabelEnabled="true"
    :labelValue="'Controle de estilo do vértice ligante na aresta'"
    :tooltip="`Você pode fornecer qualquer informação de estilo que desejar aqui. Todos os campos descritos no módulo nodes são permitidos, exceto, obviamente, para id, x, y e fixed.`"
    :hasSwitch="true"
    :switchId="'options.manipulation.controlNodeStyleSwitch'"
    :switchTooltip="false"
    :switchDisabled="false"
    :switchInitialValue="controlNodeStyleEnabled"
    :switchLabelEnabled="false"
    @checkbox-value-change="changeControlNodeStyleEnabled"
    @input-value-change="changeControlNodeStyleText"
  ></InputTextArea>
  <button type="button" class="btn btn-sm btn-primary form-control" @click="changeControlNodeStyle" v-if="controlNodeStyleEnabled">
    <i class="fa-solid fa-right-to-bracket"></i> Enviar objeto
  </button>
  <p class="text-danger text-sm" v-if="controlNodeStyleEnabled">* Desligar controle de estilo do vértice ligante à Repinta Canvas.</p>
</template>
<script>
import InputTextArea from "../Common/Inputs/InputTextArea.vue";
import LabelWithTooltip from "../Common/LabelWithTooltip.vue";
import defaultControlNodeStyle from "./JSONs/ManipulationDefaultControlNodeStyle.json";

export default {
  name: "Manipulation Component",
  props: ["encapsulateOptions", "bsModalReturnValue"],
  data() {
    return {
      options: null,
      enabled: false,
      initiallyActive: true,
      addNode: false,
      addNodeFunction: null,
      addEdge: false,
      addEdgeFunction: null,
      editNode: false,
      editNodeFunction: null,
      editEdge: false,
      editEdgeFunction: null,
      deleteNode: false,
      deleteNodeFunction: null,
      deleteEdge: false,
      deleteEdgeFunction: null,
      defaultControlNodeStyle: defaultControlNodeStyle,
      controlNodeStyleText: "",
      controlNodeStyle: null,
      controlNodeStyleEnabled: false,
      accordionData: [
        {
          title: "Adicionar Vértice",
          body: "AddNodeBaseComponent",
          tooltip:
            "Você pode usar essas opções para ativar ou desativar determinadas funcionalidades ou anexar uma função de manipulador a elas. Essas funções são chamadas antes que a ação seja executada. Se um vértice for adicionado por meio do sistema de manipulação, a função addNode será chamada primeiro. Com isso, você pode fornecer uma gui para seus usuários, abortar o processo ou qualquer outra coisa que queira fazer. Para todas, exceto a funcionalidade editNode, essas funções do manipulador são opcionais.",
          id: "addNode",
          checkboxValue: this.addNode,
        },
        {
          title: "Adicionar Aresta",
          body: "AddEdgeBaseComponent",
          tooltip:
            "Você pode usar essas opções para ativar ou desativar determinadas funcionalidades ou anexar uma função de manipulador a elas. Essas funções são chamadas antes que a ação seja executada. Se uma aresta for adicionado por meio do sistema de manipulação, a função addEdge será chamada primeiro. Com isso, você pode fornecer uma gui para seus usuários, abortar o processo ou qualquer outra coisa que queira fazer. Para todas, exceto a funcionalidade editEdge, essas funções do manipulador são opcionais.",
          id: "addEdge",
          checkboxValue: this.addEdge,
        },
        {
          title: "Editar Vértice (Off Repinta Canvas)",
          body: "EditNodeBaseComponent",
          tooltip:
            "A edição de vértices só é possível quando uma função de gestão é fornecida. Se este não for o caso, a edição de vértices será desativada. A função será chamada quando um vértice for selecionado e o botão 'Editar vértice' na barra de ferramentas for pressionado. Essa função será chamada como a função addNode com os dados do vértice e uma função de retorno de chamada.",
          id: "editNode",
          checkboxValue: this.editNode,
        },
        {
          title: "Editar Aresta",
          body: "EditEdgeBaseComponent",
          tooltip: `Se booleano, alterna a edição de arestas na GUI. Se uma função for fornecida, ela será chamada quando uma aresta for selecionada e o botão 'Editar Aresta' na barra de ferramentas for pressionado. Inicialmente, os pontos finais da aresta podem ser arrastados para conectar a um nó diferente, então a função será chamada da mesma forma que a função addEdge é chamada. Se um objeto, se uma função for fornecida para a propriedade 'editWithoutDrag', a função será chamada imediatamente (sem arrastar nenhum ponto final) da mesma forma que a função addEdge é chamada. Se o retorno de chamada não for executado, a aresta permanecerá pendurada onde foi liberada. Para cancelar, chame a função de retorno de chamada com nulo como argumento ou sem argumentos.`,
          id: "editEdge",
          checkboxValue: this.editEdge,
        },
        {
          title: "Deletar Vértice",
          body: "DeleteNodeBaseComponent",
          tooltip: `Se booleano, alterna a exclusão de nós na GUI. Se função, será chamado quando um nó for selecionado e o botão 'Excluir selecionado' for pressionado. Ao usar uma função, ele receberá um retorno de chamada e um objeto com uma matriz de nodeIds selecionados e uma matriz de edge Ids selecionados. Esses são os itens que serão excluídos se o retorno de chamada for executado.`,
          id: "deleteNode",
          checkboxValue: this.deleteNode,
        },
        {
          title: "Deletar Aresta",
          body: "DeleteEdgeBaseComponent",
          tooltip: `Se booleano, alterna a exclusão de arestas na GUI. Se função, será chamado quando uma aresta for selecionada e o botão 'Excluir selecionado' for pressionado. Ao usar uma função, ele receberá um retorno de chamada e um objeto com uma matriz de nodeIds selecionados (vazios) e uma matriz de Ids de arestas selecionadas. Esses são os itens que serão excluídos se o retorno de chamada for executado.`,
          id: "deleteEdge",
          checkboxValue: this.deleteEdge,
        },
      ],
    };
  },
  watch: {
    options: {
      handler: function (newValue, oldValue) {
        this.$emit("options-has-changed", newValue);
      },
      deep: true,
    },
  },
  mounted() {
    console.log("Manipulation Component Mounted");
    this.options = this.encapsulateOptions;

    if (typeof this.options.manipulation == "booelan") {
      this.enabled = true;
    } else if (typeof this.options.manipulation == "object") {
      if (typeof this.options.manipulation.enabled == "boolean") {
        this.enabled = this.options.manipulation.enabled;
      }
      if (typeof this.options.manipulation.initiallyActive == "boolean") {
        this.initiallyActive = this.options.manipulation.initiallyActive;
      }
      if (
        typeof this.options.manipulation.addNode == "boolean" &&
        this.options.manipulation.addNode == true
      ) {
        this.addNode = this.options.manipulation.addNode;
        this.accordionData[0].checkboxValue = this.addNode;
      } else if (typeof this.options.manipulation.addNode == "function") {
        this.addNode = true;
        this.accordionData[0].checkboxValue = this.addNode;
        this.addNodeFunction = this.options.manipulation.addNode;
      }
      if (
        typeof this.options.manipulation.addEdge == "boolean" &&
        this.options.manipulation.addEdge == true
      ) {
        this.addEdge = this.options.manipulation.addEdge;
        this.accordionData[1].checkboxValue = this.addEdge;
      } else if (typeof this.options.manipulation.addEdge == "function") {
        this.addEdge = true;
        this.accordionData[1].checkboxValue = this.addEdge;
        this.addEdgeFunction = this.options.manipulation.addEdge;
      }
      if (this.options.manipulation.editNode == null) {
        this.editNode = false;
      } else if (typeof this.options.manipulation.editNode == "function") {
        this.changeEditNode(this.options.manipulation.editNode);
      }
      if (
        typeof this.options.manipulation.editEdge == "boolean" &&
        this.options.manipulation.editEdge == true
      ) {
        this.editEdge = this.options.manipulation.editEdge;
        this.accordionData[3].checkboxValue = this.editEdge;
      } else if (typeof this.options.manipulation.editEdge == "function") {
        this.editEdge = true;
        this.accordionData[3].checkboxValue = this.editEdge;
        this.editEdgeFunction = this.options.manipulation.editEdge;
      }
      if (
        typeof this.options.manipulation.deleteNode == "boolean" &&
        this.options.manipulation.deleteNode == true
      ) {
        this.deleteNode = this.options.manipulation.deleteNode;
        this.accordionData[4].checkboxValue = this.deleteNode;
      } else if (typeof this.options.manipulation.deleteNode == "function") {
        this.deleteNode = true;
        this.accordionData[4].checkboxValue = this.deleteNode;
        this.deleteNodeFunction = this.options.manipulation.deleteNode;
      }
      if (
        typeof this.options.manipulation.deleteEdge == "boolean" &&
        this.options.manipulation.deleteEdge == true
      ) {
        this.deleteEdge = this.options.manipulation.deleteEdge;
        this.accordionData[5].checkboxValue = this.deleteEdge;
      } else if (typeof this.options.manipulation.deleteEdge == "function") {
        this.deleteEdge = true;
        this.accordionData[5].checkboxValue = this.deleteEdge;
        this.deleteEdgeFunction = this.options.manipulation.deleteEdge;
      }
      if ( typeof this.options.manipulation.controlNodeStyle != "undefined") {
        this.controlNodeStyle = this.options.manipulation.controlNodeStyle;
        this.controlNodeStyleEnabled = true;
        this.controlNodeStyleText = JSON.stringify(this.options.manipulation.controlNodeStyle);
      }
    }
  },
  components: {
    LabelWithTooltip,
    InputTextArea
  },
  methods: {
    changeEnabled: function (value) {
      if (!value) {
        var element = document.getElementsByClassName("vis-manipulation");
        var element3 = document.getElementsByClassName("vis-edit-mode");
        var element4 = document.getElementsByClassName("vis-close");
        element = element[0];
        element3 = element3[0];
        element4 = element4[0];
        var element2 = document.getElementsByClassName("vis-network");
        element2[0].insertAdjacentElement("beforeend", element);
        element2[0].insertAdjacentElement("beforeend", element3);
        element2[0].insertAdjacentElement("beforeend", element4);
      }
      this.enabled = value;
      this.options.manipulation.enabled = value;
      if (value) {
        setTimeout(function () {
          var element = document.getElementsByClassName("vis-manipulation");
          var element3 = document.getElementsByClassName("vis-edit-mode");
          var element4 = document.getElementsByClassName("vis-close");
          element = element[0];
          element3 = element3[0];
          element4 = element4[0];
          var element2 = document.getElementById("vis-manipulation-area");
          element2.insertAdjacentElement("afterbegin", element);
          element2.insertAdjacentElement("beforeend", element3);
          element2.insertAdjacentElement("beforeend", element4);
        }, 3);
      }
    },
    changeInitiallyActive: function (value) {
      this.initiallyActive = value;
      this.options.manipulation.initiallyActive = value;
    },
    changeAddNode: function (value) {
      if (typeof value == "boolean") this.addNode = value;
      else this.addNodeFunction = value;
      this.options.manipulation.addNode = value;
    },
    changeAddEdge: function (value) {
      if (typeof value == "boolean") this.addEdge = value;
      else this.addEdgeFunction = value;
      this.options.manipulation.addEdge = value;
    },
    changeDeleteNode: function(value) {
      if (typeof value == "boolean") this.deleteNode = value;
      else this.deleteNodeFunction = value;
      this.options.manipulation.deleteNode = value;
    },
    changeDeleteEdge: function(value) {
      if (typeof value == "boolean") this.deleteEdge = value;
      else this.deleteEdgeFunction = value;
      this.options.manipulation.deleteEdge = value;
    },
    changeEditEdge: function (value) {
      if (typeof value == "boolean") {
        this.editEdge = value;
      } else {
        this.editEdgeFunction = value;
      }
      this.options.manipulation.editEdge = value;
    },
    changeEditNode: function (value) {
      this.editNode = true;
      this.accordionData[2].checkboxValue = true;
      this.editNodeFunction = value;
      this.options.manipulation.editNode = value;
    },
    message: function (message, accordionItem, value) {
      if (accordionItem == "addNode") {
        if (message == "update-checkbox-accordion") this.changeAddNode(value);
        if (message == "options-manipulation-addNode-booelan") this.changeAddNode(value);
        if (message == "options-manipulation-addNode-function") this.changeAddNode(value);
      } else if (accordionItem == "addEdge") {
        if (message == "update-checkbox-accordion") this.changeAddEdge(value);
        if (message == "options-manipulation-addEdge-booelan") this.changeAddEdge(value);
        if (message == "options-manipulation-addEdge-function") this.changeAddEdge(value);
      } else if (accordionItem == "editNode") {
        if (message == "update-checkbox-accordion") {
          if (!value) {
            if (typeof this.options.manipulation.editNode != "undefined") {
              this.editNode = false;
              delete this.options.manipulation.editNode;
              this.$emit("canvas-key-change", true);
            }
          }
        }
        if (message == "options-manipulation-editNode-function")
          this.changeEditNode(value);
      } else if (accordionItem == "editEdge") {
        if (message == "update-checkbox-accordion") this.changeEditEdge(value);
        if (message == "options-manipulation-editEdge-booelan")
          this.changeEditEdge(value);
        if (message == "options-manipulation-editEdge-function")
          this.changeEditEdge(value);
      } else if (accordionItem == "deleteNode") {
        if (message == "update-checkbox-accordion") this.changeDeleteNode(value);
        if (message == "options-manipulation-deleteNode-booelan")
          this.changeDeleteNode(value);
        if (message == "options-manipulation-deleteNode-function")
          this.changeDeleteNode(value);
      } else if (accordionItem == "deleteEdge") {
        if (message == "update-checkbox-accordion") this.changeDeleteEdge(value);
        if (message == "options-manipulation-deleteEdge-booelan")
          this.changeDeleteEdge(value);
        if (message == "options-manipulation-deleteEdge-function")
          this.changeDeleteEdge(value);
      } else if (message == "send-toast") {
        this.$emit("send-toast", accordionItem);
      }
    },
    openBsModal: function (title, body) {
      this.$emit("open-bs-modal", title, body);
    },
    changeControlNodeStyleEnabled: function (value) {
      this.controlNodeStyleEnabled = value;
      if (value) {
        if (this.controlNodeStyleText == "") {
          this.controlNodeStyle = this.defaultControlNodeStyle;
          this.controlNodeStyleText = JSON.stringify(this.defaultControlNodeStyle);
        } else {
          this.controlNodeStyle = JSON.parse(this.controlNodeStyleText);
        }
        this.options.manipulation.controlNodeStyle = this.controlNodeStyle
      } else {
        if (typeof this.options.manipulation.controlNodeStyle != "undefined") {
          this.controlNodeStyle = null;
          this.controlNodeStyleText = "";
          this.controlNodeStyleSwitch = false;
          delete this.options.manipulation.controlNodeStyle;
          this.$emit("canvas-key-change", true);
        }
      }
    },
    changeControlNodeStyleText: function (value) {
      this.controlNodeStyleText = value;
    },
    changeControlNodeStyle: function (value) {
      try {
        this.controlNodeStyle = JSON.parse(this.controlNodeStyleText);
        this.options.manipulation.controlNodeStyle = this.controlNodeStyle;
      } catch (e) {
        alert('Impossível converter objeto JSON');
      }
    }
  },
  emits: ["options-has-changed", "open-bs-modal", "send-toast", "canvas-key-change"],
};
</script>
