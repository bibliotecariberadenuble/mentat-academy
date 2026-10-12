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

const byGrade=[5,6,7,8].map(g=>bank.filter(x=>x.grade===g));
for(let i=0;i<4;i++){const titles=byGrade[i].slice(0,10).map(x=>x.title.replace(/^Expediente \d+: /,''));for(let j=i+1;j<4;j++){const other=new Set(byGrade[j].slice(0,10).map(x=>x.title.replace(/^Expediente \d+: /,'')));const overlaps=titles.filter(x=>other.has(x));if(overlaps.length)issues.push('Primeros diez casos compartidos entre '+(i+5)+' y '+(j+5)+': '+overlaps.join(', '))}}
if(issues.length){console.error('Errores adicionales:',issues.join('\n'));process.exitCode=1}

const courseBank=[5,6,7,8].map(g=>bank.filter(x=>x.grade===g));
for(let i=0;i<4;i++){
 for(let j=i+1;j<4;j++){
  const a=new Set(courseBank[i].slice(0,20).map(x=>x.question.trim().toLowerCase()));
  const duplicates=courseBank[j].slice(0,20).filter(x=>a.has(x.question.trim().toLowerCase()));
  if(duplicates.length)issues.push('Preguntas repetidas en los primeros 20 casos entre cursos '+(i+5)+' y '+(j+5));
 }
}
for(const grade of [5,6,7,8]){
 const rows=bank.filter(x=>x.grade===grade);
 for(let i=0;i<20;i++){
  if(!rows[i].title.startsWith('Expediente '+(i+1)+':'))issues.push('Orden incorrecto en '+rows[i].id);
  if(!rows[i].hint2||!rows[i].hint2.trim())issues.push('Falta segunda pista '+rows[i].id);
 }
}
if(issues.length){console.error(issues.join('\n'));process.exitCode=1}
