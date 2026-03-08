interface SiteConfig {
	site: string
	author: string
	title: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
	paginationSize: number
}

export const siteConfig: SiteConfig = {
	site: 'https://sentytek.com/', // Write here your website url
	author: 'SentyTek', // Site author
	title: 'SentyTek', // Site title.
	description:
		"Discover the innovative world of SentyTek, and how we're shaping the future of technology. Explore our latest projects, insights, and innovations.", // Description to display in the meta tags
	lang: 'en-US',
	ogLocale: 'en_US',
	shareMessage: 'Share this post', // Message to share a post on social media
	paginationSize: 6 // Number of posts per page
}
