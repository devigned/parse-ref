const core = require("@actions/core");
const cp = require("child_process");

const refRegEx = /^refs\/tags\/(?<crate>.*?)\/v(?<version>.*)/;

/**
 *
 * @returns {Promise<void>} which resolves when the action is done.
 */
async function run() {
  const ref = core.getInput("ref");
  const matches = ref.match(refRegEx);
  if (matches === null) {
    core.setOutput("nomatch", true);
    return;
  }

  const crate = matches.groups.crate;
  core.setOutput("nomatch", false);
  core.setOutput("crate", crate);
  core.setOutput("version", matches.groups.version);
  core.setOutput("runtime", crate.replace(/^containerd-shim-/, ""));
}

function logError(e) {
  console.log("ERROR: ", e.message);
  try {
    console.log(JSON.stringify(e, null, 2));
  } catch (_) {
    // ignore json errors for now
  }
  console.log(e.stack);
}

module.exports = {
  run,
};
