<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { ContentItem } from '@/lib/markdown'

const props = defineProps<{
  items: ContentItem[]
  title?: string
  emptyMessage?: string
}>()

const sortedItems = computed(() => {
  return [...props.items].sort((a, b) => a.path.localeCompare(b.path))
})

function getItemUrl(path: string) {
  return path === 'index' ? '/' : `/${path}`
}
</script>

<template>
  <div class="space-y-4">
    <h2 v-if="title" class="text-2xl font-semibold tracking-tight">
      {{ title }}
    </h2>
    
    <div v-if="sortedItems.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="item in sortedItems"
        :key="item.path"
        :to="getItemUrl(item.path)"
        class="block"
      >
        <Card
          class="transition-all duration-200 hover:shadow-md hover:border-primary/50 h-full cursor-pointer"
        >
          <CardHeader class="pb-2">
            <CardTitle class="text-lg hover:text-primary transition-colors">
              {{ item.title }}
            </CardTitle>
          </CardHeader>
          <CardContent v-if="item.description">
            <CardDescription>{{ item.description }}</CardDescription>
          </CardContent>
          <CardContent v-else>
            <CardDescription class="text-muted-foreground/50">Click to read</CardDescription>
          </CardContent>
        </Card>
      </RouterLink>
    </div>

    <p v-else class="text-muted-foreground text-center py-8">
      {{ emptyMessage || 'No content found' }}
    </p>
  </div>
</template>
