<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadMarkdown, getDirectoryChildren, type ParsedMarkdown, type ContentItem } from '@/lib/markdown'
import MarkdownPage from '@/components/content/MarkdownPage.vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
const page = ref<ParsedMarkdown | null>(null)
const children = ref<ContentItem[]>([])

async function loadPage(path: string | string[]) {
  const pathStr = Array.isArray(path) ? path.join('/') : path || 'index'
  page.value = await loadMarkdown(pathStr)
  children.value = getDirectoryChildren(pathStr)
}

onMounted(() => {
  loadPage(route.params.path as string)
})

watch(
  () => route.params.path,
  (newPath) => {
    loadPage(newPath as string)
  },
)
</script>

<template>
  <AppLayout>
    <MarkdownPage :page="page" :children="children" />
  </AppLayout>
</template>
