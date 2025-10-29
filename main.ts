import { app, BrowserWindow } from 'electron';
import path from 'path';
import * as fs from 'fs';
const configPath = path.join(app.getPath('userData'), 'admin.json');
import { fileURLToPath } from 'url';



function isAdminConfigured() {
    return fs.existsSync(configPath);
}

export const getLocalAdmin = () => {
    if (!isAdminConfigured()) return null;
    const raw = fs.readFileSync(configPath);
    return JSON.parse(String(raw));
}

function createWindow() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const win = new BrowserWindow({
        show:false,
        width: 1024,
        height: 768,
        icon: path.join(__dirname, 'public/icon.ico'), // ícono para el escritorio
       /*  webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }, */
    });
    win.loadFile(path.join(__dirname, 'dist','index.html'));
    win.once('ready-to-show', () => win.show());
    //win.loadURL('http://localhost:5173'); // o carga el build local
}

app.on('window-all-closed', () => {
    console.log('🛑 Todas las ventanas cerradas');
    if (process.platform !== 'darwin') app.quit();
});

app.whenReady().then(createWindow);