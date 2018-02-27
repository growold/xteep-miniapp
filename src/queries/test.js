export default `
    query {
      stories {
        edges {
          node {
            id
            title
            comments {
              id
              text
            }
            createdAt
          }
        }
      }
    }`
