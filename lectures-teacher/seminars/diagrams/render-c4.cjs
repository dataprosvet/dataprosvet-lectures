// MERMAID_BUNDLE must point to a local Mermaid 12.0.0 browser bundle.
// Install playwright or expose it through NODE_PATH. CHROME_PATH is optional.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
(async () => {
  if (!process.env.MERMAID_BUNDLE) throw Error('Set MERMAID_BUNDLE to mermaid@12.0.0/dist/mermaid.min.js');
  const browser = await chromium.launch({headless:true, ...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
  try {
    const page = await browser.newPage({viewport:{width:3600,height:2200},screen:{width:3600,height:2200},deviceScaleFactor:1.5});
    await page.setContent('<html><body style="margin:0;background:white"><div id="diagram"></div></body></html>');
    await page.addScriptTag({path:process.env.MERMAID_BUNDLE});
    for (const name of ['context','containers']) {
      const base = path.join(__dirname, `002-${name}`);
      const source = fs.readFileSync(base+'.mmd','utf8');
      const svg = await page.evaluate(async ({source,name}) => {
        mermaid.initialize({startOnLoad:false,securityLevel:'loose',theme:'base'});
        const result = await mermaid.render('c4diagram',source);
        document.getElementById('diagram').innerHTML=result.svg;
        const el=document.querySelector('svg');
        // Trim export whitespace and move only the title, not C4 nodes or relationships.
        const groups=[...el.children].filter(n=>n.tagName.toLowerCase()==='g' && n.hasAttribute('transform')).map(n=>{const b=n.getBBox(); const m=n.transform.baseVal.consolidate().matrix;return {y:b.y+m.f,width:b.width,height:b.height}}).filter(b=>b.width&&b.height);
        const top=Math.min(...groups.map(b=>b.y));
        const title=[...el.querySelectorAll('text')].find(n=>n.textContent.startsWith('Уровень'));
        if(title) title.setAttribute('y',top-32);
        let box=el.getBBox();
        const ns='http://www.w3.org/2000/svg';
        const legend=document.createElementNS(ns,'g');
        legend.setAttribute('transform',`translate(${box.x},${box.y+box.height+35})`);
        // Native C4 has no legend command. These export-only samples are not model nodes.
        legend.innerHTML=`<rect width="1130" height="225" rx="8" fill="white" stroke="#d5dae1"/>
          <g font-family="Arial" font-size="16" fill="#222">
          <text x="20" y="26" font-weight="bold">ЛЕГЕНДА</text>
          <circle cx="45" cy="53" r="12" fill="#edf4fa" stroke="#9bb5ca"/><rect x="20" y="64" width="50" height="22" rx="11" fill="#edf4fa" stroke="#9bb5ca"/>
          <text x="90" y="70">Человек — Person</text>
          <rect x="20" y="104" width="50" height="28" rx="5" stroke="#a9bed8" fill="${name==='context'?'#dbeafe':'#eef5ff'}"/>
          <text x="90" y="124">${name==='context'?'Наша система — Software System':'Приложение — Container'}</text>
          <rect x="20" y="155" width="50" height="28" rx="5" fill="#f4f5f7" stroke="#c4cbd4"/>
          <text x="90" y="175">Внешняя система — Software System</text>
          ${name==='containers'?'<path d="M580 53v27c0 9 50 9 50 0V53" fill="#fef3c7" stroke="#c9a95d"/><ellipse cx="605" cy="53" rx="25" ry="7" fill="#fef3c7" stroke="#c9a95d"/><text x="650" y="70">Хранилище — Container</text><rect x="580" y="104" width="50" height="28" fill="none" stroke="#666" stroke-dasharray="6 4"/><text x="650" y="124">Граница программной системы</text>':''}
          <path d="M580 165h45" stroke="#333" stroke-width="2"/><path d="M621 160l10 5-10 5z" fill="#333"/>
          <text x="650" y="162">Инициатор обращения → получатель</text><text x="650" y="183">Подпись — цель; ответ подразумевается</text>
          <text x="20" y="211" font-size="13">Фигуры и цвета обозначают типы элементов, а не порядок выполнения или серверы.</text></g>`;
        el.appendChild(legend);
        box=el.getBBox();
        el.setAttribute('viewBox',`${box.x-25} ${box.y-25} ${box.width+50} ${box.height+50}`);
        el.setAttribute('width',box.width+50);el.setAttribute('height',box.height+50);el.style.maxWidth='none';
        return el.outerHTML;
      },{source,name});
      fs.writeFileSync(base+'.svg',svg);
      await page.locator('svg').screenshot({path:base+'.png'});
      console.log(`Rendered ${name} with graphical legend`);
    }
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1)});
