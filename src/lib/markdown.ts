import MarkdownIt from 'markdown-it'

export interface Frontmatter {
  title?: string
  description?: string
  date?: string
  [key: string]: unknown
}

export interface ContentItem {
  path: string
  title: string
  description?: string
}

export interface ParsedMarkdown {
  html: string
  frontmatter: Frontmatter
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

function parseFrontmatter(content: string): { frontmatter: Frontmatter; body: string } {
  const frontmatter: Frontmatter = {}
  let body = content

  if (content.startsWith('---')) {
    const endIndex = content.indexOf('---', 3)
    if (endIndex !== -1) {
      const yaml = content.slice(3, endIndex).trim()
      body = content.slice(endIndex + 3).trim()

      for (const line of yaml.split('\n')) {
        const match = line.match(/^(\w+):\s*(.*)$/)
        if (match) {
          const key = match[1]
          const value = match[2]
          if (key && value) {
            frontmatter[key] = value.replace(/^["']|["']$/g, '')
          }
        }
      }
    }
  }

  return { frontmatter, body }
}

export function parseMarkdown(source: string): ParsedMarkdown {
  const { frontmatter, body } = parseFrontmatter(source)
  const html = md.render(body)

  return { html, frontmatter }
}

export function getAllContentPaths(): string[] {
  const paths: string[] = []
  
  const modules = import.meta.glob('@/content/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  })

  for (const path of Object.keys(modules)) {
    const relativePath = path.replace('/src/content/', '').replace('.md', '')
    paths.push(relativePath)
  }

  return paths
}

export function getAllContent(): ContentItem[] {
  const modules = import.meta.glob('@/content/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  })

  const contents: ContentItem[] = []

  for (const path of Object.keys(modules)) {
    const relativePath = path.replace('/src/content/', '').replace('.md', '')
    const source = modules[path] as string
    const { frontmatter } = parseFrontmatter(source)
    
    const parts = relativePath.split('/')
    const lastPart = parts[parts.length - 1]
    const title = frontmatter.title 
      || (lastPart ? lastPart.replace(/-/g, ' ') : relativePath)
    const description = frontmatter.description

    contents.push({ path: relativePath, title, description })
  }

  return contents
}

export function getDirectoryChildren(dirPath: string): ContentItem[] {
  const allContent = getAllContent()
  
  if (!dirPath || dirPath === 'index') {
    return allContent
      .filter(item => !item.path.includes('/'))
      .filter(item => item.path !== 'index')
  }
  
  const normalizedPath = dirPath.startsWith('/') ? dirPath.slice(1) : dirPath

  return allContent.filter((item) => {
    const itemDir = item.path.split('/').slice(0, -1).join('/')
    const isIndexFile = item.path.endsWith('/index')
    return itemDir === normalizedPath && !isIndexFile
  })
}

export function hasChildPages(path: string): boolean {
  const children = getDirectoryChildren(path)
  return children.length > 0
}

export function getNavigationLinks(): ContentItem[] {
  const allContent = getAllContent()
  const dirs = new Set<string>()

  for (const item of allContent) {
    const parts = item.path.split('/')
    const firstPart = parts[0]
    if (parts.length > 1 && firstPart) {
      dirs.add(firstPart)
    }
  }

  const links: ContentItem[] = []

  for (const dir of dirs) {
    const indexPath = allContent.find(item => item.path === `${dir}/index`)
    if (indexPath) {
      links.push({
        path: dir,
        title: indexPath.title || dir,
        description: indexPath.description,
      })
    }
  }

  return links.sort((a, b) => a.path.localeCompare(b.path))
}

export async function loadMarkdown(path: string): Promise<ParsedMarkdown | null> {
  const normalizedPath = path === '' || path === '/' ? 'index' : path

  try {
    const modules = import.meta.glob('@/content/**/*.md', {
      query: '?raw',
      import: 'default',
    })

    // Try direct path first, then append /index
    const filePath = `/src/content/${normalizedPath}.md`
    let fullPath = Object.keys(modules).find((p) => p.endsWith(filePath))
    
    // If not found and doesn't end with /index, try /index
    if (!fullPath && !normalizedPath.endsWith('/index')) {
      const indexPath = `/src/content/${normalizedPath}/index.md`
      fullPath = Object.keys(modules).find((p) => p.endsWith(indexPath))
    }

    if (!fullPath) return null

    const loader = modules[fullPath]
    if (!loader) return null
    const source = (await loader?.()) as string
    return parseMarkdown(source)
  }
  catch {
    return null
  }
}
