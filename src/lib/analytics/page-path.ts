export function buildPagePath(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname
}
