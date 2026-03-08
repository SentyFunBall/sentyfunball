import { getCollection } from 'astro:content'
import { CATEGORIES } from '@/data/categories'

export const getCategories = async () => {
	const posts: any = await getCollection('blog')
	const categories = new Set(
		posts.filter((post: any) => !post.data.draft).map((post: any) => post.data.category)
	)
	return Array.from(categories).sort((a: any, b: any) =>
		CATEGORIES.indexOf(a) < CATEGORIES.indexOf(b) ? -1 : 1
	)
}

export const getPosts = async (max?: number) => {
	const posts: any = await getCollection('blog')
	return posts
		.filter((post: any) => !post.data.draft)
		.sort((a: any, b: any) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.slice(0, max)
}

export const getTags = async () => {
	const posts: any = await getCollection('blog')
	const tags = new Set()
	posts
		.filter((post: any) => !post.data.draft)
		.forEach((post: any) => {
			post.data.tags.forEach((tag: any) => {
				if (tag != '') {
					tags.add(tag.toLowerCase())
				}
			})
		})

	return Array.from(tags)
}

export const getPostByTag = async (tag: string) => {
	const posts = await getPosts()
	const lowercaseTag = tag.toLowerCase()
	return posts
		.filter((post: any) => !post.data.draft)
		.filter((post: any) => {
			return post.data.tags.some((postTag: any) => postTag.toLowerCase() === lowercaseTag)
		})
}

export const filterPostsByCategory = async (category: string) => {
	const posts = await getPosts()
	return posts
		.filter((post: any) => !post.data.draft)
		.filter((post: any) => post.data.category.toLowerCase() === category)
}
