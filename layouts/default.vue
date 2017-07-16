<template>
  <div class="test-container">
    <nav>
      <nuxt-link class="link" to="/">Home</nuxt-link>
      <nuxt-link class="link" to="/about">About</nuxt-link>
      <nuxt-link class="link" to="/careers">Careers</nuxt-link>
      <nuxt-link class="link" to="/articles">Articles</nuxt-link>
    </nav>
    <nuxt/>
  </div>
</template>

<style lang="scss">
nav {
  margin-top: 30px;
}
.link {
  padding: 15px;
}
</style>
