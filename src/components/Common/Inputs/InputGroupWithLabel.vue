<template>
    <div class="input-group m-0 mt-1 mb-1">
        <div v-if="prepend" class="input-group-text p-1" :id="'basic-addon-prepend-' + Hash" data-bs-toggle="tooltip" :title="tooltip" v-html="prepend"></div>
        <input :type="inputType" :id="'input-' + Hash" class="form-control" v-model="inputValue" :aria-describedby="'basic-addon-prepend-' + Hash" :disabled="disabled" 
            :min="min" :max="max" :step="step">
        <div class="input-group-text p-0" v-if="append">
            <span class="input-group-text p-0" :id="'basic-addon-append-'+ Hash" >
                <div class="flex-shrink-1 badge bg-info m-1" data-bs-toggle="tooltip" :title="tooltip">
                    <i class="fa-solid fa-info text-right"></i>
                </div>
            </span>
        </div>
    </div>
</template>
<script>
import {hash} from '../../../utils/Hash';
export default {
    name: "Input Group With Label",
    props: {
        prepend: {
            default: null
        },
        append: {
            default: null
        },
        inputType: {
            default: "text"
        },
        tooltip: {
            default: ""
        },
        inputInitialValue: {
            default: ""
        },
        disabled: {
            default: false,
        },
        min: {
            required: false
        },
        max: {
            required: false
        },
        step: {
            required: false
        }
    },
    data() {
        return {
            Hash: hash(),
            inputValue: ''
        }
    },
    watch: {
        inputValue: function(newValue, oldValue) {
            this.$emit("input-value-change", newValue)
        }
    },
    mounted(){
        console.log("Input Group With Label");
        this.inputValue = this.inputInitialValue;
    },
    emits: ["input-value-change"]
}
</script>