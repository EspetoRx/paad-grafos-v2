<template>
    <p>Semente Randômica do desenho anterior:<br />{{ randomSeed }}</p>
    <p>Semente Randômica Deste Desenho:<br />{{ initialRandomSeed }}</p>
    <InputText :inputId="'options.layout.randomSeed'" :inputEnabled="true" :inputInitialValue="randomSeed"
        :inputPlaceholder="'//Código do posicionamento dos nodes.'" :isLabelEnabled="true"
        :labelValue="'Semente randômica: (Repinta Canvas)'" :tooltip="'Options.Layout.RandomSeed - Quando NÃO estiver usando o layout hierárquico, os ' +
            'nós são posicionados aleatoriamente inicialmente. Isso significa que o resultado estabelecido' +
            ' é diferente a cada vez. Se você fornecer uma semente aleatória manualmente, o layout será o ' +
            'mesmo todas as vezes. O ideal é tentar com uma semente indefinida, recarregar até ficar satisfeito ' +
            'com o layout e usar o método getSeed() para verificar a semente.'" :hasSwitch="false"
        @input-value-change="changeRandomSeed"></InputText>
    <SwitchButton :switchId="'options.layout.improvedLayout'" :switchDisabled="true"
        :switchInitialValue="improvedLayout" :switchTooltipEnabled="true" :switchTooltip="'Options.Layout.ImprovedLayout - Quando ativado, a rede usará o ' +
            'algoritmo Kamada Kawai para o layout inicial. Para redes com mais de 100 nós, o clustering será ' +
            'realizado automaticamente para reduzir a quantidade de nós. Isso pode melhorar muito os tempos de ' +
            'estabilização. Se a rede estiver muito interconectada (nenhum ou poucos nós folha), isso pode não ' +
            'funcionar e retornará ao método antigo. O desempenho será melhorado no futuro.'" :switchLabelEnabled="true"
        :switchLabelValue="'Layout aprimorado (Repinta Canvas) (Broken)'" @checkbox-status-changed="changeImprovedLayout">
    </SwitchButton>
    <InputRange :inputId="'options.layout.clusterThreshold'" :isLabelEnabled="true" :min="0" :max="300" :step="1"
        :initialValue="clusterThreshold" :labelValue="'Limiar de clusterização (Repinta Canvas)'"
        :tooltip="'Options.Layout.ClusterThreshold - Limite de cluster ao qual o layout aprimorado se aplica.'"
        :disabled="false" :labelHasSwitch="false" @update-value-from-range-input="changeClusterThreshold"></InputRange>
    <Accordion :accordionData="accordionData" @message="message" @open-bs-modal="openBsModal"
        :bsModalReturnValue="bsModalReturnValue" :options="options" class="mt-1"></Accordion>
</template>

<script>

import InputText from '../Common/Inputs/InputText.vue';
import SwitchButton from '../Common/SwitchButton.vue';
import InputRange from '../Common/Inputs/InputRange.vue';
import AccordionBase from '../Common/Accordion/AccordionBase.vue';

export default {
    name: "Layout Component",
    props: [
        'encapsulateOptions',
        'encapsulateLocalNetwork',
        'bsModalReturnValue'
    ],
    data() {
        return {
            justMounted: false,
            options: null,

            initialRandomSeed: "",
            randomSeed: "undefined",
            improvedLayout: true,
            clusterThreshold: 150,
            hierarchicalLayoutEnabled: false,
            accordionData: [
                {
                    id: 'hierarchical',
                    title: 'Hierarquia',
                    body: 'HierarchicalLayoutBaseComponent',
                    tooltip: "Options.Layout.Hierarchical - Quando verdadeiro o mecanismo de layout posiciona os vértices de uma forma hierárquica usando as configurações padrão. Para customização você pode fornecer um objeto."
                },
            ]

        }
    },
    methods: {
        message: function (message, id, value) {
            if (id == "hierarchical") {
                if (message == "update-checkbox-accordion") this.changeHierarchicalEnabled(value);
                if (message == "sending-object-to-hierarchical") this.changeHierarchicalSendObject(value);
                if (message == "change-level-separation") this.changeHierarchicalLevelSeparation(value);
                if (message == "change-node-spacing") this.changeHierarchicalNodeSpacing(value);
                if (message == "change-tree-spacing") this.changeHierarchicalTreeSpacing(value);
                if (message == "change-block-shifting") this.changeHierarchicalBlockShifting(value);
                if (message == "change-edge-minimization") this.changeHierarchicalEdgeMinimization(value);
                if (message == "change-parent-centralization") this.changeHierarchicalParentCentralization(value);
                if (message == "change-direction") this.changeHierarchicalDirection(value);
                if (message == "change-sort-method") this.changeHierarchicalSortMethod(value);
                if (message == "change-shake-towards") this.changeShakeTowards(value);
            }
        },
        openBsModal: function (title, body) {
            this.$emit("open-bs-modal", title, body);
        },
        changeRandomSeed: function (value) {
            this.randomSeed = value;
            if (value == "undefined") {
                this.options.layout.randomSeed = undefined;
                if (!this.justMounted)
                    this.$emit('options-has-changed', this.opitons);
            } else {
                this.options.layout.randomSeed = value;
                this.$emit('options-has-changed', this.opitons);
                this.$emit('canvas-key-change', true);
            }
        },
        changeImprovedLayout: function (value) {
            if (value == this.improvedLayout) return;
            this.improvedLayout = value;
            this.options.layout.improvedLayout = value;
            this.$emit('options-has-changed', this.opitons);
            this.$emit('canvas-key-change', true);
            this.updateRandomSeed();
        },
        updateRandomSeed: function () {
            let value = this.encapsulateLocalNetwork.getSeed();
            let otherValue = this.encapsulateLocalNetwork.layoutEngine.initialRandomSeed;
            this.randomSeed = "" + value;
            this.initialRandomSeed = "" + otherValue;
        },
        changeClusterThreshold: function (value) {
            if (value == this.clusterThreshold) return;
            this.clusterThreshold = value;
            this.options.layout.clusterThreshold = parseInt(value);
            this.$emit('options-has-changed', this.opitons);
            this.$emit('canvas-key-change', true);
            this.updateRandomSeed();
        },
        changeHierarchicalEnabled: function (value) {
            if (value == this.hierarchicalLayoutEnabled) return;
            this.hierarchicalLayoutEnabled = value;
            this.options.layout.hierarchical.enabled = this.hierarchicalLayoutEnabled;
            this.$emit('options-has-changed', this.options);
        },
        changeHierarchicalSendObject: function(value) {
            if (value) {
                this.options.layout.hierarchical = {enabled : true};
            } else {
                this.options.layout.hierarchical.enabled = true;
            }
            this.$emit('options-has-changed', this.options);
        },
        changeHierarchicalLevelSeparation: function(value) {
            this.options.layout.hierarchical.levelSeparation = parseInt(value);
            this.$emit('options-has-changed', this.options);
        },
        changeHierarchicalNodeSpacing: function(value) {
            this.options.layout.hierarchical.nodeSpacing = parseInt(value);
            this.$emit("options-has-changed", this.options);
        },
        changeHierarchicalTreeSpacing: function(value) {
            this.options.layout.hierarchical.treeSpacing = parseInt(value);
            this.$emit("options-has-changed", this.options);
        },
        changeHierarchicalBlockShifting: function(value) {
            this.options.layout.hierarchical.blockShifting = value;
            this.$emit("options-has-changed", this.options);
        },
        changeHierarchicalEdgeMinimization: function(value) {
            this.options.layout.hierarchical.edgeMinimization = value;
            this.$emit("options-has-changed", this.options);
        },
        changeHierarchicalParentCentralization: function(value) {
            this.options.layout.hierarchical.parentCentralization = value;
            this.$emit("options-has-changed", this.options);
        },
        changeHierarchicalDirection: function(value) {
            this.options.layout.hierarchical.direction = value;
            this.$emit("options-has-changed", this.options);
        },
        changeHierarchicalSortMethod: function(value) {
            this.options.layout.hierarchical.sortMethod = value;
            this.$emit("options-has-changed", this.options);
        },
        changeShakeTowards: function(value) {
            this.options.layout.hierarchical.shakeTowards = value;
            this.$emit("options-has-changed", this.options);
        }
    },
    watch: {
        "encapsulateLocalNetwork.layoutEngine.initialRandomSeed": {
            handler: function (newValue, oldValue) {
                this.initialRandomSeed = "" + newValue;
            }
        }
    },
    mounted() {
        this.justMounted = true;
        this.options = this.encapsulateOptions;
        this.updateRandomSeed();
        setTimeout(function(){
            this.justMounted = false;
        }.bind(this), 5);
    },
    components: {
        InputText, SwitchButton, InputRange, "Accordion": AccordionBase
    },
    emits: ['options-has-changed', 'canvas-key-change'],
}
</script>