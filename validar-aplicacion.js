/* Comprobaciones automatizadas: node validar-aplicacion.js */
const fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
const errors=[];
for(const [i,code] of scripts.entries()){try{new vm.Script(code,{filename:'inline-'+i+'.js'})}catch(e){errors.push('Sintaxis del script '+i+': '+e.message)}}
for(const id of ['mission','mentatProfile','mentatCampaign','mentatReflection'])if(!html.includes('id="'+id+'"'))errors.push('Falta elemento '+id);
for(const file of ['mentat-investigaciones.js','mentat-bank.js','manifest.webmanifest','service-worker.js'])if(!fs.existsSync(file))errors.push('Falta archivo '+file);
const sw=fs.readFileSync('service-worker.js','utf8');
for(const file of ['index.html','mentat-investigaciones.js'])if(!sw.includes(file))errors.push('Sin precaché '+file);
for(const removed of ['mentatMemory','mentatWeekly','mentatArchive','mentatSkillsPanel'])if(html.includes('id="'+removed+'"'))errors.push('Función secundaria no eliminada: '+removed);
if(!html.includes('done.length%10===0)mentatReflect()'))errors.push('La reflexión debe aparecer cada diez investigaciones');
if(html.includes('id="mentatTopFive"')||html.includes('TOP 5 MENTAT'))errors.push('Ranking obsoleto sigue visible');
if(!html.includes('function mentatPendingMilestone()'))errors.push('Falta migración de exámenes anteriores');
if(!html.includes('version:2'))errors.push('Falta respaldo ampliado');
if(!html.includes('mentatAcademyProgressV2|'))errors.push('El progreso no está separado por alias');
if(!html.includes('mentatAcademyLegacyMigrated'))errors.push('Falta migración del progreso antiguo');
if(!html.includes('function mentatPendingMilestone()'))errors.push('Falta recuperación de exámenes pendientes');
console.log('Scripts examinados:',scripts.length,'| Problemas:',errors.length);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}
