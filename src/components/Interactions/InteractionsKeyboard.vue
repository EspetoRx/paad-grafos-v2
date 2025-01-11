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
    <p v-if="!checkboxValue">Ative para começar</p>
    <SwitchWithInfo
        v-if="checkboxValue"
        :switchId="'options.interaction.keyboard.object.sending'"
        :switchDisabled="false"
        :switchInitialValue="enableObject"
        :switchTooltipEnabled="true"
        :switchTooltip="'Options.Interaction.Keyboard.Enabled True - Alterne o uso dos atalhos do teclado. Se esta opção não estiver definida, ela será definida como verdadeira se alguma das propriedades deste objeto estiver definida.'"
        :switchLabelEnabled="true"
        :switchLabelValue="(enableObject)?'Enviando objeto para a opção teclado':'Enviando booleano para a opção teclado'"
        @checkbox-status-changed="changeEnableObject"
    ></SwitchWithInfo>

    <div v-if="checkboxValue && enableObject">
        <InputRange
            :inputId="'options.interaction.keyboard.speed.x'"
            :isLabelEnabled="true"
            :min="-100"
            :max="100"
            :step="1"
            :initialValue="speed.x"
            :labelValue="'Velocidade em X'"
            :tooltip="'Options.Interaction.Keyboard.Speed.X - A velocidade com que a visualização se move na direção x ao pressionar uma tecla ou pressionar um botão de navegação.'"
            :disabled="false"
            @update-value-from-range-input="changeSpeedX"
        ></InputRange>
        <InputRange
            :inputId="'options.interaction.keyboard.speed.y'"
            :isLabelEnabled="true"
            :min="-100"
            :max="100"
            :step="1"
            :initialValue="speed.y"
            :labelValue="'Velocidade em Y'"
            :tooltip="'Options.Interaction.Keyboard.Speed.Y - A velocidade com que a visualização se move na direção y ao pressionar uma tecla ou pressionar um botão de navegação.'"
            :disabled="false"
            @update-value-from-range-input="changeSpeedY"
        ></InputRange>
        <InputRange
            :inputId="'options.interaction.keyboard.speed.zoom'"
            :isLabelEnabled="true"
            :min="0"
            :max="1"
            :step="0.01"
            :initialValue="speed.zoom"
            :labelValue="'Velocidade do Zoom'"
            :tooltip="'Options.Interaction.Keyboard.Speed.Zoom - A velocidade com que a visualização aumenta ou diminui o zoom pressionando uma tecla ou pressionando um botão de navegação.'"
            :disabled="false"
            @update-value-from-range-input="changeSpeedZoom"
        ></InputRange>
        <SwitchWithInfo
            :switchId="'options.interaction.keyboard.bindToWindow'"
            :switchDisabled="false"
            :switchInitialValue="bindToWindow"
            :switchTooltipEnabled="true"
            :switchTooltip="'Options.Interaction.Keyboard.BindToWindow - Ao vincular os atalhos de teclado à janela, eles funcionarão independentemente de qual objeto DOM está em foco. Se você tiver várias redes em sua página, poderá definir isso como falso, garantindo que os atalhos de teclado funcionem apenas na rede que está em foco.'"
            :switchLabelEnabled="true"
            :switchLabelValue="'Vincular à janela'"
            @checkbox-status-changed="changeBindToWindow"
        ></SwitchWithInfo>
        <Transition name="nested" :duration="350">
            <div class="m-1 p-1 border bg-light outer" v-if="!bindToWindow">
                <SwitchWithInfo :switchId="'options.interaction.keyboard.autoFocus'" :switchDisabled="false"
                    :switchInitialValue="autoFocus" :switchTooltipEnabled="true"
                    :switchTooltip="'Options.Interaction.Keyboard.AutoFocus - Quando keyboard.bindToWindow=false esta opção permite que você ignore o foco automático da rede ao passar o mouse.'"
                    :switchLabelEnabled="true" :switchLabelValue="'Auto Foco'"
                    @checkbox-status-changed="changeAutoFocus" divClasses="inner"></SwitchWithInfo>
            </div>
        </Transition>
    </div>
</template>
<script>
import InputRange from '../Common/Inputs/InputRange.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';

export default{
    name: "Interactions Keyboard Component",
    props: [
        'checkboxValue',
        'openBsModal',
        'bsModalReturnValue',
        'accordionType',
        'options'
    ],
    data() {
        return {
            enableObject: false,
            speed: {
                x: 10,
                y: 10,
                zoom: 0.02
            },
            bindToWindow: true,
            autoFocus: true
        }
    },
    methods: {
        changeEnableObject: function(value) {
            this.enableObject = value;
            this.$emit("message", "options.interaction.keyboard.enabled", this.accordionType, value);
        },
        changeSpeedX: function(value) {
            this.speed.x = value;
            this.$emit("message", "options.interaction.keyboard.speed.x", this.accordionType, value);
        },
        changeSpeedY: function(value) {
            this.speed.y = value;
            this.$emit("message", "options.interaction.keyboard.speed.y", this.accordionType, value);
        },
        changeSpeedZoom: function(value) {
            this.speed.zoom = value;
            this.$emit("message", "options.interaction.keyboard.speed.zoom", this.accordionType, value);
        },
        changeBindToWindow: function(value) {
            this.bindToWindow = value;
            this.$emit("message", "options.interaction.keyboard.bindToWindow", this.accordionType, value);
        },
        changeAutoFocus: function(value) {
            this.autoFocus = value;
            this.$emit("message", "options.interaction.keyboard.autoFocus", this.accordionType, value);
        }
    },
    components: {
        InputRange,
        SwitchWithInfo,
    },
    emits: ["message", "open-bs-modal"]
}
</script>