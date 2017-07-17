<template>
  <div>
    <section v-for="section in content.home.sections" class="test-container">
      <div v-html="section.__content"></div>
    </section>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      content: state => state.content
    })
  }
}
</script>

<style lang="scss">
</style>
