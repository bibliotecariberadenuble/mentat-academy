/* Validación local del banco: node validar-investigaciones.js */
const fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('mentat-investigaciones.js','utf8');
const context={window:{}};vm.runInNewContext(source,context);
const bank=context.window.MENTAT_BANK,issues=[];
if(!Array.isArray(bank)||bank.length!==160)issues.push('Se esperaban 160 investigaciones.');
for(const grade of [5,6,7,8]){
 const rows=bank.filter(x=>x.grade===grade);
 if(rows.length!==40)issues.push('Curso '+grade+': no tiene 40 casos.');
 const ids=new Set(rows.map(x=>x.id));
 if(ids.size!==rows.length)issues.push('Curso '+grade+': identificadores duplicados.');
 const titles=new Set(rows.map(x=>x.title.replace(/^Expediente \d+:\s*/,'')));
 if(titles.size!==40)issues.push('Curso '+grade+': títulos repetidos.');
 for(const m of rows){
  if(!Array.isArray(m.options)||m.options.length<3||!Number.isInteger(m.correct)||m.correct<0||m.correct>=m.options.length)issues.push(m.id+': respuesta inválida.');
  for(const key of ['story','question','hint','explain','skill'])if(typeof m[key]!=='string'||!m[key].trim())issues.push(m.id+': falta '+key);
 }
}
console.log('Investigaciones:',bank.length,'| Problemas estructurales:',issues.length);
if(issues.length){console.error(issues.join('\n'));process.exitCode=1}
