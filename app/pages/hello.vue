import { definePageMeta } from "nuxt/app";

<script setup lang="ts">
definePageMeta({
  layout: 'custom',
  // Remove the header
  header: false,
  // Remove the footer
  footer: false,
})
</script>
<template>
  <div>
    <h1>Hello</h1>
  </div>
</template>