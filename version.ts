export function versionCompare(a: string, b: string) {
  let pa = a.split(".")
  let pb = b.split(".")
  let m = Math.max(pa.length, pb.length)
  for (let i = 0; i < m; i++) {
    let na = +pa[i]
    let nb = +pb[i]
    if (na > nb) return 1
    if (nb > na) return -1
    if (!isNaN(na) && isNaN(nb)) return 1
    if (isNaN(na) && !isNaN(nb)) return -1
  }
  return 0
}
