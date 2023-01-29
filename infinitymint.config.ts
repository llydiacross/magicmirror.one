import { InfinityMintConfig } from "infinitymint/dist/app/interfaces"

// Please visit docs.infinitymint.app for a more complete starter configuration file
const config: InfinityMintConfig = {
  console: true,
  hardhat: {
    solidity: {
      version: "0.8.12",
      settings: {
        optimizer: {
          enabled: true,
          runs: 20
        }
      }
    },
    paths: {
      tests: "./tests"
    }
  },
  roots: ["../infinitymint-buildtools/"],
  settings: {
    networks: {},
    scripts: {
      disableJavascriptRequire: ["/infinitymint-buildtools/"]
    }
  }
}
export default config
