<template>
    <nav id="bottomNavbar" class="navbar fixed-bottom navbar-light bg-light bottom-navbar-style">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Fixed bottom</a>
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