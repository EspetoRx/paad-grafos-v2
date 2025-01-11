<template>
    <LabelWithTooltip :labelValue="'Habilitado'"
        :tooltip="'Options.Manipulation.Enabled - Ative ou desative o sistema de manipulação. Mesmo quando false, a API de manipulação por meio dos métodos ainda funcionará. Esta propriedade é opcional. Se você definir qualquer uma das opções abaixo e enabled for undefined, isso será definido como verdadeiro.'"
        :forId="'options.manipulation.enabled.switch'" :hasSwitch="true"
        :switchId="'options.manipulation.enabled.switch'"
        :switchTooltip="'Options.Manipulation.Enabled - Ative ou desative o sistema de manipulação. Mesmo quando false, a API de manipulação por meio dos métodos ainda funcionará. Esta propriedade é opcional. Se você definir qualquer uma das opções abaixo e enabled for undefined, isso será definido como verdadeiro.'"
        :switchDisabled="false" :switchInitialValue="enabled" :switchLabelEnabled="false"
        @checkbox-status-changed="changeEnabled"></LabelWithTooltip>
    <LabelWithTooltip :labelValue="'Ativo Inicialmente'"
        :tooltip="'Options.Manipulation.initiallyActive - Alterne se a barra de ferramentas fica visível inicialmente ou se somente o botão de edição fica visível inicialmente.'"
        :forId="'options.manipulation.enabled.initiallyActive.switch'" :hasSwitch="true"
        :switchId="'options.manipulation.enabled.initiallyActive.switch'"
        :switchTooltip="'Options.Manipulation.initiallyActive - Alterne se a barra de ferramentas fica visível inicialmente ou se somente o botão de edição fica visível inicialmente.'"
        :switchDisabled="false" :switchInitialValue="initiallyActive" :switchLabelEnabled="false"
        @checkbox-status-changed="changeInitiallyActive"></LabelWithTooltip>
    <AccordionBase
        :accordionData
        :bsModalReturnValue
        @open-bs-modal="openBsModal"
        @message="message"
        :options
    ></AccordionBase>
</template>
<script>
import InputTextArea from '../Common/Inputs/InputTextArea.vue';
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
import AccordionBase from '../Common/Accordion/AccordionBase.vue';

export default {
    name: "Manipulation Component",
    props: [
        'encapsulateOptions',
        'bsModalReturnValue',
    ],
    data() {
        return {
            options: null,
            enabled: false,
            initiallyActive: true,
            addNode: false,
            addNodeFunction: null,
            addEdge: false,
            addEdgeFunction: null,
            accordionData: [
                {
                    title: "Adicionar Vértice",
                    body: "AddNodeBaseComponent",
                    tooltip: "Você pode usar essas opções para ativar ou desativar determinadas funcionalidades ou anexar uma função de manipulador a elas. Essas funções são chamadas antes que a ação seja executada. Se um vértice for adicionado por meio do sistema de manipulação, a função addNode será chamada primeiro. Com isso, você pode fornecer uma gui para seus usuários, abortar o processo ou qualquer outra coisa que queira fazer. Para todas, exceto a funcionalidade editNode, essas funções do manipulador são opcionais.",
                    id: "addNode",
                    checkboxValue: this.addNode
                },
                {
                    title: "Adicionar Aresta",
                    body: "AddEdgeBaseComponent",
                    tooltip: "Você pode usar essas opções para ativar ou desativar determinadas funcionalidades ou anexar uma função de manipulador a elas. Essas funções são chamadas antes que a ação seja executada. Se uma aresta for adicionado por meio do sistema de manipulação, a função addEdge será chamada primeiro. Com isso, você pode fornecer uma gui para seus usuários, abortar o processo ou qualquer outra coisa que queira fazer. Para todas, exceto a funcionalidade editEdge, essas funções do manipulador são opcionais.",
                    id: "addEdge",
                    checkboxValue: this.addEdge
                }
            ],
        }
    },
    watch: {
        options: {
            handler: function (newValue, oldValue) {
                this.$emit("options-has-changed", newValue);
            },
            deep: true,
        }
    },
    mounted() {
        console.log("Manipulation Component Mounted");
        this.options = this.encapsulateOptions;

        if (typeof this.options.manipulation == "booelan") {
            this.enabled = true;
        } else if (typeof this.options.manipulation == "object"){
            if (typeof this.options.manipulation.enabled == "boolean") {
                this.enabled = this.options.manipulation.enabled;
            }
            if (typeof this.options.manipulation.initiallyActive == "boolean") {
                this.initiallyActive = this.options.manipulation.initiallyActive;
            }
            if (typeof this.options.manipulation.addNode == "boolean"
                && this.options.manipulation.addNode == true) {
                this.addNode = this.options.manipulation.addNode;
                this.accordionData[0].checkboxValue = this.addNode;
            } else if (typeof this.options.manipulation.addNode == "function") {
                this.addNode = true;
            }
            if (typeof this.options.manipulation.addEdge == "boolean"
                && this.options.manipulation.addEdge == true) {
                    this.addEdge = this.options.manipulation.addNode;
                    this.accordionData[1].checkboxValue = this.addEdge;
            } else if (typeof this.options.manipulation.addEdge == "function") {
                this.addEdge = true;
            }
        }
    },
    components: {
        LabelWithTooltip, InputTextArea, AccordionBase
    },
    methods: {
        changeEnabled: function (value) {
            if (!value) {
                var element = document.getElementsByClassName('vis-manipulation');
                var element3 = document.getElementsByClassName('vis-edit-mode');
                var element4 = document.getElementsByClassName('vis-close');
                element = element[0];
                element3 = element3[0];
                element4 = element4[0];
                var element2 = document.getElementsByClassName('vis-network');
                element2[0].insertAdjacentElement('beforeend', element);
                element2[0].insertAdjacentElement('beforeend', element3);
                element2[0].insertAdjacentElement('beforeend', element4);
            }
            this.enabled = value;
            this.options.manipulation.enabled = value;
            if (value) {
                setTimeout(function () {
                    var element = document.getElementsByClassName('vis-manipulation');
                    var element3 = document.getElementsByClassName('vis-edit-mode');
                    var element4 = document.getElementsByClassName('vis-close');
                    element = element[0];
                    element3 = element3[0];
                    element4 = element4[0];
                    var element2 = document.getElementById('vis-manipulation-area');
                    element2.insertAdjacentElement('afterbegin', element);
                    element2.insertAdjacentElement('beforeend', element3);
                    element2.insertAdjacentElement('beforeend', element4);
                }, 3);
            }

        },
        changeInitiallyActive: function (value) {
            this.initiallyActive = value;
            this.options.manipulation.initiallyActive = value;
        },
        changeAddNode: function(value) {
            if (typeof value == "boolean") this.addNode = value;
            else this.addNodeFunction = value;
            this.options.manipulation.addNode = value;
        },
        changeAddEdge: function(value) {
            if (typeof value == "boolean") this.addEdge = value;
            else this.addEdgeFunction = value;
            this.options.manipulation.addEdge = value;
        },
        message: function(message, accordionItem, value) {
            if (accordionItem == "addNode") {
                if (message == "update-checkbox-accordion") this.changeAddNode(value);
                if (message == "options-manipulation-addNode-booelan") this.changeAddNode(value);
                if (message == "options-manipulation-addNode-function") this.changeAddNode(value);
            } else if (accordionItem == "addEdge") {
                if (message == "update-checkbox-accordion") this.changeAddEdge(value);
                if (message == "options-manipulation-addEdge-booelan") this.changeAddEdge(value);
                if (message == "options-manipulation-addEdge-function") this.changeAddEdge(value);
            } else if (message == "send-toast") {
                this.$emit("send-toast", accordionItem);
            }
        },
        openBsModal: function (title, body) {
            this.$emit("open-bs-modal", title, body);
        },
    },
    emits: ['options-has-changed', 'open-bs-modal', 'send-toast']
}
</script>