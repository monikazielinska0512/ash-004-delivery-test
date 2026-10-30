import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
process.env.GITHUB_REPOSITORY='monikazielinska0512/ash-004-delivery-test';
process.env.GH_TOKEN='synthetic-offline-token';
process.env.TEST_PR='1';
const a='a'.repeat(40),b='b'.repeat(40),source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
let wrongPath=false,writes=[];
globalThis.fetch=async (url,options={})=>{
  assert.ok(url.startsWith('https://api.github.com/repos/'+process.env.GITHUB_REPOSITORY+'/'));
  const path=url.split(process.env.GITHUB_REPOSITORY)[1];let data;
  if(path==='/pulls/1')data={number:1,user:{login:'github-actions[bot]'},base:{ref:'main',sha:a},head:{sha:b,repo:{full_name:process.env.GITHUB_REPOSITORY}}};
  else if(path==='/pulls/1/files?per_page=100')data=[{filename:wrongPath?'.github/workflows/verify.yml':'index.html'}];
  else if(path.startsWith('/contents/index.html?ref='))data={content:Buffer.from(path.endsWith(a)?source:source.replace('test C','test D').replace('Wersja C','Wersja D')).toString('base64')};
  else if(path.startsWith('/commits/'))data={check_runs:[]};
  else if(path==='/check-runs'&&options.method==='POST'){const body=JSON.parse(options.body);writes.push(body);data={...body,id:7,app:{id:15368,slug:'github-actions'}};return new Response(JSON.stringify(data),{status:201});}
  else throw Error('Unexpected API call');
  return new Response(JSON.stringify(data),{status:200});
};
test('failure injection publishes a failing check on the exact head',async()=>{process.env.TEST_OUTCOME='fail';await import('./verify.mjs?case=fail');assert.equal(writes.length,1);assert.equal(writes[0].head_sha,b);assert.equal(writes[0].conclusion,'failure');assert.equal(process.exitCode,1);process.exitCode=0;});
test('verified static change publishes success without executing PR code',async()=>{writes=[];process.env.TEST_OUTCOME='pass';await import('./verify.mjs?case=pass');assert.equal(writes.length,1);assert.equal(writes[0].conclusion,'success');});
test('workflow modification is rejected before any check publication',async()=>{writes=[];wrongPath=true;await assert.rejects(import('./verify.mjs?case=path'),/UNTRUSTED_CHANGED_PATH/);assert.equal(writes.length,0);});
