<template>
  <div class="container" :style="{height: innerHeight}">
    <div class="container-header">
      <el-input placeholder="输入关键字.." v-model="keyword" @keyup.native="getNews">
        <el-select class="el-select" v-model="type" slot="prepend" placeholder="请选择.." @change="getNews">
          <el-option v-for="mode in modes" :key="mode.id" :label="mode.label" :value="mode.value"></el-option>
        </el-select>
      </el-input>
    </div>
    <div class="container-body">
      <el-collapse  accordion>
        <el-collapse-item v-for="item in now" :key="item.id">
          <template slot="title">
            <div class="collapse-item-profile">
              <label>创建时间:&nbsp;&nbsp;<span>{{item.createAt}}</span></label>&nbsp;&nbsp;&nbsp;&nbsp;
              <label>来源:&nbsp;&nbsp;<span>{{item.from}}</span></label>
            </div>
            <span class="collapse-item-title">{{item.title}}</span>
          </template>
          <div v-html="item.content"></div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    name: 'News',
    mounted () {
      this.$nextTick(function () {
        this.getSearchMode()
        this.getNews()
      })
    },
    methods: {
      ...mapActions('news', [
        'getSearchMode',
        'getNews'
      ]),
      ...mapMutations('news', [
        'updateType',
        'updateKeyword'
      ])
    },
    computed: {
      ...mapGetters('news', [ 'now', 'modes' ]),
      type: {
        get () {
          return this.$store.state.news.type
        },
        set (value) {
          this.updateType(value)
        }
      },
      keyword: {
        get () {
          return this.$store.state.news.keyword
        },
        set (value) {
          this.updateKeyword(value)
        }
      },
      innerHeight () {
        return window.innerHeight - 16 + 'px'
      }
    }
  }
</script>

<style>
  .el-collapse-item__wrap {
    background-color: #fed;
  }
</style>

<style scoped>
  .el-select {
    width:130px;
  }
  .container {
    width: 1068px;
    margin: 8px auto;
    overflow: auto;
  }
  .container-header,.container-body {
    width: 1048px;
  }
  .collapse-item-title {
    font-size: 1.25rem;
    font-weight: 600;
    padding-left: 15px;
  }
  .collapse-item-profile {
    display: inline-block;
    float: right;
    margin-right: 100px;
  }
  .collapse-item-profile>label {
    font-size: .75rem;
    font-weight: 400;
    color: #555;
  }
  .collapse-item-profile>label>span {
    color: #777;
  }
</style>
