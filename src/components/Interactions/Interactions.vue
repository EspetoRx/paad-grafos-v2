<style scoped>
.nested-enter-active,
.nested-leave-active {
    transition: all 0.3s ease-in-out;
}

/* delay leave of parent element */
.nested-leave-active {
    transition-delay: 0.25s;
}

.nested-enter-from,
.nested-leave-to {
    transform: translateY(30px);
    opacity: 0;
}

/* we can also transition nested elements using nested selectors */
.nested-enter-active .inner,
.nested-leave-active .inner {
    transition: all 0.3s ease-in-out;
}

/* delay enter of nested element */
.nested-enter-active .inner {
    transition-delay: 0.25s;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
    transform: translateX(30px);
    /*
  	Hack around a Chrome 96 bug in handling nested opacity transitions.
    This is not needed in other browsers or Chrome 99+ where the bug
    has been fixed.
  */
    opacity: 0.001;
}
</style>

<template>

    <SwitchWithInfo :switchId="'options.interaction.dragNodes'" :switchDisabled="false" :switchInitialValue="dragNodes"
        :switchTooltipEnabled="true"
        :switchTooltip="'Options.Interaction.dragNodes - Quando verdadeiro, os vértices que não estão fixos podem ser arrastados pelo usuário.'"
        :switchLabelEnabled="true" :switchLabelValue="'Arrastar vértices'" @checkbox-status-changed="changeDragNodes">
    </SwitchWithInfo>

    <SwitchWithInfo :switchId="'options.interaction.dragView'" :switchDisabled="false" :switchInitialValue="dragView"
        :switchTooltipEnabled="true"
        :switchTooltip="'Options.Interaction.DragView - Quando verdadeiro, a visualização pode ser arrastada pelo usuário.'"
        :switchLabelEnabled="true" :switchLabelValue="'Arrastar vista / imagem'"
        @checkbox-status-changed="changeDragView"></SwitchWithInfo>

    <SwitchWithInfo :switchId="'options.interaction.hideEdgesOnDrag'" :switchDisabled="false"
        :switchInitialValue="hideEdgesOnDrag" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Interaction.HideEdgesOnDrag - Quando verdadeiro, as arestas não são desenhadas ao arrastar a vista. Isso pode acelerar bastante a capacidade de resposta ao arrastar, melhorando a experiência do usuário.'"
        :switchLabelEnabled="true" :switchLabelValue="'Esconder arestas ao arrastar'"
        @checkbox-status-changed="changeHideEdgesOnDrag"></SwitchWithInfo>

    <SwitchWithInfo :switchId="'options.interaction.hideEdgesOnZoom'" :switchDisabled="false"
        :switchInitialValue="hideEdgesOnZoom" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Interaction.HideEdgesOnZoom - Quando verdadeiro, as arestas não são desenhadas ao aplicar zoom na visualização. Isso pode acelerar bastante a capacidade de resposta do zoom, melhorando a experiência do usuário.'"
        :switchLabelEnabled="true" :switchLabelValue="'Esconder arestas ao zoom'"
        @checkbox-status-changed="changeHideEdgesOnZoom"></SwitchWithInfo>

    <SwitchWithInfo :switchId="'options.interaction.hideNodesOnDrag'" :switchDisabled="false"
        :switchInitialValue="hideNodesOnDrag" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Interaction.HideNodesOnDrag - Quando verdadeiro, os vértices não são desenhados ao arrastar a visualização. Isso pode acelerar bastante a capacidade de resposta ao arrastar, melhorando a experiência do usuário.'"
        :switchLabelEnabled="true" :switchLabelValue="'Esconder vértices ao arrastar'"
        @checkbox-status-changed="changeHideNodesOnDrag"></SwitchWithInfo>

    <SwitchWithInfo :switchId="'options.interaction.hover'" :switchDisabled="false" :switchInitialValue="hover"
        :switchTooltipEnabled="true"
        :switchTooltip="'Options.Interaction.Hover - Quando verdadeiro, os vértices usam suas cores flutuantes quando o mouse passa sobre eles.'"
        :switchLabelEnabled="true" :switchLabelValue="'Pairar'" @checkbox-status-changed="changeHover"></SwitchWithInfo>

    <Transition name="nested" :duration="350">
        <div class="m-1 p-1 border bg-light outer" v-if="hover">
            <SwitchWithInfo :switchId="'options.interaction.hoverConnectedEdges'" :switchDisabled="false"
                :switchInitialValue="hoverConnectedEdges" :switchTooltipEnabled="true"
                :switchTooltip="'Options.Interaction.HoverConnectedEdges - Quando verdadeiro, ao passar o mouse sobre um vértice, suas arestas de conexão são destacadas.'"
                :switchLabelEnabled="true" :switchLabelValue="'Pairar Sobre Arestas Ajacentes'"
                @checkbox-status-changed="changeHoverConnectedEdges" divClasses="inner"></SwitchWithInfo>
        </div>
    </Transition>

    <AccordionBase :accordionData :bsModalReturnValue @message="message" @open-bs-modal="openBsModal" :options="this.localOptions"></AccordionBase>

    <SwitchWithInfo :switchId="'options.interaction.multiselect'" :switchDisabled="false"
        :switchInitialValue="multiselect" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Interaction.Multiselect - Quando verdadeiro, um clique prolongado (ou toque), bem como um clique com a tecla Control pressionada, serão adicionados à seleção.'"
        :switchLabelEnabled="true" :switchLabelValue="'Multiseleção'" @checkbox-status-changed="changeMultiselect">
    </SwitchWithInfo>

    <SwitchWithInfo :switchId="'options.interaction.navigationButtons'" :switchDisabled="false"
        :switchInitialValue="navigationButtons" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Interaction.NavigationButtons - Quando verdadeiro, os botões de navegação são desenhados na tela da rede. Estes são botões HTML e podem ser totalmente personalizados usando CSS.'"
        :switchLabelEnabled="true" :switchLabelValue="'Botões de Navegação'" @checkbox-status-changed="changeNavigationButtons">
    </SwitchWithInfo>

    <SwitchWithInfo :switchId="'options.interaction.selectable'" :switchDisabled="false"
        :switchInitialValue="selectable" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Interaction.Selectable - Quando verdadeiro, os vértices e arestas podem ser selecionados pelo usuário.'"
        :switchLabelEnabled="true" :switchLabelValue="'Selecionável'" @checkbox-status-changed="changeSelectable">
    </SwitchWithInfo>

    <SwitchWithInfo :switchId="'options.interaction.selectConnectedEdges'" :switchDisabled="false"
        :switchInitialValue="selectConnectedEdges" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Interaction.SelectConnectedEdges - Quando verdadeiro, ao selecionar um vértice, suas arestas de conexão são destacadas.'"
        :switchLabelEnabled="true" :switchLabelValue="'Selecionar Arestas Conectadas'" @checkbox-status-changed="changeSelectConnectedEdges">
    </SwitchWithInfo>

    <InputRange
        :inputId="'options.interaction.tooltipDelay'"
        :isLabelEnabled="true"
        :min="100"
        :max="1000"
        :step="1"
        :initialValue="tooltipDelay"
        :labelValue="'Atraso do tooltip'"
        :tooltip="'Options.Interaction.TooltipDelay - Quando vértices ou arestas têm um campo de \'title\' definido, isso pode ser mostrado como uma dica de ferramenta pop-up. A dica de ferramenta em si é um elemento HTML que pode ser totalmente estilizado usando CSS. O atraso é a quantidade de tempo em milissegundos que leva antes que a dica de ferramenta seja mostrada.'"
        :disabled="false"
        @update-value-from-range-input="changeTooltipDelay"
    ></InputRange>

    <InputRange
        :inputId="'options.interaction.zoomSpeed'"
        :isLabelEnabled="true"
        :min="1"
        :max="100"
        :step="1"
        :initialValue="zoomSpeed"
        :labelValue="'Velocidade do Zoom'"
        :tooltip="'Options.Interaction.ZoomSpeed - Quão rápido/áspero ou lento/preciso é o zoom.'"
        :disabled="false"
        @update-value-from-range-input="changeZoomSpeed"
    ></InputRange>

    <SwitchWithInfo :switchId="'options.interaction.zoomView'" :switchDisabled="false"
        :switchInitialValue="zoomView" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Interaction.ZoomView - Quando verdadeiro, o usuário pode ampliar.'"
        :switchLabelEnabled="true" :switchLabelValue="'Habilitar Zoom'" @checkbox-status-changed="changeZoomView">
    </SwitchWithInfo>
</template>
<script>
import AccordionBase from '../Common/Accordion/AccordionBase.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
import InputRange from '../Common/Inputs/InputRange.vue';

export default {
    name: "Interactions Component",
    props: [
        'options',
        'bsModalReturnValue'
    ],
    data() {
        return {

            localOptions: null,
            dragNodes: true,
            dragView: true,
            hideEdgesOnDrag: false,
            hideEdgesOnZoom: false,
            hideNodesOnDrag: false,
            hover: false,
            hoverConnectedEdges: true,
            keyboard: false,
            speed: {
                x: 10,
                y: 10,
                zoom: 0.02
            },
            bindToWindow: true,
            autoFocus: true,
            multiselect: false,
            navigationButtons: false,
            selectable: true,
            selectConnectedEdges: true,
            tooltipDelay: 300,
            zoomSpeed: 1,
            zoomView: true,
            accordionData: [
                {
                    id: 'keyboard',
                    title: 'Teclado',
                    body: 'InteractionsKeyboard',
                    tooltip: "Options.Interactions.Keyboard - Quando verdadeiro, os atalhos de teclado são " +
                        "habilitados com as configurações padrão. Para maior personalização, você pode fornecer um objeto.",
                    checkboxValue: this.keyboard
                },
            ],
        }
    },
    methods: {
        changeDragNodes: function (value) {
            this.dragNodes = value;
            this.localOptions.interaction.dragNodes = value;
        },
        changeDragView: function (value) {
            this.dragView = value;
            this.localOptions.interaction.dragView = value;
        },
        changeHideEdgesOnDrag: function (value) {
            this.hideEdgesOnDrag = value;
            this.localOptions.interaction.hideEdgesOnDrag = value;
        },
        changeHideEdgesOnZoom: function (value) {
            this.hideEdgesOnZoom = value;
            this.localOptions.interaction.hideEdgesOnZoom = value;
        },
        changeHideNodesOnDrag: function (value) {
            this.hideNodesOnDrag = value;
            this.localOptions.interaction.hideNodesOnDrag = value;
        },
        changeHover: function (value) {
            this.hover = value;
            this.localOptions.interaction.hover = value;
        },
        changeHoverConnectedEdges: function (value) {
            this.hoverConnectedEdges = value;
            this.localOptions.interaction.hoverConnectedEdges = value;
        },
        changeKeyboard: function (value) {
            this.keyboard = value;
            this.localOptions.interaction.keyboard = value;
        },
        changeToKeyboardObject: function () {
            this.keyboard = { enabled: true };
            this.localOptions.interaction.keyboard = { enabled: true };
        },
        changeKeyboardSpeedX: function (value) {
            this.speed.x = parseInt(value);
            this.localOptions.interaction.keyboard.speed = this.speed;
        },
        changeKeyboardSpeedY: function (value) {
            this.speed.y = parseInt(value);
            this.localOptions.interaction.keyboard.speed = this.speed;
        },
        changeKeyboardSpeedZoom: function (value) {
            this.speed.zoom = parseFloat(value);
            this.localOptions.interaction.keyboard.speed = this.speed;
        },
        changeKeyboardBindToWindow: function (value) {
            this.bindToWindow = value;
            this.localOptions.interaction.keyboard.bindToWindow = value;
        },
        changeKeyboardAutoFocus: function (value) {
            this.autoFocus = value;
            this.localOptions.interaction.keyboard.autoFocus = value;
        },
        message: function (message, id, value) {
            if (id == 'keyboard') {
                if (message == 'update-checkbox-accordion') this.changeKeyboard(value);
                if (message == 'options.interaction.keyboard.enabled') { if (value) { this.changeToKeyboardObject() } else { this.changeKeyboard(true) }; };
                if (message == 'options.interaction.keyboard.speed.x') this.changeKeyboardSpeedX(value);
                if (message == 'options.interaction.keyboard.speed.y') this.changeKeyboardSpeedY(value);
                if (message == 'options.interaction.keyboard.speed.zoom') this.changeKeyboardSpeedZoom(value);
                if (message == 'options.interaction.keyboard.bindToWindow') this.changeKeyboardBindToWindow(value);
                if (message == 'options.interaction.keyboard.autoFocus') this.changeKeyboardAutoFocus(value);
            }
        },
        changeMultiselect: function (value) {
            this.multiselect = value;
            this.localOptions.interaction.multiselect = value;
        },
        changeNavigationButtons: function (value) {
            this.navigationButtons = value;
            this.localOptions.interaction.navigationButtons = value;
        },
        changeSelectable: function(value) {
            this.selectable = value;
            this.localOptions.interaction.selectable = value;
        },
        changeSelectConnectedEdges:function(value){
            this.selectConnectedEdges = value;
            this.localOptions.interaction.selectConnectedEdges = value;
        },
        changeTooltipDelay: function(value) {
            this.tooltipDelay = parseInt(value);
            this.localOptions.interaction.tooltipDelay = parseInt(value);
        },
        changeZoomSpeed: function(value) {
            this.zoom = parseInt(value);
            this.localOptions.interaction.zoomSpeed = parseInt(value);
        },
        changeZoomView: function(value) {
            this.zoomView = value;
            this.localOptions.interaction.zoomView = value;
        },
        openBsModal: function (title, body) {

        }
    },
    watch: {
        localOptions: {
            handler: function (newValue, oldValue) {
                this.$emit("options-has-changed", newValue);
            },
            deep: true
        },
    },
    mounted() {
        this.localOptions = this.options;

        if (typeof this.options.interaction.dragNodes == "boolean") {
            this.dragNodes = this.options.interaction.dragNodes;
        }
        if (typeof this.options.interaction.dragView == "boolean") {
            this.dragView = this.options.interaction.dragView;
        }
        if (typeof this.options.interaction.hideEdgesOnDrag == "boolean") {
            this.hideEdgesOnDrag = this.options.interaction.hideEdgesOnDrag;
        }
        if (typeof this.options.interaction.hideEdgesOnZoom == "boolean") {
            this.hideEdgesOnZoom = this.options.interaction.hideEdgesOnZoom;
        }
        if (typeof this.options.interaction.hideNodesOnDrag == "boolean") {
            this.hideNodesOnDrag = this.options.interaction.hideNodesOnDrag;
        }
        if (typeof this.options.interaction.hover == "boolean") {
            this.hover = this.options.interaction.hover;
        }
        if (typeof this.options.interaction.hoverConnectedEdges == "boolean") {
            this.hoverConnectedEdges = this.options.interaction.hoverConnectedEdges;
        }
        if (typeof this.options.interaction.keyboard == "boolean") {
            this.keyboard = this.options.interaction.keyboard;
            this.accordionData[0].checkboxValue = this.keyboard;
        } else if (typeof this.options.interaction.keyboard == "object") {
            if (typeof this.options.interaction.keyboard.enabled == "boolean") {
                this.keyboard = this.options.interaction.keyboard.enabled;
                this.accordionData[0].checkboxValue = this.keyboard;
            }
        }
        //TODO Keyboard
        if (typeof this.options.interaction.multiselect == "boolean") {
            this.multiselect = this.options.interaction.multiselect;
        }
        if (typeof this.options.interaction.selectable == "boolean") {
            this.selectable = this.options.interaction.selectable;
        }
        if (typeof this.options.interaction.selectConnectedEdges == "boolean") {
            this.selectConnectedEdges = this.options.interaction.selectConnectedEdges;
        }
        if (typeof this.options.interaction.tooltipDelay == "number") {
            this.tooltipDelay = this.options.interaction.tooltipDelay;
        }
        if (typeof this.options.interaction.zoomSpeed == "number") {
            this.zoomSpeed = this.options.interaction.zoomSpeed;
        }
        if (typeof this.options.interaction.zoomView == "boolean") {
            this.zoomView = this.options.interaction.zoomView;
        }
    },
    components: {
        SwitchWithInfo, AccordionBase, InputRange
    },
    emits: ['options-has-changed', 'open-bs-modal']
}
</script>