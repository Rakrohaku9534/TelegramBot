// TOP BODY FOR REQUIRED MODULE 
const { Telegraf } = require('telegraf');
const { Markup } = require('telegraf'); 
const axios = require('axios');
const { sizeFormatter } = require('human-readable');
const util = require('util');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const { exec } = require('child_process');
const _ = require('lodash');
const yargs = require('yargs/yargs');
const os = require('os');
const { performance } = require('perf_hooks');
const cron = require('node-cron');
const format = sizeFormatter()
const writeFileAsync = promisify(fs.writeFile);
const ONE_DAY_MS = 24 * 60 * 60 * 1000; 

// BOT ONLY 
const botToken = '6692303964:AAEKVPffjtE5twsFuAntqOJOnA9mKqpgnow'
const bot = new Telegraf(botToken);

// DATABASE
var low;
try {
  low = require('lowdb');
} catch (e) {
  low = require('./lib/lowdb');
}
const { LowSync, JSONFileSync } = low; 
global.api = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '');
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
const adapter = new JSONFileSync('./database.json'); 
global.db = new LowSync(adapter); 
global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000));
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read();
  global.db.READ = false;
  if (!global.db.data.user) {
    global.db.data.user = {};
  }
  global.db.chain = _.chain(global.db.data);
};
loadDatabase();

// SAVE DATABASE EVERY 30 SECOND
if (global.db) setInterval(async () => {
  if (global.db.data) await global.db.write();
}, 30 * 1000);

// YOUR COMMAND HERE
// EXAMPLE FOR /START
bot.command('start', async (ctx) => {
  // YOUR LOGIC IS HERE
});

// PUT ALL COMMAND HERE
// SEE THE DOCUMENTATION ON https://github.com/BotzIky/TelegramBot FOR REFERENCE 

// BOT STARTUP
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// PUT ALL FUNCTIONS UNDER THE BOT STARTUP
