<template>
  <div>

  <a href="http://localhost:4000/auth/github">Sign in with github</a>

  <div v-if="loading">Loading...</div>
  
  <div v-else-if="error">Error: {{ error.message }}</div>

  <template v-else-if="result && result.polls">
    <div class="poll-container">
      <template v-for="poll of result.polls" :key="poll.id">
        <div class="poll">
          <h4>{{ poll.title }}</h4>
          <div class="option-container">
            <template v-for="option of poll.options" :key="option.id">
              <div>
                <label>
                  <input :name=" 'radio-group-' + poll.id " type="radio" />
                  {{ option.text }}
                </label>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </template>

  </div>
</template>

<script>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup () {
    const { result, loading, error } = useQuery(gql`      
      query getUsers {
        polls {
          id
          title
          options {
            id
            text
          }
        }
      }
    `)

    return {
      result,
      loading,
      error,
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.poll-container {
  display: flex;
  justify-content: center;
}

.poll {
  border-radius: 10px;
  background-color: #6bd8ff;
  margin: 5px;
  padding: 5px;
}

.option-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
