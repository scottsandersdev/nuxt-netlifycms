<template>
  <section class="test-container">
    <div v-html="content.__content"></div>
    <div v-for="department in content.careers.departments">
      <h1>{{ department.title }}</h1>
      <h4>{{ department.heading }}</h4>
      <div v-for="position in department.positions">
        <a target="_blank" :href="position.link">{{ position.title }}</a>
      </div>
    </div>
  </section>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      content: state => state.content.careers
    })
  }
}
</script>

<style lang="scss">
</style>
