import api from './api'
import * as types from './types'

const comment = {
  state: {
    comment: {
      replyNum: 0,
      voteNum: 0,
      replys: [],
      votes: []
    }
  },
  mutations: {
    [types.COMMENT] (state, comment) {
      state.comment = comment
    },
    [types.ADD_VOTE] (state, vote) {
      if (state.comment.votes) {
        var old = state.comment.votes.find(p => p.userId === vote.userId)
        if (!old) {
          state.comment.votes.concat(vote)
          state.comment.voteNum += 1
        }
      } else {
        state.comment.votes = [vote]
        state.comment.voteNum += 1
      }
    },
    [types.ADD_SUB_VOTE] (state, {replyId, vote}) {
      var reply = state.comment.replys.find(p => p.idStr === replyId)
      if (reply) {
        if (reply.votes) {
          var old = reply.votes.find(p => p.userId === vote.userId)
          if (!old) {
            reply.votes = state.comment.votes.concat(vote)
          }
        } else {
          reply.votes = [vote]
        }
      }
    },
    [types.ADD_REPLY] (state, reply) {
      state.comment.replys.push(reply)
      state.comment.replyNum += 1
    },
    [types.ADD_SUB_REPLY] (state, {replyId, reply}) {
      var pReply = state.comment.replys.find(p => p.idStr === replyId)
      if (pReply) {
        if (pReply.replys) {
          pReply.replys.push(reply)
        } else {
          pReply.replys = [reply]
        }
      }
    }
  },
  actions: {
    [types.GET_COMMENT] ({ commit, state }, { orgId, bsId, type, cb }) { // 获取评论
      api.getComment({ orgId, bsId, type, skip: state.comment.replys.length }, comment => {
        // debugger
        comment.replys = [].concat(state.comment.replys, comment.replys) // 合并数组
        commit(types.COMMENT, comment)
        cb()
      })
    },
    [types.ADD_VOTE] ({ commit, state }, { orgId, bsId, type, cb }) { // 添加点赞
      api.addVote({ orgId, bsId, type }, (vote) => {
        commit(types.ADD_VOTE, vote)
        cb()
      }, () => {})
    },
    [types.ADD_SUB_VOTE] ({ commit, state }, { orgId, bsId, type, replyId, cb }) { // 添加评论点赞
      api.addSubVote({ orgId, bsId, type, replyId }, (vote) => {
        commit(types.ADD_SUB_VOTE, {replyId, vote})
        cb()
      }, () => {})
    },
    [types.ADD_REPLY] ({ commit, state }, { orgId, bsId, type, content, cb }) { // 添加回复
      api.addReply({ orgId, bsId, type, content }, (reply) => {
        commit(types.ADD_REPLY, reply)
        cb()
      }, () => {})
    },
    [types.ADD_SUB_REPLY] ({ commit, state }, {orgId, bsId, type, content, replyId, cb}) { // 添加评论回复
      api.addSubReply({orgId, bsId, type, content, replyId}, (reply) => {
        commit(types.ADD_SUB_REPLY, {replyId, reply})
        cb()
      }, () => {})
    },
    [types.ADD_VIEW_NUM] ({ commit, state }, { orgId, bsId, type }) { // 添加浏览数
      api.addViewNum({orgId, bsId, type}, () => {}, () => {})
    }
  },
  getters: {
    [types.COMMENT]: state => state.comment
  }
}

export default comment
