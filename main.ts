import { app, BrowserWindow } from 'electron';
import  path from 'path';
import * as fs from  'fs';
import type {ICreateAdmin} from './src/interface/User'
const configPath = path.join(app.getPath('userData'), 'admin.json');

export const saveAdminLocally=( adminData:ICreateAdmin)=> {
    fs.writeFileSync(configPath, JSON.stringify(adminData, null, 2));
}

function isAdminConfigured() {
    return fs.existsSync(configPath);
}

export const getLocalAdmin=()=> {
    if (!isAdminConfigured()) return null;
    const raw = fs.readFileSync(configPath);
    return JSON.parse(String(raw));
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        icon: path.join(__dirname, 'public/icon.ico'), // ícono para el escritorio
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    win.loadFile(path.join(__dirname, 'dist/index.html'));
    //win.loadURL('http://localhost:5173'); // o carga el build local
}

app.whenReady().then(createWindow);