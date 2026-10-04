export const CATEGORIES = [
  { id: 'fundamentals', name: 'Fundamentals', icon: '🧱', tools: ['Linux','Networking','Git','GitHub','GitLab','Shell Scripting'] },
  { id: 'containers', name: 'Containers', icon: '🐳', tools: ['Docker','Docker Compose','Podman','Containerd','Docker Swarm'] },
  { id: 'kubernetes', name: 'Kubernetes', icon: '☸️', tools: ['Kubernetes','kubectl','Helm','Kustomize','Ingress','Services','Operators','Istio','Argo CD'] },
  { id: 'cicd', name: 'CI/CD', icon: '🔄', tools: ['Jenkins','GitHub Actions','GitLab CI/CD','CircleCI','Tekton','TeamCity'] },
  { id: 'iac', name: 'Infrastructure as Code', icon: '🏗️', tools: ['Terraform','OpenTofu','CloudFormation','Pulumi','Ansible'] },
  { id: 'cloud', name: 'Cloud', icon: '☁️', tools: ['AWS','Azure','Google Cloud','EKS','ECS','ECR','GKE','AKS'] },
  { id: 'observability', name: 'Observability', icon: '📊', tools: ['Prometheus','Grafana','Loki','OpenTelemetry','Jaeger','Elasticsearch'] },
  { id: 'security', name: 'Security', icon: '🔐', tools: ['Trivy','SonarQube','OWASP','Snyk','Vault'] },
  { id: 'gitops', name: 'GitOps', icon: '🚀', tools: ['Argo CD','Flux'] },
  { id: 'networking', name: 'Networking', icon: '🌐', tools: ['NGINX','HAProxy','Traefik','Envoy'] },
  { id: 'databases', name: 'Databases', icon: '🗄️', tools: ['PostgreSQL','MySQL','Redis','MongoDB'] }
];

export const TYPES = ['documentation','github-repository','tutorial','course','video','cheatsheet','tool','article'];
export const DIFFICULTIES = ['beginner','intermediate','advanced'];

export const ROADMAP = [
  ['Linux','Completed'], ['Git','Completed'], ['GitHub','Completed'], ['Docker','Completed'],
  ['CI/CD','Learning'], ['Kubernetes','Not Started'], ['Terraform','Not Started'], ['AWS','Not Started'],
  ['GitOps','Not Started'], ['Observability','Not Started']
];

export function inferCategory(title = '', tags = '') {
  const text = `${title} ${tags}`.toLowerCase();
  for (const category of CATEGORIES) {
    if (category.tools.some(tool => text.includes(tool.toLowerCase()))) return category.name;
  }
  return 'Other';
}

export function makeId() {
  return `devops-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
