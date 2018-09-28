<template>
  <div style="width:100%">
    <ul class="total-ul">
      <li v-for="v in totalData" :key="v.key">{{v.key}}
        <br/>
        <span>{{v.num==null?0:v.num}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['totalData']
  }
</script>

<style>
  .total-ul li {
    width: 20%;
    height: 3rem;
    float: left;
    color: #666;
    list-style: none;
    text-align: center;
    padding-top: 0.4rem;
    padding-left: 0.2rem;
    margin: 10px 0px 0px 2.8%;
    border: 1px solid #8ebf52;
    font-size: 0.7rem;
  }

  .total-ul li span {
    color: #f36d21;
    font-size: 0.8rem;
  }
</style>
