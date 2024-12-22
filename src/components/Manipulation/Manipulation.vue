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
    <LabelWithTooltip :labelValue="'Adicionar Vértice: ' + ((!addNode)?'enviando verdadeiro':'enviando função')"
        :tooltip="'Options.Manipulation.AddNode - Você pode usar essas opções para ligar ou desligar certas funcionalidades ou anexar uma função de manipulador a elas. Essas funções são chamadas antes da ação ser executada. Se um vértice for adicionado por meio do sistema de manipulação, a função addNode será chamada primeiro. Com isso, você pode fornecer uma GUI para seus usuários, abortar o processo ou qualquer outra coisa que queira fazer. Para todos, exceto a funcionalidade editNode, essas funções de manipulador são opcionais.'"
        :forId="'options.manipulation.enabled.addNode.switch'" :hasSwitch="true"
        :switchId="'options.manipulation.enabled.addNode.switch'"
        :switchTooltip="'Options.Manipulation.AddNode - Você pode usar essas opções para ligar ou desligar certas funcionalidades ou anexar uma função de manipulador a elas. Essas funções são chamadas antes da ação ser executada. Se um vértice for adicionado por meio do sistema de manipulação, a função addNode será chamada primeiro. Com isso, você pode fornecer uma GUI para seus usuários, abortar o processo ou qualquer outra coisa que queira fazer. Para todos, exceto a funcionalidade editNode, essas funções de manipulador são opcionais.'"
        :switchDisabled="false" :switchInitialValue="addNode" :switchLabelEnabled="false"
        @checkbox-status-changed="changeAddNode"></LabelWithTooltip>
    <InputTextArea
        v-if="addNode"
        :inputId="'options.manipulation.addNodeFunction'"
        :inputEnabled="false"
        :inputInitialValue="addNodeTextFunction"
        :inputPlaceholder="'//JS para adicionar vértices'"
        :inputRows="7"
        :isLabelEnabled="true"
        :labelValue="'Função de envio para addNodes'"
        :tooltip="'Options.Manipulation.addNode Function Sending - Ao fornecer um booleano, você apenas alterna o botão \'adicionar vértice\' na GUI do sistema de manipulação. A falta de função de manipulação pode afetar a API ao usar os métodos. Quando uma função é fornecida, ela será chamada quando o usuário clicar na tela no modo \'addNode\'. Esta função receberá duas variáveis: as propriedades do vértice que podem ser criadas e uma função de retorno de chamada. Se você chamar a função de retorno de chamada com as propriedades do novo vértice, o vértice será adicionado.'"
        :hasSwitch="false"
        @input-value-change="changeAddNodeFunction"
    ></InputTextArea>
</template>
<script>
import InputTextArea from '../Common/Inputs/InputTextArea.vue';
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';

export default {
    name: "Manipulation Component",
    props: [
        'encapsulateOptions'
    ],
    data() {
        return {
            options: null,
            enabled: false,
            initiallyActive: true,
            addNode: false,
            addNodeTextFunction: "",
            addNodeFunction: null,
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
    },
    components: {
        LabelWithTooltip, InputTextArea
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
            this.addNode = value;
            this.options.manipulation.addNode = true;
        },
        changeAddNodeFunction: function(value) {
            this.addNodeTextFunction = value;
        }
    },
    emits: ['options-has-changed']
}
</script>