<template>
  <div>
    <h1>counter: {{counter}}</h1>
    <button @click="addCounter">add counter</button>
  </div>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    name: 'Counter',
    computed: {
      ...mapGetters([
        'counter'
      ]),
      selfProperty () {
        return 'self property'
      }
    },
    methods: {
      ...mapMutations([
        'addCounter'
      ]),
      selfMethod () {
        return 'self method'
      }
    }
  }
</script>
