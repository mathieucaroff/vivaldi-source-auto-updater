import * as http from "http"
import { getCommitVersion } from "./commit"
import { getAnchorVersion, getVivaldiIndexPageAnchorArray } from "./webpage"
import { versionCompare } from "./version"
import { updateRepository } from "./repository"

const PORT = process.env.PORT || 8080
const server = http.createServer(async (req, res) => {
  let anchorPromise = getVivaldiIndexPageAnchorArray()
  let versionPromise = getCommitVersion()

  let anchorArray = await anchorPromise
  let commitVersion = await versionPromise

  let anchorVersion = getAnchorVersion(anchorArray[0])

  let compare = versionCompare(commitVersion, anchorVersion)
  if (compare == 0) {
    res.writeHead(200)
    res.end(`Nothing to do. Version ${anchorVersion}`)
  } else if (compare == 1) {
    res.writeHead(500)
    res.end(
      `Bad version comparison result. The commit version appears to be bigger than that of the source: commit ${commitVersion} vs web page ${anchorVersion}`
    )
    // commit version is bigger
    throw new Error(
      "The commit version appears to be bigger than that of the web page"
    )
  } else {
    // commit version is smaller -> update
    let versionStack: { version: string; url: string }[] = []
    let k = 0
    while (
      versionCompare(commitVersion, getAnchorVersion(anchorArray[k])) == -1
    ) {
      versionStack.push({
        version: getAnchorVersion(anchorArray[k]),
        url: anchorArray[k].href,
      })
      k += 1
    }
    await updateRepository(versionStack)
  }
})

console.log(`serving at http://localhost:${PORT}/`)
server.listen(PORT)
