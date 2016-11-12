#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');
var _ = require('lodash-node');
var metaMarked = require('meta-kramed');
var sourceDir = './source';
var distDir = './dist';

try {
  console.log('checking if source directory exists');
  var srcDirStats = fs.lstatSync(sourceDir);
} catch(e) {
  console.log('no source directory found');
  console.log('exiting');
  process.exit(1);
}

// make dist dir if not exists
try {
  console.log('checking if dist directory exists');
  var dstDirStats = fs.lstatSync(distDir);
  // console.log(dstDirStats);
} catch(e) {
  console.log('creating dist directory');
  fs.mkdirSync(distDir);
  // console.log('-- caught error start --');
  // console.log(e);
  // console.log('-- caught error end --');
}

// parse files
var events = {
  conference: [],
  seminar: []
};

var fileNames = fs.readdirSync(sourceDir);
fileNames = fileNames.filter(function(fileName) { return fileName.match(/.*\.md$/); });
console.log('compiling: ', fileNames.length, 'files');
fileNames.forEach(function(fileName) {
  let content = fs.readFileSync(path.join(sourceDir, fileName), 'utf-8') || '';
  let parsedContent = metaMarked(content);
  if (parsedContent && parsedContent.meta && parsedContent.meta.type && events[parsedContent.meta.type]) {
    events[parsedContent.meta.type].push(parsedContent);
  }
});
// save target file
var destFilePath = path.join(distDir, 'events.json');
console.log('writing: ', destFilePath, '...');
fs.writeFile(destFilePath, JSON.stringify(events, null, 2), function (err) {
  if (err) return console.log(err);
  console.log('done');
});
