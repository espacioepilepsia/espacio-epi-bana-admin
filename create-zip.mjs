import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

const output = fs.createWriteStream('espacio-epi-bana-static.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function() {
  console.log(`✅ ZIP creado: espacio-epi-bana-static.zip (${archive.pointer()} bytes)`);
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);
archive.directory('out/', false);
archive.finalize();
