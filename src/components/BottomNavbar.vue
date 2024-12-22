<style lang="css" scoped>

</style>
<template>
    <nav id="bottomNavbar" class="navbar fixed-bottom navbar-light bg-light bottom-navbar-style">
        <div class="container-fluid">
            <div id="vis-manipulation-area" class="d-flex flex-row w-100 justify-content-between"></div>
        </div>
    </nav>
</template>
<script>
export default {
    name: 'Bottom Navbar',
    mounted() {
        console.log('Bottom Navbar Component mounted.')
    }
}
</script>