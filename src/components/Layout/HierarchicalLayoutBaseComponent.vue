<template>
    <p v-if="!checkboxValue" class="m-0 pt-2">Ative para começar.</p>
    <LabelWithTooltip :labelValue="(!sendingObject) ? 'Enviando booleano verdadeiro.' : 'Enviando objeto.'"
        :tooltip="'Options.Layout.Hierarchical (Toggle Boolean / Object Sending) - Alterna o uso do sistema de layout hierárquico. Se essa opção não for definida, ela será definida como true se qualquer uma das propriedades neste objeto for definida.'"
        :forId="'switch-send-object'" :hasSwitch="true" :switchId="'switch-send-object'"
        :switchTooltip="'Options.Layout.Hierarchical (Toggle Boolean / Object Sending) - Alterna o uso do sistema de layout hierárquico. Se essa opção não for definida, ela será definida como true se qualquer uma das propriedades neste objeto for definida.'"
        :switchDisabled="false" :switchInitialValue="sendingObject" :switchLabelEnabled="false"
        @checkbox-status-changed="changeSendingObject"></LabelWithTooltip>
    <InputRange v-if="sendingObject" :inputId="'options.layouts.hierarchical.levelSeparations'" :isLabelEnabled="true"
        :min="0" :max="300" :step="1" :initialValue="levelSeparation" :labelValue="'Nível de separação'"
        :tooltip="'Options.Layout.Hierarchical.levelSeparation - A distância entre os diferentes níveis.'"
        :disabled="false" :labelHasSwitch="false" @update-value-from-range-input="changeLevelSeparation"></InputRange>
    <InputRange v-if="sendingObject" :inputId="'options.layouts.hierarchical.nodeSpacing'" :isLabelEnabled="true"
        :min="0" :max="300" :step="1" :initialValue="nodeSpacing" :labelValue="'Espaçamento dos vértices'"
        :tooltip="'Options.Layout.Hierarchical.NodeSpacing - Distância mínima entre vértices no eixo livre. Isso é somente para o layout inicial. Se você habilitar a física, a distância do vértice ali será a distância efetiva do vértice.'"
        :disabled="false" :labelHasSwitch="false" @update-value-from-range-input="changeNodeSpacing"></InputRange>
    <InputRange v-if="sendingObject" :inputId="'options.layouts.hierarchical.treeSpacing'" :isLabelEnabled="true"
        :min="0" :max="300" :step="1" :initialValue="treeSpacing" :labelValue="'Espaçamento das árvores'"
        :tooltip="'Options.Layout.Hierarchical.treeSpacing - Distância entre diferentes árvores (redes independentes). Isso é apenas para o layout inicial. Se você habilitar a física, o modelo de repulsão denotará a distância entre as árvores.'"
        :disabled="false" :labelHasSwitch="false" @update-value-from-range-input="changeTreeSpacing"></InputRange>
    <LabelWithTooltip v-if="sendingObject" :labelValue="'Mudança de Bloco'"
        :tooltip="'Options.Layout.Hierarchical.BlockShifting - Método para reduzir espaços em branco. Pode ser usado sozinho ou junto com minimização de bordas. Cada vértice verificará espaços em branco e deslocará seu branch junto com ele o máximo que puder, respeitando o nodeSpacing em qualquer nível. Isso é principalmente para o layout inicial. Se você habilitar a física, o layout será determinado pela física. Isso acelerará muito o tempo de estabilização!'"
        :forId="'switch-block-shifting'" :hasSwitch="true" :switchId="'switch-block-shifting'"
        :switchTooltip="'Options.Layout.Hierarchical.BlockShifting - Método para reduzir espaços em branco. Pode ser usado sozinho ou junto com minimização de bordas. Cada vértice verificará espaços em branco e deslocará seu branch junto com ele o máximo que puder, respeitando o nodeSpacing em qualquer nível. Isso é principalmente para o layout inicial. Se você habilitar a física, o layout será determinado pela física. Isso acelerará muito o tempo de estabilização!'"
        :switchDisabled="false" :switchInitialValue="blockShifting" :switchLabelEnabled="false"
        @checkbox-status-changed="changeBlockShifting"></LabelWithTooltip>
    <LabelWithTooltip v-if="sendingObject" :labelValue="'Minimização de arestas'"
        :tooltip="'Options.Layout.Hierarchical.EdgeMinimization - Método para reduzir espaços em branco. Pode ser usado sozinho ou junto com deslocamento de bloco. Habilitar deslocamento de bloco geralmente acelera o processo de layout. Cada vértice tentará se mover ao longo de seu eixo livre para reduzir o comprimento total de suas arestas. Isso é principalmente para o layout inicial. Se você habilitar a física, o layout será determinado pela física. Isso acelerará muito o tempo de estabilização!'"
        :forId="'switch-edge-minimization'" :hasSwitch="true" :switchId="'switch-edge-minimization'"
        :switchTooltip="'Options.Layout.Hierarchical.EdgeMinimization - Método para reduzir espaços em branco. Pode ser usado sozinho ou junto com deslocamento de bloco. Habilitar deslocamento de bloco geralmente acelera o processo de layout. Cada vértice tentará se mover ao longo de seu eixo livre para reduzir o comprimento total de suas arestas. Isso é principalmente para o layout inicial. Se você habilitar a física, o layout será determinado pela física. Isso acelerará muito o tempo de estabilização!'"
        :switchDisabled="false" :switchInitialValue="edgeMinimization" :switchLabelEnabled="false"
        @checkbox-status-changed="changeEdgeMinimization"></LabelWithTooltip>
    <LabelWithTooltip v-if="sendingObject" :labelValue="'Centrazliação do vértice pai'"
        :tooltip="'Options.Layout.Hierarchical.ParentCentralization - Quando verdadeiro, os vértices pais serão centralizados novamente após o algoritmo de layout ser concluído.'"
        :forId="'switch-parent-centralization'" :hasSwitch="true" :switchId="'switch-parent-centralization'"
        :switchTooltip="'Options.Layout.Hierarchical.ParentCentralization - Quando verdadeiro, os vértices pais serão centralizados novamente após o algoritmo de layout ser concluído.'"
        :switchDisabled="false" :switchInitialValue="parentCentralization" :switchLabelEnabled="false"
        @checkbox-status-changed="changeParentCentralization"></LabelWithTooltip>
    <LabelWithTooltip v-if="sendingObject" :labelValue="'Direção'"
        :tooltip="'Options.Layout.Hierarchical.Direction - A direção do layout hierárquico. As opções disponíveis são: UD, DU, LR, RL. Para simplificar: cima-baixo, baixo-cima, esquerda-direita, direita-esquerda.'"
        :forId="'input-select-' + arrowType + '-direction'" :hasSwitch="false"></LabelWithTooltip>
    <InputSelect
        v-if="sendingObject"
        :selectId="'input-select-' + arrowType + '-direction'" :options="[
        { value: 'UD', label: 'Cima para baixo', selected: true },
        { value: 'DU', label: 'Baixo para cima', selected: false },
        { value: 'LR', label: 'Esquerda para direita', selected: false },
        { value: 'RL', label: 'Diretia para esquerda', selected: false },
    ]" @update-selection="changeDirection"
    ></InputSelect>
    <LabelWithTooltip v-if="sendingObject" :labelValue="'Método de Ordenação'"
        :tooltip="'Options.Layout.Hierarchical.sortMethod - O algoritmo usado para determinar os níveis dos nós com base nos dados. As opções possíveis são: hubsize, directed. Hubsize pega os nós com mais arestas e os coloca no topo. A partir disso, o resto da hierarquia é avaliado. Directed adere aos dados de e para das arestas. A --> B, então B é um nível mais baixo que A.'"
        :forId="'input-select-' + arrowType + '-sortMethod'" :hasSwitch="false"></LabelWithTooltip>
    <InputSelect
        v-if="sendingObject"
        :selectId="'input-select-' + arrowType + '-sortMethod'" :options="[
        { value: 'hubsize', label: 'Hubsize', selected: true },
        { value: 'directed', label: 'Directed', selected: false },
    ]" @update-selection="changeSortMethod"
    ></InputSelect>
    <LabelWithTooltip v-if="sendingObject && this.sortMethod == 'directed'" :labelValue="'Agitar na direção'"
        :tooltip="'Options.Layout.Hierarchical.shakeTowards - Controla se no layout direcionado todas as raízes devem ser alinhadas na parte superior e seus nós filhos o mais próximo possível de suas raízes (raízes) ou todas as folhas devem ser alinhadas na parte inferior e seus pais o mais próximo possível de seus filhos (folhas, padrão).'"
        :forId="'input-select-' + arrowType + '-shakeTowards'" :hasSwitch="false"></LabelWithTooltip>
    <InputSelect
        v-if="sendingObject && this.sortMethod == 'directed'"
        :selectId="'input-select-' + arrowType + '-shakeTowards'" :options="[
        { value: 'leaves', label: 'Folhas', selected: true },
        { value: 'roots', label: 'Raízes', selected: false },
    ]" @update-selection="changeShakeTowards"
    ></InputSelect>
</template>
<script>
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
import InputRange from '../Common/Inputs/InputRange.vue';
import InputSelect from '../Common/Inputs/InputSelect.vue';

export default {
    name: 'Hierarchical Layout Base Component',
    props: [
        'checkboxValue',
        'openBsModal',
        'bsModalReturnValue',
        'arrowType'
    ],
    data() {
        return {
            sendingObject: false,
            levelSeparation: 150,
            nodeSpacing: 100,
            treeSpacing: 200,
            blockShifting: true,
            edgeMinimization: true,
            parentCentralization: true,
            direction: 'UD',
            sortMethod: 'hubsize',
            shakeTowards: 'leaves',
        }
    },
    methods: {
        changeSendingObject: function (value) {
            this.sendingObject = value;
            this.$emit("message", "sending-object-to-hierarchical", this.arrowType, value);
        },
        changeLevelSeparation: function (value) {
            this.levelSeparation = parseInt(value);
            this.$emit("message", "change-level-separation", this.arrowType, value);
        },
        changeNodeSpacing: function (value) {
            this.nodeSpacing = parseInt(value);
            this.$emit("message", "change-node-spacing", this.arrowType, value);
        },
        changeTreeSpacing: function (value) {
            this.treeSpacing = parseInt(value);
            this.$emit("message", "change-tree-spacing", this.arrowType, value);
        },
        changeBlockShifting: function (value) {
            this.blockShifting = value;
            this.$emit("message", "change-block-shifting", this.arrowType, value);
        },
        changeEdgeMinimization: function (value) {
            this.edgeMinimization = value;
            this.$emit("message", "change-edge-minimization", this.arrowType, value);
        },
        changeParentCentralization: function (value) {
            this.parentCentralization = value;
            this.$emit("message", "change-parent-centralization", this.arrowType, value);
        },
        changeDirection: function(value) {
            this.direction = value;
            this.$emit("message", "change-direction", this.arrowType, value);
        },
        changeSortMethod: function (value) {
            this.sortMethod = value;
            this.$emit("message", "change-sort-method", this.arrowType, value);
        },
        changeShakeTowards: function(value) {
            this.shakeTowards = value;
            this.$emit("message", "change-shake-towards", this.arrowType, value);
        }
    },
    mounted() {
        console.log("Hierarchical Layout Base Component Mounted");
    },
    components: {
        LabelWithTooltip, InputRange, InputSelect
    },
    emits: ['message', 'open-bs-modal']
}
</script>