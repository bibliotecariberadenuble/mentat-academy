/* Comprobaciones automatizadas: node validar-aplicacion.js */
const fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
const errors=[];
for(const [i,code] of scripts.entries()){try{new vm.Script(code,{filename:'inline-'+i+'.js'})}catch(e){errors.push('Sintaxis del script '+i+': '+e.message)}}
for(const id of ['mission','mentatProfile','mentatCampaign','mentatMemory','mentatWeekly','mentatArchive','mentatTopFive','mentatSkillsPanel','mentatReflection'])if(!html.includes('id="'+id+'"'))errors.push('Falta elemento '+id);
for(const file of ['mentat-investigaciones.js','mentat-bank.js','manifest.webmanifest','service-worker.js'])if(!fs.existsSync(file))errors.push('Falta archivo '+file);
const sw=fs.readFileSync('service-worker.js','utf8');
for(const file of ['index.html','mentat-investigaciones.js'])if(!sw.includes(file))errors.push('Sin precaché '+file);
console.log('Scripts examinados:',scripts.length,'| Problemas:',errors.length);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}
