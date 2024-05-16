const fs = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, '已整理');

const filesObj = {}

async function readImgUrl() {
  const filePath = path.join(__dirname, 'imgUrl/index.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(data);
    return json;
  } catch (err) {
    console.log(err);
  }
}



async function processFile(file) {
  const imgUrlJSON = await readImgUrl()
  const filePath = path.join(folderPath, file);
  if (file.endsWith('.html') || file.endsWith('.json')) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const key = file.split('.')[0];
      if(!filesObj[key]) {
        filesObj[key] = { name: key };
      }
      const imgUrl = imgUrlJSON[key]
      if(!imgUrl) {
        console.log(key, 'json文件中缺少imgUrl字段');
        return;
      }
      
      if(file.endsWith('.json')) {
        const {defaultWidth, defaultHeight} = JSON.parse(data);
        
        if(!defaultWidth || !defaultHeight) {
          console.log(key, 'json文件中缺少defaultWidth或defaultHeight字段');
          return;
        }
        filesObj[key] = {
          ...filesObj[key],
          width: parsePixelString2Number(defaultWidth),
          height: parsePixelString2Number(defaultHeight),
        }
      }
      if(file.endsWith('.html')) {
        filesObj[key] = {
          ...filesObj[key],
          html: data
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

const parsePixelString2Number = (str) => {
  if(typeof str === 'number') return str;
  return parseInt(str.replace('px', ''));
}

async function processFiles() {
  try {
    const files = await fs.readdir(folderPath);
    const promises = files.map(processFile);
    await Promise.all(promises);

    // 将filesObj写入文件
    await fs.writeFile('output.json', JSON.stringify(filesObj, null, 2));
  } catch (err) {
    console.log(err);
  }
}

processFiles();