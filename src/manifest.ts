import { ManifestV3 } from 'rollup-plugin-chrome-extension'

const manifest: ManifestV3 = {
  manifest_version: 3,
  content_scripts: [
    {
        js: ['scripts/script.ts'],
        matches: ["https://moodle.telt.unsw.edu.au/mod/quiz/*"],
        run_at: "document_end"
    },
  ],
}

export default manifest