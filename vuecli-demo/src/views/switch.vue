<!--  -->
<template>
  <div style="width:300px">
    <switchTab :items="['aa', 'bb']" v-model="currentIndex"></switchTab>
    <div v-if="currentIndex==0">11111</div>
    <div v-if="currentIndex==1">22222</div>
  </div>
</template>

<script>
import switchTab from "../components/switchTab.vue";
export default {
  data() {
    return {
      currentIndex: 0,
    };
  },
  components: {
    switchTab,
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
};
</script>
<style >
</style>