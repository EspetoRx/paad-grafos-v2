<template>
    <p>Semente Randômica Deste desenho:<br />{{ randomSeed }}</p>
    <InputText
        :inputId="'options.layout.randomSeed'"
        :inputEnabled="true"
        :inputInitialValue="randomSeed"
        :inputPlaceholder="'//Código do posicionamento dos nodes.'"
        :isLabelEnabled="true"
        :labelValue="'Semente randômica: (Repaint Canvas)'"
        :tooltip="'Options.Layout.RandomSeed - Quando NÃO estiver usando o layout hierárquico, os '+
            'nós são posicionados aleatoriamente inicialmente. Isso significa que o resultado estabelecido'+
            ' é diferente a cada vez. Se você fornecer uma semente aleatória manualmente, o layout será o '+
            'mesmo todas as vezes. O ideal é tentar com uma semente indefinida, recarregar até ficar satisfeito '+
            'com o layout e usar o método getSeed() para verificar a semente.'"
        :hasSwitch="false"
        @input-value-change="changeRandomSeed"
    ></InputText>
</template>

<script>

import * as Vue from 'vue';
import InputText from '../Common/Inputs/InputText.vue';

export default {
    name: "Layout Component",
    props: [
        'encapsulateOptions',
        'encapsulateLocalNetwork'
    ],
    data(){
        return{
            options: null,

            randomSeed: "",
            abracadabra: "",
        }
    },
    methods: {
        changeRandomSeed: function(value) {
            this.randomSeed = value;
            if (value == "undefined") {
                this.options.layout.randomSeed = undefined;
            } else {
                this.options.layout.randomSeed = value;
                this.$emit('canvas-key-change', true);
            }
        }
    },
    watch: {
        options: {
            handler: function(newValue, oldValue) {
                console.log(newValue);
                this.$emit('options-has-changed', newValue);
            },
            deep: true
        }
    },
    mounted(){
        this.options = this.encapsulateOptions;
        let value = Vue.toRaw(this.encapsulateLocalNetwork).getSeed();
        console.log("value: " + value);
        this.abracadabra = ""+value;
        this.randomSeed = ""+value;
    },
    components: {
        InputText
    },
    emits: ['options-has-changed', 'canvas-key-change'],
}
</script>