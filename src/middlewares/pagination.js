

export async function pagination(
  request,
  response,
  next
) {
  const { page = 1, limit = 25, search = '' } = request.query

  const parsedPage = Number(page)
  const parsedLimit = Number(limit)

  const skip = (parsedPage - 1) * parsedLimit

  request.pagination = {
    page: parsedPage,
    limit: parsedLimit,
    skip
  }

  request.search = search

  return next()
}
