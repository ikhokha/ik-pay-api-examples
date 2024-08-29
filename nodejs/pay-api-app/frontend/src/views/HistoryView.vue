<template>
  <main>
    <h1>Payments</h1>
    {{ payments }}
  </main>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      payments: []
    }
  },
  methods: {
    async getPayments() {
      try {
        const response = await axios.get(
          'http://localhost:3000/payments/history?startDate=startDate=2024-08-27&endDate=2024-08-28'
        )
        this.payments = response.data
      } catch (error) {
        console.error(error)
      }
    }
  },
  mounted() {
    this.getPayments()
  }
}
</script>
