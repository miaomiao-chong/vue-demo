<template>
  <ul class="switches">
    <li
      class="switch-item"
      v-for="(item, index) in items"
      :key="item"
      :class="{'active':modelValue === index}"
      @click="switchItem(index)"
    >
      <span>{{item}}</span>
    </li>
    <div class="active-bar" :style="activeStyle"></div>
  </ul>
</template>

<script>
  export default {
    name: 'switches',
    props: {
      // 文案数组
      items: {
        type: Array,
        default() {
          return []
        }
      },
      modelValue: {
        type: Number,
        default: 0
      }
    },
    computed: {
      activeStyle() {
        const x = 120 * this.modelValue
        return {
          transform: `translate3d(${x}px, 0, 0)`
        }
      }
    },
    methods: {
      switchItem(index) {
        this.$emit('update:modelValue', index)
      }
    }
  }
</script>

<style scoped lang="scss">
  .switches {
    display: flex;
    position: relative;
    align-items: center;
    width: 240px;
    border: 1px solid rgb(54, 52, 52);
    border-radius: 5px;
    margin: 0 auto;
    padding: 0;
    .switch-item {
      display: inline-block;
      position: relative;
      z-index: 10;
      flex: 1;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size:12px;
      color: rgb(206, 189, 189);
      &.active {
        color: white
      }
    }
    .active-bar {
      position: absolute;
      left: 0;
      top: 0;
      width: 120px;
      height: 30px;
      transition: transform 0.3s;
      border-radius: 5px;
      background: rgb(46, 44, 44);
    }
  }
</style>
