const vivaldiBrowserUrl =
  "https://api.github.com/repos/ric2b/Vivaldi-browser/commits/master"

export async function getCommitVersion() {
  let response = await fetch(vivaldiBrowserUrl)
  let data = await response.json()
  let message: string = data.commit.message
  if (!message.startsWith("Added version ")) {
    throw new Error("last commit does not respect the usual format")
  }
  return message.replace("Added version ", "")
}
