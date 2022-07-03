import { JSDOM } from "jsdom"

const vivaldiSourceIndexUrl = "https://vivaldi.com/source/"

export async function getVivaldiIndexPageAnchorArray() {
  let html = await (await fetch(vivaldiSourceIndexUrl)).text()
  let root = new JSDOM(html).window.document
  let array = [
    ...root.querySelectorAll<HTMLAnchorElement>("main#main table tr a"),
  ]
  return array
}

export function getAnchorVersion(anchor: Element) {
  let text = anchor.textContent || ""
  return text.replace(/vivaldi-source_([0-9.]+).tar.xz/, "$1")
}
