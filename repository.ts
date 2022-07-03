import { exec } from "child_process"

const { PERSONAL_ACCESS_TOKEN } = process.env

export function updateRepository(
  versionStack: { version: string; url: string }[]
) {
  exec("git config --global user.name 'Mathieu CAROFF'")
  exec("git config --global user.email 'mathieu.caroff@free.fr'")
  exec(
    `git clone --depth=1 https://${PERSONAL_ACCESS_TOKEN}@github.com/ric2b/Vivaldi-browser w`
  )
  let previousDirectory = "w"
  while (versionStack.length > 0) {
    var { version, url } = versionStack.pop()!
    exec(`curl -O '${url}'`)
    let filename = url.split("/").slice(-1)[0]
    exec(`tar --xz -xf '${filename}'`)
    exec(`rm '${filename}`)
    exec(`mv vivaldi-source 'v${version}'`)

    // move .git and README.md from the old directory to the new one
    exec(
      `mv ${previousDirectory}/.git ${previousDirectory}/README.md 'v${version}'`
    )
    exec(`rm -r ${previousDirectory}`)

    // run git in the new directory
    process.chdir(`v${version}`)
    exec(`git add .`)
    exec(`git commit -m 'Added version ${version}' > /dev/null`)
    exec(`git tag ${version}`)
    // if there's more work to do, go up one directory
    if (versionStack.length > 0) {
      process.chdir(`..`)
    }
  }
  // once all versions have been committed, push them, together with their tag
  exec(`git push`)
  exec(`git push --tags`)

  return
}
