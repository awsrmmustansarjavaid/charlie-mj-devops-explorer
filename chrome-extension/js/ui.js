function escapeHtml(value="") {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function escapeAttr(value="") { return escapeHtml(value); }
function qs(sel, root=document) { return root.querySelector(sel); }
function qsa(sel, root=document) { return [...root.querySelectorAll(sel)]; }
function formatDate(iso) {
  if (!iso) return "—";
  try { return new Intl.DateTimeFormat(undefined,{dateStyle:"medium"}).format(new Date(iso)); } catch { return iso; }
}
function toast(message, type="info") {
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id="toast"; document.body.appendChild(el); }
  el.className = `toast ${type} show`;
  el.textContent = message;
  setTimeout(()=>el.classList.remove("show"), 2600);
}
function getBuiltInTools() {
  return [
    {name:"Docker",icon:"🐳",category:"Containers",url:"https://docs.docker.com/"},
    {name:"Kubernetes",icon:"☸️",category:"Kubernetes",url:"https://kubernetes.io/docs/"},
    {name:"AWS",icon:"☁️",category:"Cloud",url:"https://docs.aws.amazon.com/"},
    {name:"Jenkins",icon:"🔧",category:"CI/CD",url:"https://www.jenkins.io/doc/"},
    {name:"Terraform",icon:"◈",category:"IaC",url:"https://developer.hashicorp.com/terraform/docs"},
    {name:"GitHub",icon:"◉",category:"Git",url:"https://docs.github.com/"},
    {name:"Prometheus",icon:"◉",category:"Observability",url:"https://prometheus.io/docs/"},
    {name:"Argo CD",icon:"🚀",category:"GitOps",url:"https://argo-cd.readthedocs.io/"},
    {name:"Ansible",icon:"A",category:"Automation",url:"https://docs.ansible.com/"},
    {name:"Trivy",icon:"🛡",category:"Security",url:"https://trivy.dev/"},
    {name:"Grafana",icon:"📊",category:"Observability",url:"https://grafana.com/docs/"},
    {name:"Helm",icon:"⎈",category:"Kubernetes",url:"https://helm.sh/docs/"}
  ];
}
function getCategories() {
  return ["Fundamentals","Git & GitHub","Containers","Kubernetes","CI/CD","Infrastructure as Code","Cloud","GitOps","Observability","Security","Networking","Databases","Automation","Uncategorized"];
}
