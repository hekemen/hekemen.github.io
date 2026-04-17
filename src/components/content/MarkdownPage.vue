<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'
import ContentList from './ContentList.vue'
import { getNavigationLinks, type ContentItem } from '@/lib/markdown'

const props = defineProps<{
  page: {
    html: string
    frontmatter: {
      title?: string
      description?: string
      [key: string]: unknown
    }
  } | null
  children?: ContentItem[]
}>()

const route = useRoute()

const navLinks = computed(() => getNavigationLinks())

const currentPath = computed(() => {
  const path = route.params.path
  if (!path) return '/'
  return '/' + (Array.isArray(path) ? path.join('/') : path)
})

watch(
  () => props.page?.frontmatter?.title,
  (title) => {
    if (title) {
      document.title = title
    }
    else {
      document.title = 'hekemen'
    }
  },
  { immediate: true },
)

const breadcrumbs = computed(() => {
  const path = route.params.path
  const segments: { label: string; path: string }[] = []

  if (!path) return segments

  const pathParts = Array.isArray(path) ? path : [path]
  let currentPath = ''

  for (const part of pathParts) {
    currentPath += `/${part}`
    segments.push({
      label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
      path: currentPath,
    })
  }

  return segments
})

function isActive(path: string) {
  const current = currentPath.value
  if (path === '/') return current === '/'
  return current === path || current.startsWith(path + '/')
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <div v-if="page" class="space-y-8">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-1">
          <RouterLink
            to="/"
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            :class="isActive('/')
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
          >
            Home
          </RouterLink>
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="`/${link.path}`"
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            :class="isActive('/' + link.path)
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
          >
            {{ link.title }}
          </RouterLink>
        </div>

        <div v-if="breadcrumbs.length > 1" class="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <RouterLink to="/" class="hover:text-foreground">Home</RouterLink>
          <span>/</span>
          <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
            <RouterLink
              v-if="index < breadcrumbs.length - 1"
              :to="crumb.path"
              class="hover:text-foreground"
            >
              {{ crumb.label }}
            </RouterLink>
            <span v-else class="text-foreground font-medium">{{ crumb.label }}</span>
            <span v-if="index < breadcrumbs.length - 1">/</span>
          </template>
        </div>
      </div>

      <div class="markdown-content" v-html="page.html" />

      <ContentList
        v-if="children && children.length > 0"
        :items="children"
        class="mt-8"
      />
    </div>

    <div v-else class="py-20 text-center">
      <h1 class="text-6xl font-bold text-muted-foreground/30">404</h1>
      <p class="mt-4 text-muted-foreground">Page not found</p>
      <Button as-child class="mt-6">
        <RouterLink to="/">Go Home</RouterLink>
      </Button>
    </div>
  </div>
</template>
