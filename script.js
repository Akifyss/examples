const fs = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, '已整理');


async function readImgUrl() {
  const filePath = path.join(__dirname, 'assets/imgUrl.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(data);
    return json.imgUrl;
  } catch (err) {
    console.log(err);
  }
}

async function readSortList() {
  const filePath = path.join(__dirname, 'assets/sortList.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(data);
    return json.sortList;
  } catch (err) {
    console.log(err);
  }

}


const filesObj = {}
const parseList = []
async function processFile(file) {
  const imgUrlJSON = await readImgUrl()
  const filePath = path.join(folderPath, file);
  if (file.endsWith('.html') || file.endsWith('.json')) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const key = file.split('.')[0];
      // 如果parseList中没有这个key，就添加
      if(!parseList.find(item => item.name === key)) {
        parseList.push({
          name: key
        })
      }
      
      // add imgUrl
      if(!parseList.find(item => item.name === key).imgUrl) {
        const imgUrl = imgUrlJSON[key]
        if(!imgUrl) {
          console.log(key, 'json文件中缺少imgUrl字段');
          return;
        }
        parseList.find(item => item.name === key).imgUrl = imgUrl
      }

    
      // add size
      if(file.endsWith('.json')) {
        const {defaultWidth, defaultHeight} = JSON.parse(data);
        if(!defaultWidth || !defaultHeight) {
          console.log(key, 'json文件中缺少defaultWidth或defaultHeight字段');
          return;
        }
        parseList.find(item => item.name === key).width = parsePixelString2Number(defaultWidth)
        parseList.find(item => item.name === key).height = parsePixelString2Number(defaultHeight)

      }

      // add data
      if(file.endsWith('.html')) {
        parseList.find(item => item.name === key).html = data
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
    console.log(parseList)
    // 将filesObj写入文件
    const sortList = await readSortList()
    const sortItemKeyList = ['name', 'imgUrl', 'html', 'width', 'height']
    const outputList = parseList.sort((a, b) => {
      const aIndex = sortList.indexOf(a.name)
      const bIndex = sortList.indexOf(b.name)
      return aIndex - bIndex
    }).map(item => {
      const newItem = {}
      sortItemKeyList.forEach(key => {
        newItem[key] = item[key]
      })
      return newItem
    })
    await fs.writeFile('output.json', JSON.stringify(outputList, null, 2));
  } catch (err) {
    console.log(err);
  }
}

processFiles();