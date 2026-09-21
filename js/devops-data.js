// ============================================================
// CHARLIE MJ DEVOPS EXPLORER
// Technology & Category Data
// ============================================================

export const devopsCategories = [

    {
        id: "cloud",
        name: "Cloud Computing",
        description: "Cloud platforms, infrastructure and services.",
        technologies: [
            "aws",
            "azure",
            "google-cloud",
            "oracle-cloud",
            "digitalocean",
            "alibaba-cloud",
            "ibm-cloud",
            "cloudflare"
        ]
    },

    {
        id: "cicd",
        name: "CI/CD",
        description: "Continuous integration and continuous delivery tools.",
        technologies: [
            "jenkins",
            "github-actions",
            "gitlab-ci",
            "circleci",
            "tekton",
            "argo-cd"
        ]
    },

    {
        id: "containers",
        name: "Containers",
        description: "Container engines, runtimes and container tooling.",
        technologies: [
            "docker",
            "podman",
            "containerd",
            "cri-o",
            "docker-compose",
            "buildkit",
            "buildah"
        ]
    },

    {
        id: "kubernetes",
        name: "Kubernetes",
        description: "Kubernetes, managed Kubernetes and cloud-native tools.",
        technologies: [
            "kubernetes",
            "eks",
            "aks",
            "gke",
            "helm",
            "kustomize",
            "argo-cd"
        ]
    },

    {
        id: "iac",
        name: "Infrastructure as Code",
        description: "Provision and manage infrastructure using code.",
        technologies: [
            "terraform",
            "cloudformation",
            "pulumi",
            "opentofu",
            "aws-cdk"
        ]
    },

    {
        id: "automation",
        name: "Automation & Configuration",
        description: "Automate infrastructure, configuration and repetitive tasks.",
        technologies: [
            "ansible",
            "chef",
            "puppet",
            "saltstack"
        ]
    },

    {
        id: "security",
        name: "DevSecOps & Security",
        description: "Application, infrastructure and supply-chain security.",
        technologies: [
            "sonarqube",
            "trivy",
            "snyk",
            "owasp",
            "gitleaks",
            "checkov"
        ]
    },

    {
        id: "observability",
        name: "Monitoring & Observability",
        description: "Metrics, logs, traces and application observability.",
        technologies: [
            "prometheus",
            "grafana",
            "loki",
            "elastic",
            "jaeger",
            "opentelemetry"
        ]
    },

    {
        id: "version-control",
        name: "Version Control",
        description: "Source control and Git-based development platforms.",
        technologies: [
            "git",
            "github",
            "gitlab",
            "bitbucket",
            "gitea",
            "github-cli"
        ]
    },

    {
        id: "scripting",
        name: "Scripting & Programming",
        description: "Languages and command-line technologies used for automation.",
        technologies: [
            "bash",
            "python",
            "powershell",
            "go",
            "javascript"
        ]
    }

];


// ============================================================
// TECHNOLOGIES
// ============================================================

export const devopsTechnologies = {

    aws: {
        name: "Amazon Web Services",
        shortName: "AWS",
        category: "Cloud Computing",
        description: "Cloud computing platform providing compute, storage, networking, databases and more.",
        githubSearch: "aws",
        officialRepository: null
    },

    azure: {
        name: "Microsoft Azure",
        shortName: "Azure",
        category: "Cloud Computing",
        description: "Microsoft's cloud computing platform.",
        githubSearch: "azure",
        officialRepository: null
    },

    "google-cloud": {
        name: "Google Cloud",
        shortName: "GCP",
        category: "Cloud Computing",
        description: "Google's cloud computing platform.",
        githubSearch: "google-cloud",
        officialRepository: null
    },

    jenkins: {
        name: "Jenkins",
        shortName: "Jenkins",
        category: "CI/CD",
        description: "Automation server commonly used to build CI/CD pipelines.",
        githubSearch: "jenkins",
        officialRepository: "https://github.com/jenkinsci/jenkins"
    },

    "github-actions": {
        name: "GitHub Actions",
        shortName: "GitHub Actions",
        category: "CI/CD",
        description: "GitHub's automation and CI/CD platform.",
        githubSearch: "github-actions",
        officialRepository: null
    },

    "gitlab-ci": {
        name: "GitLab CI/CD",
        shortName: "GitLab CI",
        category: "CI/CD",
        description: "CI/CD automation integrated into GitLab.",
        githubSearch: "gitlab-ci",
        officialRepository: null
    },

    docker: {
        name: "Docker",
        shortName: "Docker",
        category: "Containers",
        description: "Platform for building, shipping and running containers.",
        githubSearch: "docker",
        officialRepository: "https://github.com/docker"
    },

    podman: {
        name: "Podman",
        shortName: "Podman",
        category: "Containers",
        description: "Daemonless container engine.",
        githubSearch: "podman",
        officialRepository: "https://github.com/containers/podman"
    },

    containerd: {
        name: "containerd",
        shortName: "containerd",
        category: "Containers",
        description: "Industry-standard container runtime.",
        githubSearch: "containerd",
        officialRepository: "https://github.com/containerd/containerd"
    },

    kubernetes: {
        name: "Kubernetes",
        shortName: "K8s",
        category: "Kubernetes",
        description: "Container orchestration platform for deploying and managing containerized applications.",
        githubSearch: "kubernetes",
        officialRepository: "https://github.com/kubernetes/kubernetes"
    },

    eks: {
        name: "Amazon EKS",
        shortName: "EKS",
        category: "Kubernetes",
        description: "Managed Kubernetes service from AWS.",
        githubSearch: "amazon-eks",
        officialRepository: null
    },

    aks: {
        name: "Azure Kubernetes Service",
        shortName: "AKS",
        category: "Kubernetes",
        description: "Managed Kubernetes service from Microsoft Azure.",
        githubSearch: "azure-kubernetes-service",
        officialRepository: null
    },

    gke: {
        name: "Google Kubernetes Engine",
        shortName: "GKE",
        category: "Kubernetes",
        description: "Managed Kubernetes service from Google Cloud.",
        githubSearch: "google-kubernetes-engine",
        officialRepository: null
    },

    helm: {
        name: "Helm",
        shortName: "Helm",
        category: "Kubernetes",
        description: "Package manager for Kubernetes.",
        githubSearch: "helm",
        officialRepository: "https://github.com/helm/helm"
    },

    terraform: {
        name: "Terraform",
        shortName: "Terraform",
        category: "Infrastructure as Code",
        description: "Infrastructure as Code tool for provisioning infrastructure.",
        githubSearch: "terraform",
        officialRepository: "https://github.com/hashicorp/terraform"
    },

    cloudformation: {
        name: "AWS CloudFormation",
        shortName: "CloudFormation",
        category: "Infrastructure as Code",
        description: "AWS Infrastructure as Code service.",
        githubSearch: "aws-cloudformation",
        officialRepository: null
    },

    pulumi: {
        name: "Pulumi",
        shortName: "Pulumi",
        category: "Infrastructure as Code",
        description: "Infrastructure as Code using general-purpose programming languages.",
        githubSearch: "pulumi",
        officialRepository: "https://github.com/pulumi/pulumi"
    },

    opentofu: {
        name: "OpenTofu",
        shortName: "OpenTofu",
        category: "Infrastructure as Code",
        description: "Open-source Infrastructure as Code tool.",
        githubSearch: "opentofu",
        officialRepository: "https://github.com/opentofu/opentofu"
    },

    ansible: {
        name: "Ansible",
        shortName: "Ansible",
        category: "Automation & Configuration",
        description: "Automation and configuration management platform.",
        githubSearch: "ansible",
        officialRepository: "https://github.com/ansible/ansible"
    },

    sonarqube: {
        name: "SonarQube",
        shortName: "SonarQube",
        category: "DevSecOps & Security",
        description: "Code quality and security analysis platform.",
        githubSearch: "sonarqube",
        officialRepository: "https://github.com/SonarSource/sonarqube"
    },

    trivy: {
        name: "Trivy",
        shortName: "Trivy",
        category: "DevSecOps & Security",
        description: "Security scanner for containers, filesystems, repositories and more.",
        githubSearch: "trivy",
        officialRepository: "https://github.com/aquasecurity/trivy"
    },

    prometheus: {
        name: "Prometheus",
        shortName: "Prometheus",
        category: "Monitoring & Observability",
        description: "Monitoring and alerting toolkit.",
        githubSearch: "prometheus",
        officialRepository: "https://github.com/prometheus/prometheus"
    },

    grafana: {
        name: "Grafana",
        shortName: "Grafana",
        category: "Monitoring & Observability",
        description: "Visualization and observability platform.",
        githubSearch: "grafana",
        officialRepository: "https://github.com/grafana/grafana"
    },

    git: {
        name: "Git",
        shortName: "Git",
        category: "Version Control",
        description: "Distributed version control system.",
        githubSearch: "git",
        officialRepository: "https://github.com/git/git"
    },

    github: {
        name: "GitHub",
        shortName: "GitHub",
        category: "Version Control",
        description: "Git-based software development and collaboration platform.",
        githubSearch: "github",
        officialRepository: null
    },

    bash: {
        name: "Bash",
        shortName: "Bash",
        category: "Scripting & Programming",
        description: "Unix shell commonly used for automation and DevOps scripting.",
        githubSearch: "bash",
        officialRepository: null
    },

    python: {
        name: "Python",
        shortName: "Python",
        category: "Scripting & Programming",
        description: "Programming language widely used for automation and tooling.",
        githubSearch: "python",
        officialRepository: "https://github.com/python/cpython"
    }

};