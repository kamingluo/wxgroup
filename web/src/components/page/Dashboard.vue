<template>
  <div class="page">
       <!-- <div class="desc">t<span>e</span>s<span>t</span></div>-->
      <div class="code">群记分系统</div>
      
  </div>
</template>

<script>
export default {
  methods: {
  }
}
</script>


<style scoped>
    .page{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: #f3f3f3;
        box-sizing: border-box;
    }
    .code{
        line-height: 1;
        font-size: 120px;
        font-weight: bolder;
        color: #2d8cf0;
    }
    .code span{
        color: #00a854;
    }
    .desc{
        font-size: 30px;
        color: #777;
    }
</style>
