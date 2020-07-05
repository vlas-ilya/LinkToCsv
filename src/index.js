const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const title = require('./loaders/title');
const author = require('./loaders/author');

const filePath = path.join(__dirname, '..', 'links.txt');
const outputPath = path.join(__dirname, '..', 'lines.csv');
const date = new Date('Jul 06, 2020');

function loadLinks() {
  const file = fs.readFileSync(filePath, 'utf-8');
  return file.split('\n').map(line => Promise.resolve({ url: line }))
}

async function loadPage(promise) {
  const data = await promise;
  const res = await fetch(data.url);
  const page = await res.text();
  return {
    ...data,
    page,
  }
}

async function loadTitle(promise) {
  const data = await promise;
  const { page } = data;
  return {
    ...data,
    title: title(page),
  };
}

async function loadAuthor(promise) {
  const data = await promise;
  const { page } = data;
  return {
    ...data,
    author: author(page),
  }
}

async function loadDate(promise, index) {
  const data = await promise;
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + Math.floor(index / 5));
  return {
    ...data,
    date: newDate.toLocaleString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
}

async function loadFrom(promise) {
  const data = await promise;
  const url = new URL(data.url);
  return {
    ...data,
    from: url.host,
  };
}

async function toCsv(promise) {
  const data = await promise;
  return `"${data.title}","Статья","","TODO","${data.date}","${data.url}","",""`
}

async function save(promises) {
  const lines = await Promise.all(promises);
  const title = 'Название,Тип,О чем,Статус,Запланированна,Ссылка,Repeat,Готовность';
  await fs.appendFile(outputPath, [title, ...lines].join('\n'), () => console.log('Done!'));
}

loadLinks()
  .flatMap(loadPage)
  .flatMap(loadTitle)
  .flatMap(loadDate)
  .flatMap(loadAuthor)
  .flatMap(loadFrom)
  .flatMap(toCsv)
  .reduce(([array], b) => [[...array, b]], [[]])
  .forEach(save);