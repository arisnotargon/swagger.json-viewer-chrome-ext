const fs = require('fs');
const path = require('path');

// 递归复制目录
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 复制 src 下所有文件到 dist
copyDir(path.resolve(__dirname, './src'), path.resolve(__dirname, './dist/src'));

// 复制swagger组件到 dist/swagger-ui
const swaggerDist = path.resolve(__dirname, './vendor/swagger-ui/dist');
const distSwagger = path.resolve(__dirname, './dist/src/swagger-ui');
if (!fs.existsSync(distSwagger)) fs.mkdirSync(distSwagger, { recursive: true });

['swagger-ui.css', 'swagger-ui-bundle.js', 'swagger-ui-standalone-preset.js'].forEach(file => {
  fs.copyFileSync(
    path.join(swaggerDist, file),
    path.join(distSwagger, file)
  );
});

// 打包
const archiver = require('archiver');

function zipDir(sourceDir, outPath) {
  const output = fs.createWriteStream(outPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

zipDir(path.resolve(__dirname, './dist/src'), path.resolve(__dirname, './dist/swagger-json-viewer.chrome-extension.zip'))
  .then(() => console.log('打包完成: chrome-extension.zip'))
  .catch(err => {
    console.error('打包失败:', err);
    process.exit(1);
  });