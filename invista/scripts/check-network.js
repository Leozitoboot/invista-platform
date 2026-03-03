#!/usr/bin/env node
/**
 * check-network.js
 * Detecta o IP local e exibe a URL do dev server pronta para uso.
 */
import { createSocket } from 'node:dgram';
import { networkInterfaces } from 'node:os';

const PORT = 5173;

function getLocalIP() {
  // Método 1: via socket UDP (mais confiável)
  return new Promise((resolve) => {
    const socket = createSocket('udp4');
    socket.connect(80, '8.8.8.8', () => {
      const ip = socket.address().address;
      socket.close();
      resolve(ip);
    });
    socket.on('error', () => {
      // Fallback: via networkInterfaces
      const nets = networkInterfaces();
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          if (net.family === 'IPv4' && !net.internal) {
            resolve(net.address);
            return;
          }
        }
      }
      resolve('127.0.0.1');
    });
  });
}

const ip = await getLocalIP();

console.log('\n🌐 inVista — Dev Server Network Info');
console.log('─'.repeat(40));
console.log(`  Local:    http://localhost:${PORT}`);
console.log(`  Network:  http://${ip}:${PORT}`);
console.log('─'.repeat(40));
console.log('  Abra a URL "Network" em qualquer dispositivo');
console.log('  na mesma rede Wi-Fi para acessar o protótipo.\n');
