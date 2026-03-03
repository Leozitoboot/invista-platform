#!/usr/bin/env node
/**
 * check-network.js
 * Detecta todos os IPs locais e exibe URLs prontas para uso.
 * Funciona em Wi-Fi, Ethernet e Hotspot do iPhone.
 */
import { networkInterfaces } from 'node:os';

const PORT = 5173;

function getAllLocalIPs() {
  const nets = networkInterfaces();
  const results = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        results.push({ iface: name, ip: net.address });
      }
    }
  }
  return results;
}

const ips = getAllLocalIPs();

console.log('\n🌐 inVista — Dev Server Network Info');
console.log('─'.repeat(44));
console.log(`  Local:    http://localhost:${PORT}`);

if (ips.length === 0) {
  console.log('  Network:  (nenhuma interface de rede ativa)');
  console.log('\n  ⚠️  Verifique se o Mac está conectado a uma rede Wi-Fi ou Hotspot.');
} else {
  for (const { iface, ip } of ips) {
    console.log(`  Network:  http://${ip}:${PORT}   [${iface}]`);
  }
}

console.log('─'.repeat(44));
console.log('  Use a URL "Network" no dispositivo na mesma rede.');
console.log('  Se trocou de rede (Wi-Fi → Hotspot), reinicie:');
console.log('  npm run dev\n');
