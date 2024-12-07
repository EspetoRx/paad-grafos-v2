<template>
    <h5 class="text-center">
        Para fazer essa alteração é necessário repintar o canvas.<br />
        Deseja repintar o canvas?
    </h5>
    <div class="d-flex justify-content-around mt-3">
        <button type="button" class="btn btn-success" @click.prevent="emitValue(true)"><i class="fas fa-check"></i> Sim</button>
        <button type="button" class="btn btn-danger" @click.prevent="emitValue(false)"><i class="fas fa-close"></i> Não</button>
    </div>
</template>
<script>
export default {
    name: "Repaint Canvas",
    mounted() {
        console.log("Repaint Canvas Component Mounted");
    },
    methods: {
        emitValue: function(value) {
            this.$emit('value-returned', value);
        }
    },
    emits: ["value-returned"]
}
</script>