export default function formatPosts(posts) {
  const yearsSet = new Set()
  posts.forEach(post => {
    yearsSet.add(new Date(post.date).getFullYear())
  })

  const postSGroup = Array.from(yearsSet).map(year => ({ year, posts: [] }))

  posts.forEach(post => {
    const year = new Date(post.date).getFullYear()
    const month = new Date(post.date).getMonth() + 1
    const day = new Date(post.date).getDate()

    for (let i = 0; i < postSGroup.length; i++) {
      if (postSGroup[i].year === year) {
        postSGroup[i].posts.push({
          url: post.url,
          title: post.title,
          month,
          day
        })
        break
      }
    }
  })

  return postSGroup
}
