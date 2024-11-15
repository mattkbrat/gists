 
const samplePath = "A_Glossary/16_Programming/106_Rust/Loop Labels.md";

function jd (path = samplePath) {
    if (!path) return ['', '']

    const folder = path.split("/")
    const filename = folder.pop()

    const folderSplit = folder.map(p => p.split("_"))
    const breadcrumbs = folderSplit.map((s) => s[0])

    const parts = breadcrumbs.map((p, i) => i === 0 ? p : Number(p).toString().padStart(3, '0') )

    const jd = `${parts[0]}${parts[1]}.${parts[2]}`

    const fullJD = `${jd} ${filename.split('.')[0]}`

    const tags = folderSplit.map((p) => `  - '#${p[1].toLowerCase()}'`).join('\n')

    return {
        jd,
        fullJD,
        tags
    }
}

module.exports = jd;
