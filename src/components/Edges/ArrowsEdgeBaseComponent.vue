<template>
    <p class="m-0 p-1" v-if="!checkboxValue">Ative para começar</p>
    <InputGroupWithLabel v-if="checkboxValue" :prepend="'Fator de escala:'" :append="true" :inputType="'number'"
        :tooltip="'Options.Edges.Arrows.' + capitalizeFirstLetter(arrowType) + '.ScaleFactor value. O fator de escala permite alterar o tamanho da ponta da seta.'"
        :inputInitialValue="scaleFactor" @input-value-change="changeScaleFactorValue"></InputGroupWithLabel>

    <LabelWithTooltip v-if="checkboxValue" :labelValue="'Tipo de seta'"
        :tooltip="'Options.Edges.Arrows.' + capitalizeFirstLetter(arrowType) + '.Type value. O tipo de ponto de extremidade. Os valores possíveis são: seta, barra, círculo e imagem. O padrão é seta.'"
        :forId="'input-select-' + arrowType + '-type'" :hasSwitch="false"></LabelWithTooltip>
    <InputSelect v-if="checkboxValue" :selectId="'input-select-' + arrowType + '-type'" :options="[
        { value: 'arrow', label: 'Seta', selected: true },
        { value: 'bar', label: 'Barra', selected: false },
        { value: 'box', label: 'Caixa', selected: false },
        { value: 'circle', label: 'Círculo', selected: false },
        { value: 'curve', label: 'Curvo', selected: false },
        { value: 'diamond', label: 'Diamond', selected: false },
        { value: 'image', label: 'Imagem', selected: false },
        { value: 'inv_curve', label: 'Curva Inversa', selected: false },
        { value: 'inv_triangle', label: 'Triângulo Inverso', selected: false },
        { value: 'triangle', label: 'Triângulo', selected: false },
        { value: 'vee', label: 'Vee', selected: false },
        { value: 'crow', label: 'Crow', selected: false },
    ]" :disabled="false" @update-selection="changeType"></InputSelect>

    <InputUrl v-if="checkboxValue && type=='image'" :idInput="'input-url-'+arrowType+'-src'" labelValue="Url da imagem"
        :placeholder="'https://www.google.com'"
        :tooltip="'Options.Edges.Arrows.'+capitalizeFirstLetter(arrowType)+'.Src - O URL do tipo de seta da imagem.'"
        :urlInitalValue="src" @url-value-update="changeSrc"></InputUrl>

    <SwitchWithInfo v-if="checkboxValue && type=='image'" :switchId="'options-edges-arrows-' + arrowType + '-imageHeight'"
        :switchDisabled="false" :switchInitialValue="imageHeightEnabled" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.Arrows.' + capitalizeFirstLetter(arrowType) + '.ImageHeight sending. A altura da seta da imagem. A altura do arquivo de imagem é usada se não estiver definida.'"
        :switchLabelEnabled="true" :switchLabelValue="'Habilitar altura da imagem'"
        @checkbox-status-changed="toggleImageHeightEnabled"></SwitchWithInfo>
    <InputGroupWithLabel v-if="checkboxValue && type=='image' && imageHeightEnabled" :prepend="'Altura da imagem:'" :append="true"
        :inputType="'number'"
        :tooltip="'Options.Edges.Arrows.' + capitalizeFirstLetter(arrowType) + '.ImageHeight value. A altura da seta da imagem. A altura do arquivo de imagem é usada se não estiver definida.'"
        :inputInitialValue="imageHeightValue" @input-value-change="changeImageHeightValue"></InputGroupWithLabel>
    <SwitchWithInfo v-if="checkboxValue && type=='image'" :switchId="'options-edges-arrows-' + arrowType + '-imageWidth'"
        :switchDisabled="false" :switchInitialValue="imageWidthEnabled" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.Arrows.' + capitalizeFirstLetter(arrowType) + '.ImageWidth sending. A largura da seta da imagem. A largura do arquivo de imagem é usada se não estiver definida.'"
        :switchLabelEnabled="true" :switchLabelValue="'Habilitar largura da imagem'"
        @checkbox-status-changed="toggleImageWidthEnabled"></SwitchWithInfo>
    <InputGroupWithLabel v-if="checkboxValue && type=='image' && imageWidthEnabled" :prepend="'Largura da imagem:'" :append="true"
        :inputType="'number'"
        :tooltip="'Options.Edges.Arrows.' + capitalizeFirstLetter(arrowType) + '.ImageWidth value. A largura da seta da imagem. A largura do arquivo de imagem é usada se não estiver definida.'"
        :inputInitialValue="imageWidthValue" @input-value-change="changeImageWidthValue"></InputGroupWithLabel>
</template>
<script>
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
import InputGroupWithLabel from '../Common/Inputs/InputGroupWithLabel.vue';
import InputSelect from '../Common/Inputs/InputSelect.vue';
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
import InputUrl from '../Common/Inputs/InputUrl.vue';
export default {
    name: "Arrows Edge Base Component",
    props: [
        'arrowType',
        'checkboxValue',
        'bsModalReturnValue'
    ],
    data() {
        return {
            awatingResponse: [],
            imageHeightEnabled: false,
            imageHeightValue: 1,
            imageWidthEnabled: false,
            imageWidthValue: 1,
            scaleFactor: 1,
            type: "arrow",
            src: new URL(`/public/images/arrow.png`, import.meta.url).href
        }
    },
    mounted() {
        console.log("Arrows Edge Base Component Mounted")
    },
    methods: {
        capitalizeFirstLetter: function (val) {
            return String(val).charAt(0).toUpperCase() + String(val).slice(1);
        },
        toggleImageHeightEnabled: function (value) {
            if (value) {
                this.imageHeightEnabled = value;
                this.$emit("message", "toggle-image-height-enabled", this.arrowType, value);
            } else {
                this.imageHeightEnabled = value;
                this.awatingResponse.push("repaint_canvas_image_height_enabled");
                this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
            }
        },
        toggleImageWidthEnabled: function (value) {
            if (value) {
                this.imageWidthEnabled = value;
                this.$emit("message", "toggle-image-width-enabled", this.arrowType, value);
            } else {
                this.imageWidthEnabled = value;
                this.awatingResponse.push("repaint_canvas_image_width_enabled");
                this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
            }
        },
        changeImageHeightValue: function (value) {
            this.imageHeightValue = value;
            if (this.imageHeightEnabled && !isNaN(value)) {
                this.$emit("message", "image-height-value", this.arrowType, parseInt(value));
            }
        },
        changeImageWidthValue: function (value) {
            this.imageWidthValue = value;
            if (this.imageWidthEnabled && !isNaN(value)) {
                this.$emit("message", "image-width-value", this.arrowType, parseInt(value));
            }
        },
        changeScaleFactorValue: function (value) {
            this.scaleFactor = value;
            if (!isNaN(value)) {
                this.$emit("message", "scale-factor", this.arrowType, parseInt(value));
            }
        },
        changeType: function (value) {
            this.type = value;
            this.$emit("message", "type", this.arrowType, value);
        },
        changeSrc: function(value) {
            this.src = value;
            this.$emit("message", "src", this.arrowType, value);
        }
    },
    components: {
        SwitchWithInfo,
        InputGroupWithLabel,
        InputSelect,
        LabelWithTooltip,
        InputUrl
    },
    watch: {
        bsModalReturnValue: function (newValue, oldValue) {
            if (newValue == null) return;
            if (this.awatingResponse.includes("repaint_canvas_image_height_enabled", 0)) {
                this.awatingResponse = this.awatingResponse.filter(function (e) {
                    e != "repaint_canvas_image_height_enabled"
                });
                this.imageHeightEnabled = !newValue;
                this.$emit("message", "toggle-image-height-enabled", this.arrowType, !newValue);
            }
            if (this.awatingResponse.includes("repaint_canvas_image_width_enabled", 0)) {
                this.awatingResponse = this.awatingResponse.filter(function (e) {
                    e != "repaint_canvas_image_width_enabled"
                });
                this.imageWidthEnabled = !newValue;
                this.$emit("message", "toggle-image-width-enabled", this.arrowType, !newValue);
            }
        }
    },
    emits: ['message', 'open-bs-modal']
}
</script>