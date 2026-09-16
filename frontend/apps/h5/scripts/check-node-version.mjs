const minimumVersion = [22, 22, 0];
const currentVersion = process.versions.node.split('.').map(Number);

function isSupported(current, minimum) {
  for (let index = 0; index < minimum.length; index += 1) {
    if (current[index] > minimum[index]) return true;
    if (current[index] < minimum[index]) return false;
  }
  return true;
}

if (!isSupported(currentVersion, minimumVersion)) {
  console.error(`@fa/h5 requires Node >=${minimumVersion.join('.')}; current version is ${process.versions.node}.`);
  console.error('React Router 8.3.0 declares the same Node engine requirement. Please switch Node before running H5 scripts.');
  process.exit(1);
}

console.log(`Node ${process.versions.node} satisfies @fa/h5 >=${minimumVersion.join('.')}.`);
