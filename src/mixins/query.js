import wepy from 'wepy'
import ApolloClient from 'apollo-client-preset'
import { createHttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'

const client = new ApolloClient({
  link: createHttpLink({ uri: 'http://127.0.0.1:8080/graphql',
    fetch: function(url, options) {
      return wepy.request({
        url,
        data: options.body,
        header: options.headers,
        method: options.method
      }).then(r => {
        return {
          status: r.statusCode,
          text: () => Promise.resolve(JSON.stringify(r.data))
        }
      })
    }})
})

export default function(query) {
  function Query() {
    wepy.mixin.call(this)
    this.data = {
      query: {
        loading: true,
        error: null,
        data: null
      }
    }
  }

  Query.prototype = Object.create(wepy.mixin.prototype)
  Query.prototype.constructor = Query

  Query.prototype.onReady = function() {
    const self = this
    client.query({
      query: gql(query)
    })
      .then(resp => {
        self.query = {
          loading: resp.loading,
          error: null,
          data: resp.data
        }
      })
      .catch(e => {
        console.log(e)
        self.query = {
          loading: false,
          error: e,
          data: null
        }
      })
      .then(() => {
        self.$apply()
      })
  }

  return Query
}
