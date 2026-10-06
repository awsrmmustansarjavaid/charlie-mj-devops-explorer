export function advise(action,tech,{technologies=[],learning={},labs=[],projects=[]}={}){
 const name=tech?.name||tech||'this technology';
 if(action==='explain') return `${name} is a DevOps technology in your catalog. Start with its purpose, core concepts, common commands, official documentation, then practice with a small lab.`;
 if(action==='next') return `Next for ${name}: verify prerequisites, complete one focused lab, save useful documentation to a collection, then add a small project checkpoint.`;
 if(action==='gaps') return `Skill-gap check for ${name}: identify missing prerequisites, unfinished learning tasks and uncompleted labs before marking it comfortable or mastered.`;
 if(action==='plan') return `7-day ${name} plan: Day 1 fundamentals; Day 2 setup; Day 3 core workflow; Day 4 networking/integration; Day 5 troubleshooting; Day 6 lab; Day 7 review + mini project.`;
 if(action==='lab') return `Suggested lab: install ${name}, perform one core workflow, capture expected output, add a checkpoint, and document one troubleshooting scenario.`;
 if(action==='project') return `Suggested project: use ${name} inside a small DevOps pipeline and track setup, implementation, validation and documentation as project checkpoints.`;
 if(action==='compare') return `Comparison mode: compare ${name} by purpose, architecture, ecosystem, learning curve, operational complexity and fit for your current stack.`;
 return `AI Advisor is available offline with rule-based guidance. Configure Ollama, LM Studio or an OpenAI-compatible endpoint in Settings for optional model-assisted actions.`;
}
