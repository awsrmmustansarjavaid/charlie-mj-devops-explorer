// ============================================================
// CHARLIE MJ DEVOPS EXPLORER
// devops-data.js
//
// TECHNOLOGY DATA
// ============================================================
//
// IMPORTANT
// ------------------------------------------------------------
// devops-categories.json is the source of truth for technology
// IDs.
//
// Every technology ID used inside:
//
//     devops-categories.json
//
// must have a matching key inside:
//
//     devopsTechnologies
//
// Example:
//
//     JSON:
//         "amazon-eks"
//
//     JavaScript:
//         "amazon-eks": {
//             ...
//         }
//
// DO NOT change technology IDs here unless the corresponding
// ID is also changed in devops-categories.json.
//
// ============================================================


// ============================================================
// DEVOPS CATEGORIES
// ============================================================
//
// NOTE:
// ------------------------------------------------------------
// These category objects are kept here for compatibility with
// parts of the application that may import devopsCategories.
//
// The main category structure is maintained in:
//
//     data/devops-categories.json
//
// The technology IDs below are synchronized with that file.
//
// ============================================================

export const devopsCategories = [

    // ========================================================
    // OPERATING SYSTEMS
    // ========================================================

    {
        id: "operating-systems",
        name: "Operating Systems",
        description:
            "Server operating systems and environments used to run infrastructure and workloads.",
        technologies: [
            "linux",
            "ubuntu",
            "redhat-enterprise-linux",
            "alpine-linux",
            "amazon-linux",
            "windows-server"
        ]
    },


    // ========================================================
    // VERSION CONTROL
    // ========================================================

    {
        id: "version-control",
        name: "Version Control",
        description:
            "Source control, collaboration and repository platforms.",
        technologies: [
            "git",
            "github",
            "gitlab",
            "bitbucket",
            "gitea"
        ]
    },


    // ========================================================
    // DEVELOPER TOOLS
    // ========================================================

    {
        id: "developer-tools",
        name: "Developer Tools",
        description:
            "DevOps technologies and practices.",
        technologies: [
            "github-cli"
        ]
    },


    // ========================================================
    // CONTAINERS
    // ========================================================

    {
        id: "containers",
        name: "Containers",
        description:
            "Container engines, image builders and multi-container tooling.",
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


    // ========================================================
    // CONTAINER ORCHESTRATION
    // ========================================================

    {
        id: "container-orchestration",
        name: "Container Orchestration",
        description:
            "Systems for scheduling and operating application workloads.",
        technologies: [
            "kubernetes",
            "nomad"
        ]
    },


    // ========================================================
    // CLOUD COMPUTING
    // ========================================================

    {
        id: "cloud-computing",
        name: "Cloud Computing",
        description:
            "Public cloud and edge platforms used for infrastructure and applications.",
        technologies: [
            "amazon-eks",
            "azure-aks",
            "google-gke",
            "aws",
            "microsoft-azure",
            "google-cloud",
            "oracle-cloud",
            "digitalocean",
            "ibm-cloud",
            "alibaba-cloud",
            "cloudflare"
        ]
    },


    // ========================================================
    // KUBERNETES ECOSYSTEM
    // ========================================================

    {
        id: "kubernetes-ecosystem",
        name: "Kubernetes Ecosystem",
        description:
            "Kubernetes packaging, management and workflow tools.",
        technologies: [
            "helm",
            "kustomize",
            "rancher",
            "openshift",
            "kubectl",
            "k9s",
            "kind",
            "minikube",
            "eksctl",
            "cilium",
            "calico",
            "keda",
            "velero",
            "external-dns",
            "cert-manager"
        ]
    },


    // ========================================================
    // INFRASTRUCTURE AS CODE
    // ========================================================

    {
        id: "infrastructure-as-code",
        name: "Infrastructure as Code",
        description:
            "Languages and tools for declarative infrastructure and configuration.",
        technologies: [
            "terraform",
            "opentofu",
            "aws-cloudformation",
            "aws-cdk",
            "pulumi",
            "crossplane",
            "packer",
            "vagrant",
            "hcl",
            "yaml",
            "json",
            "cue"
        ]
    },


    // ========================================================
    // CI/CD
    // ========================================================

    {
        id: "ci-cd",
        name: "CI/CD",
        description:
            "Continuous integration, delivery, testing and pipeline automation.",
        technologies: [
            "jenkins",
            "github-actions",
            "gitlab-ci",
            "circleci",
            "travis-ci",
            "azure-devops",
            "tekton",
            "argo-workflows",
            "jenkins-x"
        ]
    },


    // ========================================================
    // GITOPS
    // ========================================================

    {
        id: "gitops",
        name: "GitOps",
        description:
            "Git-driven continuous delivery and configuration automation.",
        technologies: [
            "argo-cd",
            "flux",
            "argocd-image-updater",
            "argocd"
        ]
    },


    // ========================================================
    // CONFIGURATION MANAGEMENT
    // ========================================================

    {
        id: "configuration-management",
        name: "Configuration Management",
        description:
            "Tools for repeatable server and application configuration.",
        technologies: [
            "ansible",
            "chef",
            "puppet",
            "saltstack"
        ]
    },


    // ========================================================
    // DEVSECOPS
    // ========================================================

    {
        id: "devsecops",
        name: "DevSecOps",
        description:
            "Security scanning, code analysis, policy and supply-chain security.",
        technologies: [
            "trivy",
            "sonarqube",
            "owasp-dependency-check",
            "snyk",
            "semgrep",
            "checkov",
            "gitleaks",
            "tekton-chains",
            "cosign",
            "syft",
            "grype",
            "falco"
        ]
    },


    // ========================================================
    // SECRETS MANAGEMENT
    // ========================================================

    {
        id: "secrets-management",
        name: "Secrets Management",
        description:
            "Secure storage, synchronization and delivery of credentials and secrets.",
        technologies: [
            "vault",
            "external-secrets"
        ]
    },


    // ========================================================
    // OBSERVABILITY
    // ========================================================

    {
        id: "observability",
        name: "Observability",
        description:
            "Metrics, logs, traces and telemetry systems.",
        technologies: [
            "prometheus",
            "grafana",
            "opentelemetry",
            "loki",
            "promtail",
            "jaeger",
            "elastic-stack",
            "fluent-bit"
        ]
    },


    // ========================================================
    // MONITORING
    // ========================================================

    {
        id: "monitoring",
        name: "Monitoring",
        description:
            "Infrastructure and application monitoring platforms.",
        technologies: [
            "datadog",
            "new-relic"
        ]
    },


    // ========================================================
    // NETWORKING
    // ========================================================

    {
        id: "networking",
        name: "Networking",
        description:
            "Proxies, DNS, ingress and load-balancing technologies.",
        technologies: [
            "nginx",
            "haproxy",
            "traefik",
            "envoy",
            "coredns"
        ]
    },


    // ========================================================
    // SERVICE MESH
    // ========================================================

    {
        id: "service-mesh",
        name: "Service Mesh",
        description:
            "Application networking, traffic management and service-to-service security.",
        technologies: [
            "istio",
            "linkerd",
            "consul"
        ]
    },


    // ========================================================
    // DATABASES
    // ========================================================

    {
        id: "databases",
        name: "Databases",
        description:
            "Relational, document, cache and managed database technologies.",
        technologies: [
            "redis",
            "postgresql",
            "mysql",
            "mongodb",
            "amazon-rds"
        ]
    },


    // ========================================================
    // ARTIFACT MANAGEMENT
    // ========================================================

    {
        id: "artifact-management",
        name: "Artifact Management",
        description:
            "Container registries and software artifact repositories.",
        technologies: [
            "amazon-ecr",
            "docker-hub",
            "harbor",
            "jfrog-artifactory",
            "nexus-repository"
        ]
    },


    // ========================================================
    // SCRIPTING & PROGRAMMING
    // ========================================================

    {
        id: "scripting-programming",
        name: "Scripting & Programming",
        description:
            "Languages used for automation, tooling, services and operations.",
        technologies: [
            "bash",
            "powershell",
            "python",
            "go",
            "ruby",
            "javascript",
            "typescript",
            "java",
            "csharp",
            "rust"
        ]
    },


    // ========================================================
    // AUTOMATION
    // ========================================================

    {
        id: "automation",
        name: "Automation",
        description:
            "CLI, build and data-processing tools used to automate repetitive work.",
        technologies: [
            "make",
            "jq",
            "yq",
            "curl",
            "wget",
            "aws-cli",
            "azure-cli",
            "gcloud-cli"
        ]
    },


    // ========================================================
    // PROJECT MANAGEMENT
    // ========================================================

    {
        id: "project-management",
        name: "Project Management",
        description:
            "Issue tracking, documentation and engineering collaboration.",
        technologies: [
            "jira",
            "confluence",
            "mkdocs"
        ]
    },


    // ========================================================
    // CLOUD NATIVE
    // ========================================================

    {
        id: "cloud-native",
        name: "Cloud Native",
        description:
            "Cloud-native application platforms and ecosystem technologies.",
        technologies: [
            "cncf",
            "openfaas",
            "knative",
            "rabbitmq",
            "apache-kafka",
            "nats",
            "minio",
            "opencost",
            "backstage"
        ]
    }

];


// ============================================================
// TECHNOLOGIES
// ============================================================
//
// IMPORTANT:
// ------------------------------------------------------------
// Every key below matches a technology ID from
// devops-categories.json.
//
// Example:
//
//     "amazon-eks"
//
// must NOT be changed to:
//
//     "eks"
//
// ============================================================

export const devopsTechnologies = {


    // ========================================================
    // OPERATING SYSTEMS
    // ========================================================

    linux: {
        name: "Linux",
        shortName: "Linux",
        category: "operating-systems",
        description:
            "Open-source operating system family widely used for servers, cloud infrastructure, containers and DevOps environments.",
        githubSearch: "linux",
        officialRepository:
            "https://github.com/torvalds/linux"
    },

    ubuntu: {
        name: "Ubuntu",
        shortName: "Ubuntu",
        category: "operating-systems",
        description:
            "Popular Linux distribution widely used for servers, development, cloud infrastructure and DevOps environments.",
        githubSearch: "ubuntu",
        officialRepository:
            "https://github.com/ubuntu"
    },

    "redhat-enterprise-linux": {
        name: "Red Hat Enterprise Linux",
        shortName: "RHEL",
        category: "operating-systems",
        description:
            "Enterprise Linux operating system commonly used for servers, infrastructure and production workloads.",
        githubSearch: "redhat-enterprise-linux",
        officialRepository: null
    },

    "alpine-linux": {
        name: "Alpine Linux",
        shortName: "Alpine",
        category: "operating-systems",
        description:
            "Lightweight Linux distribution commonly used as a minimal base image for containers.",
        githubSearch: "alpine-linux",
        officialRepository:
            "https://github.com/alpinelinux"
    },

    "amazon-linux": {
        name: "Amazon Linux",
        shortName: "Amazon Linux",
        category: "operating-systems",
        description:
            "Linux distribution developed by AWS for running applications and workloads on AWS infrastructure.",
        githubSearch: "amazon-linux",
        officialRepository: null
    },

    "windows-server": {
        name: "Windows Server",
        shortName: "Windows Server",
        category: "operating-systems",
        description:
            "Microsoft server operating system used for enterprise applications, infrastructure and Windows-based workloads.",
        githubSearch: "windows-server",
        officialRepository: null
    },


    // ========================================================
    // VERSION CONTROL
    // ========================================================

    git: {
        name: "Git",
        shortName: "Git",
        category: "version-control",
        description:
            "Distributed version control system used to track source code changes and collaborate on software projects.",
        githubSearch: "git",
        officialRepository:
            "https://github.com/git/git"
    },

    github: {
        name: "GitHub",
        shortName: "GitHub",
        category: "version-control",
        description:
            "Git-based software development and collaboration platform providing repositories, pull requests, issues and automation.",
        githubSearch: "github",
        officialRepository: null
    },

    gitlab: {
        name: "GitLab",
        shortName: "GitLab",
        category: "version-control",
        description:
            "DevOps platform providing Git repositories, collaboration, CI/CD and security features.",
        githubSearch: "gitlab",
        officialRepository: null
    },

    bitbucket: {
        name: "Bitbucket",
        shortName: "Bitbucket",
        category: "version-control",
        description:
            "Git repository hosting and collaboration platform from Atlassian.",
        githubSearch: "bitbucket",
        officialRepository: null
    },

    gitea: {
        name: "Gitea",
        shortName: "Gitea",
        category: "version-control",
        description:
            "Lightweight self-hosted Git service for source code hosting and collaboration.",
        githubSearch: "gitea",
        officialRepository:
            "https://github.com/go-gitea/gitea"
    },


    // ========================================================
    // DEVELOPER TOOLS
    // ========================================================

    "github-cli": {
        name: "GitHub CLI",
        shortName: "gh",
        category: "developer-tools",
        description:
            "Command-line interface for working with GitHub repositories, issues, pull requests and workflows.",
        githubSearch: "github-cli",
        officialRepository:
            "https://github.com/cli/cli"
    },


    // ========================================================
    // CONTAINERS
    // ========================================================

    docker: {
        name: "Docker",
        shortName: "Docker",
        category: "containers",
        description:
            "Platform for building, shipping and running containerized applications.",
        githubSearch: "docker",
        officialRepository:
            "https://github.com/docker"
    },

    podman: {
        name: "Podman",
        shortName: "Podman",
        category: "containers",
        description:
            "Daemonless container engine for developing, managing and running containers.",
        githubSearch: "podman",
        officialRepository:
            "https://github.com/containers/podman"
    },

    containerd: {
        name: "containerd",
        shortName: "containerd",
        category: "containers",
        description:
            "Industry-standard container runtime used by container platforms and Kubernetes.",
        githubSearch: "containerd",
        officialRepository:
            "https://github.com/containerd/containerd"
    },

    "cri-o": {
        name: "CRI-O",
        shortName: "CRI-O",
        category: "containers",
        description:
            "Lightweight container runtime designed specifically for Kubernetes.",
        githubSearch: "cri-o",
        officialRepository:
            "https://github.com/cri-o/cri-o"
    },

    "docker-compose": {
        name: "Docker Compose",
        shortName: "Compose",
        category: "containers",
        description:
            "Tool for defining and running multi-container applications using YAML configuration.",
        githubSearch: "docker-compose",
        officialRepository:
            "https://github.com/docker/compose"
    },

    buildkit: {
        name: "BuildKit",
        shortName: "BuildKit",
        category: "containers",
        description:
            "Modern build engine used for building container images efficiently.",
        githubSearch: "buildkit",
        officialRepository:
            "https://github.com/moby/buildkit"
    },

    buildah: {
        name: "Buildah",
        shortName: "Buildah",
        category: "containers",
        description:
            "Open-source tool for building and managing OCI container images.",
        githubSearch: "buildah",
        officialRepository:
            "https://github.com/containers/buildah"
    },


    // ========================================================
    // CONTAINER ORCHESTRATION
    // ========================================================

    kubernetes: {
        name: "Kubernetes",
        shortName: "K8s",
        category: "container-orchestration",
        description:
            "Open-source container orchestration platform for deploying, scaling and managing containerized applications.",
        githubSearch: "kubernetes",
        officialRepository:
            "https://github.com/kubernetes/kubernetes"
    },

    nomad: {
        name: "Nomad",
        shortName: "Nomad",
        category: "container-orchestration",
        description:
            "Workload orchestration platform designed for deploying and managing applications and services.",
        githubSearch: "nomad",
        officialRepository:
            "https://github.com/hashicorp/nomad"
    },


    // ========================================================
    // CLOUD COMPUTING
    // ========================================================

    "amazon-eks": {
        name: "Amazon EKS",
        shortName: "EKS",
        category: "cloud-computing",
        description:
            "Managed Kubernetes service from Amazon Web Services.",
        githubSearch: "amazon-eks",
        officialRepository: null
    },

    "azure-aks": {
        name: "Azure Kubernetes Service",
        shortName: "AKS",
        category: "cloud-computing",
        description:
            "Managed Kubernetes service from Microsoft Azure.",
        githubSearch: "azure-kubernetes-service",
        officialRepository: null
    },

    "google-gke": {
        name: "Google Kubernetes Engine",
        shortName: "GKE",
        category: "cloud-computing",
        description:
            "Managed Kubernetes service from Google Cloud.",
        githubSearch: "google-kubernetes-engine",
        officialRepository: null
    },

    aws: {
        name: "Amazon Web Services",
        shortName: "AWS",
        category: "cloud-computing",
        description:
            "Cloud computing platform providing compute, storage, networking, databases and many other services.",
        githubSearch: "aws",
        officialRepository: null
    },

    "microsoft-azure": {
        name: "Microsoft Azure",
        shortName: "Azure",
        category: "cloud-computing",
        description:
            "Microsoft cloud computing platform providing virtual machines, containers, databases, networking, AI and other services.",
        githubSearch: "azure",
        officialRepository: null
    },

    "google-cloud": {
        name: "Google Cloud",
        shortName: "GCP",
        category: "cloud-computing",
        description:
            "Google cloud computing platform providing compute, storage, databases, networking, analytics and AI services.",
        githubSearch: "google-cloud",
        officialRepository: null
    },

    "oracle-cloud": {
        name: "Oracle Cloud",
        shortName: "OCI",
        category: "cloud-computing",
        description:
            "Oracle cloud platform providing compute, storage, networking, databases and enterprise cloud services.",
        githubSearch: "oracle-cloud",
        officialRepository: null
    },

    digitalocean: {
        name: "DigitalOcean",
        shortName: "DigitalOcean",
        category: "cloud-computing",
        description:
            "Cloud platform focused on simple infrastructure services including virtual machines, managed databases, Kubernetes and storage.",
        githubSearch: "digitalocean",
        officialRepository: null
    },

    "ibm-cloud": {
        name: "IBM Cloud",
        shortName: "IBM Cloud",
        category: "cloud-computing",
        description:
            "IBM cloud platform providing infrastructure, containers, Kubernetes, databases and enterprise services.",
        githubSearch: "ibm-cloud",
        officialRepository: null
    },

    "alibaba-cloud": {
        name: "Alibaba Cloud",
        shortName: "Alibaba Cloud",
        category: "cloud-computing",
        description:
            "Cloud computing platform providing compute, storage, networking, databases and other cloud services.",
        githubSearch: "alibaba-cloud",
        officialRepository: null
    },

    cloudflare: {
        name: "Cloudflare",
        shortName: "Cloudflare",
        category: "cloud-computing",
        description:
            "Cloud platform providing networking, CDN, DNS, security, serverless computing and edge services.",
        githubSearch: "cloudflare",
        officialRepository: null
    },


    // ========================================================
    // KUBERNETES ECOSYSTEM
    // ========================================================

    helm: {
        name: "Helm",
        shortName: "Helm",
        category: "kubernetes-ecosystem",
        description:
            "Package manager for Kubernetes applications.",
        githubSearch: "helm",
        officialRepository:
            "https://github.com/helm/helm"
    },

    kustomize: {
        name: "Kustomize",
        shortName: "Kustomize",
        category: "kubernetes-ecosystem",
        description:
            "Kubernetes-native configuration management tool for customizing YAML manifests.",
        githubSearch: "kustomize",
        officialRepository:
            "https://github.com/kubernetes-sigs/kustomize"
    },

    rancher: {
        name: "Rancher",
        shortName: "Rancher",
        category: "kubernetes-ecosystem",
        description:
            "Platform for managing Kubernetes clusters and cloud-native workloads.",
        githubSearch: "rancher",
        officialRepository:
            "https://github.com/rancher/rancher"
    },

    openshift: {
        name: "OpenShift",
        shortName: "OpenShift",
        category: "kubernetes-ecosystem",
        description:
            "Kubernetes-based application platform from Red Hat.",
        githubSearch: "openshift",
        officialRepository:
            "https://github.com/openshift"
    },

    kubectl: {
        name: "kubectl",
        shortName: "kubectl",
        category: "kubernetes-ecosystem",
        description:
            "Command-line tool used to communicate with Kubernetes clusters.",
        githubSearch: "kubectl",
        officialRepository:
            "https://github.com/kubernetes/kubectl"
    },

    k9s: {
        name: "K9s",
        shortName: "K9s",
        category: "kubernetes-ecosystem",
        description:
            "Terminal-based user interface for interacting with Kubernetes clusters.",
        githubSearch: "k9s",
        officialRepository:
            "https://github.com/derailed/k9s"
    },

    kind: {
        name: "kind",
        shortName: "kind",
        category: "kubernetes-ecosystem",
        description:
            "Tool for running local Kubernetes clusters using container nodes.",
        githubSearch: "kind",
        officialRepository:
            "https://github.com/kubernetes-sigs/kind"
    },

    minikube: {
        name: "Minikube",
        shortName: "Minikube",
        category: "kubernetes-ecosystem",
        description:
            "Tool for running a local Kubernetes cluster for learning and development.",
        githubSearch: "minikube",
        officialRepository:
            "https://github.com/kubernetes/minikube"
    },

    eksctl: {
        name: "eksctl",
        shortName: "eksctl",
        category: "kubernetes-ecosystem",
        description:
            "Command-line utility for creating and managing Amazon EKS clusters.",
        githubSearch: "eksctl",
        officialRepository:
            "https://github.com/eksctl-io/eksctl"
    },

    cilium: {
        name: "Cilium",
        shortName: "Cilium",
        category: "kubernetes-ecosystem",
        description:
            "eBPF-based networking, security and observability platform for cloud-native environments.",
        githubSearch: "cilium",
        officialRepository:
            "https://github.com/cilium/cilium"
    },

    calico: {
        name: "Calico",
        shortName: "Calico",
        category: "kubernetes-ecosystem",
        description:
            "Cloud-native networking and network security solution commonly used with Kubernetes.",
        githubSearch: "calico",
        officialRepository:
            "https://github.com/projectcalico/calico"
    },

    keda: {
        name: "KEDA",
        shortName: "KEDA",
        category: "kubernetes-ecosystem",
        description:
            "Kubernetes event-driven autoscaling component.",
        githubSearch: "keda",
        officialRepository:
            "https://github.com/kedacore/keda"
    },

    velero: {
        name: "Velero",
        shortName: "Velero",
        category: "kubernetes-ecosystem",
        description:
            "Tool for backup, restore and disaster recovery of Kubernetes resources and persistent volumes.",
        githubSearch: "velero",
        officialRepository:
            "https://github.com/vmware-tanzu/velero"
    },

    "external-dns": {
        name: "ExternalDNS",
        shortName: "ExternalDNS",
        category: "kubernetes-ecosystem",
        description:
            "Kubernetes controller that manages DNS records based on Kubernetes resources.",
        githubSearch: "external-dns",
        officialRepository:
            "https://github.com/kubernetes-sigs/external-dns"
    },

    "cert-manager": {
        name: "cert-manager",
        shortName: "cert-manager",
        category: "kubernetes-ecosystem",
        description:
            "Kubernetes add-on for automating certificate issuance and renewal.",
        githubSearch: "cert-manager",
        officialRepository:
            "https://github.com/cert-manager/cert-manager"
    },


    // ========================================================
    // INFRASTRUCTURE AS CODE
    // ========================================================

    terraform: {
        name: "Terraform",
        shortName: "Terraform",
        category: "infrastructure-as-code",
        description:
            "Infrastructure as Code tool for provisioning and managing infrastructure.",
        githubSearch: "terraform",
        officialRepository:
            "https://github.com/hashicorp/terraform"
    },

    opentofu: {
        name: "OpenTofu",
        shortName: "OpenTofu",
        category: "infrastructure-as-code",
        description:
            "Open-source Infrastructure as Code tool compatible with the Terraform ecosystem.",
        githubSearch: "opentofu",
        officialRepository:
            "https://github.com/opentofu/opentofu"
    },

    "aws-cloudformation": {
        name: "AWS CloudFormation",
        shortName: "CloudFormation",
        category: "infrastructure-as-code",
        description:
            "AWS Infrastructure as Code service for defining and provisioning AWS resources.",
        githubSearch: "aws-cloudformation",
        officialRepository: null
    },

    "aws-cdk": {
        name: "AWS CDK",
        shortName: "CDK",
        category: "infrastructure-as-code",
        description:
            "AWS Infrastructure as Code framework for defining cloud infrastructure using programming languages.",
        githubSearch: "aws-cdk",
        officialRepository:
            "https://github.com/aws/aws-cdk"
    },

    pulumi: {
        name: "Pulumi",
        shortName: "Pulumi",
        category: "infrastructure-as-code",
        description:
            "Infrastructure as Code platform that allows infrastructure to be defined using general-purpose programming languages.",
        githubSearch: "pulumi",
        officialRepository:
            "https://github.com/pulumi/pulumi"
    },

    crossplane: {
        name: "Crossplane",
        shortName: "Crossplane",
        category: "infrastructure-as-code",
        description:
            "Kubernetes-based control plane framework for managing cloud infrastructure and services.",
        githubSearch: "crossplane",
        officialRepository:
            "https://github.com/crossplane/crossplane"
    },

    packer: {
        name: "Packer",
        shortName: "Packer",
        category: "infrastructure-as-code",
        description:
            "HashiCorp tool for creating consistent machine images across different platforms.",
        githubSearch: "packer",
        officialRepository:
            "https://github.com/hashicorp/packer"
    },

    vagrant: {
        name: "Vagrant",
        shortName: "Vagrant",
        category: "infrastructure-as-code",
        description:
            "Tool for creating and managing reproducible development environments.",
        githubSearch: "vagrant",
        officialRepository:
            "https://github.com/hashicorp/vagrant"
    },

    hcl: {
        name: "HCL",
        shortName: "HCL",
        category: "infrastructure-as-code",
        description:
            "Human-readable configuration language commonly used by HashiCorp tools.",
        githubSearch: "hcl",
        officialRepository:
            "https://github.com/hashicorp/hcl"
    },

    yaml: {
        name: "YAML",
        shortName: "YAML",
        category: "infrastructure-as-code",
        description:
            "Human-readable data serialization format widely used for configuration and infrastructure definitions.",
        githubSearch: "yaml",
        officialRepository: null
    },

    json: {
        name: "JSON",
        shortName: "JSON",
        category: "infrastructure-as-code",
        description:
            "Lightweight data interchange format commonly used for configuration, APIs and infrastructure tooling.",
        githubSearch: "json",
        officialRepository: null
    },

    cue: {
        name: "CUE",
        shortName: "CUE",
        category: "infrastructure-as-code",
        description:
            "Configuration language designed for validating and defining structured data and configuration.",
        githubSearch: "cue",
        officialRepository:
            "https://github.com/cue-lang/cue"
    },


    // ========================================================
    // CI/CD
    // ========================================================

    jenkins: {
        name: "Jenkins",
        shortName: "Jenkins",
        category: "ci-cd",
        description:
            "Automation server commonly used to build CI/CD pipelines.",
        githubSearch: "jenkins",
        officialRepository:
            "https://github.com/jenkinsci/jenkins"
    },

    "github-actions": {
        name: "GitHub Actions",
        shortName: "GitHub Actions",
        category: "ci-cd",
        description:
            "GitHub automation platform for building CI/CD workflows directly inside repositories.",
        githubSearch: "github-actions",
        officialRepository: null
    },

    "gitlab-ci": {
        name: "GitLab CI/CD",
        shortName: "GitLab CI",
        category: "ci-cd",
        description:
            "CI/CD automation system integrated into the GitLab platform.",
        githubSearch: "gitlab-ci",
        officialRepository: null
    },

    circleci: {
        name: "CircleCI",
        shortName: "CircleCI",
        category: "ci-cd",
        description:
            "Continuous integration and delivery platform for automating builds, tests and deployments.",
        githubSearch: "circleci",
        officialRepository: null
    },

    "travis-ci": {
        name: "Travis CI",
        shortName: "Travis CI",
        category: "ci-cd",
        description:
            "Hosted continuous integration platform used to automate software builds and tests.",
        githubSearch: "travis-ci",
        officialRepository: null
    },

    "azure-devops": {
        name: "Azure DevOps",
        shortName: "Azure DevOps",
        category: "ci-cd",
        description:
            "Microsoft development and DevOps platform providing repositories, pipelines, testing and project management.",
        githubSearch: "azure-devops",
        officialRepository: null
    },

    tekton: {
        name: "Tekton",
        shortName: "Tekton",
        category: "ci-cd",
        description:
            "Kubernetes-native framework for creating CI/CD pipelines and automation workflows.",
        githubSearch: "tekton",
        officialRepository:
            "https://github.com/tektoncd/pipeline"
    },

    "argo-workflows": {
        name: "Argo Workflows",
        shortName: "Argo Workflows",
        category: "ci-cd",
        description:
            "Kubernetes-native workflow engine for orchestrating parallel jobs and complex automation workflows.",
        githubSearch: "argo-workflows",
        officialRepository:
            "https://github.com/argoproj/argo-workflows"
    },

    "jenkins-x": {
        name: "Jenkins X",
        shortName: "Jenkins X",
        category: "ci-cd",
        description:
            "Cloud-native CI/CD automation project designed around Kubernetes and GitOps practices.",
        githubSearch: "jenkins-x",
        officialRepository:
            "https://github.com/jenkins-x/jx"
    },


    // ========================================================
    // GITOPS
    // ========================================================

    "argo-cd": {
        name: "Argo CD",
        shortName: "Argo CD",
        category: "gitops",
        description:
            "GitOps continuous delivery tool designed for Kubernetes applications.",
        githubSearch: "argo-cd",
        officialRepository:
            "https://github.com/argoproj/argo-cd"
    },

    flux: {
        name: "Flux",
        shortName: "Flux",
        category: "gitops",
        description:
            "GitOps toolkit for keeping Kubernetes clusters synchronized with configuration stored in Git.",
        githubSearch: "flux",
        officialRepository:
            "https://github.com/fluxcd/flux2"
    },

    "argocd-image-updater": {
        name: "Argo CD Image Updater",
        shortName: "Image Updater",
        category: "gitops",
        description:
            "Tool that automatically updates container image versions managed by Argo CD applications.",
        githubSearch: "argocd-image-updater",
        officialRepository:
            "https://github.com/argoproj-labs/argocd-image-updater"
    },

    argocd: {
        name: "Argo CD",
        shortName: "Argo CD",
        category: "gitops",
        description:
            "GitOps continuous delivery platform for deploying applications to Kubernetes.",
        githubSearch: "argocd",
        officialRepository:
            "https://github.com/argoproj/argo-cd"
    },


    // ========================================================
    // CONFIGURATION MANAGEMENT
    // ========================================================

    ansible: {
        name: "Ansible",
        shortName: "Ansible",
        category: "configuration-management",
        description:
            "Automation and configuration management platform.",
        githubSearch: "ansible",
        officialRepository:
            "https://github.com/ansible/ansible"
    },

    chef: {
        name: "Chef",
        shortName: "Chef",
        category: "configuration-management",
        description:
            "Infrastructure automation and configuration management platform.",
        githubSearch: "chef",
        officialRepository:
            "https://github.com/chef/chef"
    },

    puppet: {
        name: "Puppet",
        shortName: "Puppet",
        category: "configuration-management",
        description:
            "Configuration management and infrastructure automation platform.",
        githubSearch: "puppet",
        officialRepository:
            "https://github.com/puppetlabs/puppet"
    },

    saltstack: {
        name: "SaltStack",
        shortName: "Salt",
        category: "configuration-management",
        description:
            "Automation and configuration management system.",
        githubSearch: "saltstack",
        officialRepository:
            "https://github.com/saltstack/salt"
    },


    // ========================================================
    // DEVSECOPS
    // ========================================================

    trivy: {
        name: "Trivy",
        shortName: "Trivy",
        category: "devsecops",
        description:
            "Security scanner for containers, filesystems, repositories and other artifacts.",
        githubSearch: "trivy",
        officialRepository:
            "https://github.com/aquasecurity/trivy"
    },

    sonarqube: {
        name: "SonarQube",
        shortName: "SonarQube",
        category: "devsecops",
        description:
            "Code quality and security analysis platform.",
        githubSearch: "sonarqube",
        officialRepository:
            "https://github.com/SonarSource/sonarqube"
    },

    "owasp-dependency-check": {
        name: "OWASP Dependency-Check",
        shortName: "Dependency-Check",
        category: "devsecops",
        description:
            "Software composition analysis tool that identifies publicly disclosed vulnerabilities in project dependencies.",
        githubSearch: "owasp-dependency-check",
        officialRepository:
            "https://github.com/dependency-check/DependencyCheck"
    },

    snyk: {
        name: "Snyk",
        shortName: "Snyk",
        category: "devsecops",
        description:
            "Security platform for identifying vulnerabilities in code, dependencies, containers and infrastructure.",
        githubSearch: "snyk",
        officialRepository: null
    },

    semgrep: {
        name: "Semgrep",
        shortName: "Semgrep",
        category: "devsecops",
        description:
            "Lightweight static analysis tool for finding security issues and coding patterns in source code.",
        githubSearch: "semgrep",
        officialRepository:
            "https://github.com/semgrep/semgrep"
    },

    checkov: {
        name: "Checkov",
        shortName: "Checkov",
        category: "devsecops",
        description:
            "Infrastructure as Code security scanner for identifying configuration and compliance issues.",
        githubSearch: "checkov",
        officialRepository:
            "https://github.com/bridgecrewio/checkov"
    },

    gitleaks: {
        name: "Gitleaks",
        shortName: "Gitleaks",
        category: "devsecops",
        description:
            "Tool for detecting hardcoded secrets and sensitive information in Git repositories.",
        githubSearch: "gitleaks",
        officialRepository:
            "https://github.com/gitleaks/gitleaks"
    },

    "tekton-chains": {
        name: "Tekton Chains",
        shortName: "Chains",
        category: "devsecops",
        description:
            "Supply-chain security component for Tekton pipelines that helps generate and sign provenance and attestations.",
        githubSearch: "tekton-chains",
        officialRepository:
            "https://github.com/tektoncd/chains"
    },

    cosign: {
        name: "Cosign",
        shortName: "Cosign",
        category: "devsecops",
        description:
            "Tool for signing and verifying software artifacts and container images.",
        githubSearch: "cosign",
        officialRepository:
            "https://github.com/sigstore/cosign"
    },

    syft: {
        name: "Syft",
        shortName: "Syft",
        category: "devsecops",
        description:
            "Tool for generating Software Bills of Materials from container images and filesystems.",
        githubSearch: "syft",
        officialRepository:
            "https://github.com/anchore/syft"
    },

    grype: {
        name: "Grype",
        shortName: "Grype",
        category: "devsecops",
        description:
            "Vulnerability scanner for container images and filesystems.",
        githubSearch: "grype",
        officialRepository:
            "https://github.com/anchore/grype"
    },

    falco: {
        name: "Falco",
        shortName: "Falco",
        category: "devsecops",
        description:
            "Cloud-native runtime security tool for detecting suspicious activity in workloads and hosts.",
        githubSearch: "falco",
        officialRepository:
            "https://github.com/falcosecurity/falco"
    },


    // ========================================================
    // SECRETS MANAGEMENT
    // ========================================================

    vault: {
        name: "HashiCorp Vault",
        shortName: "Vault",
        category: "secrets-management",
        description:
            "Secrets management platform for securely storing and accessing credentials, tokens, certificates and other sensitive data.",
        githubSearch: "hashicorp-vault",
        officialRepository:
            "https://github.com/hashicorp/vault"
    },

    "external-secrets": {
        name: "External Secrets Operator",
        shortName: "External Secrets",
        category: "secrets-management",
        description:
            "Kubernetes operator for synchronizing secrets from external secret management systems into Kubernetes.",
        githubSearch: "external-secrets",
        officialRepository:
            "https://github.com/external-secrets/external-secrets"
    },


    // ========================================================
    // OBSERVABILITY
    // ========================================================

    prometheus: {
        name: "Prometheus",
        shortName: "Prometheus",
        category: "observability",
        description:
            "Monitoring and alerting toolkit for collecting, storing and querying metrics.",
        githubSearch: "prometheus",
        officialRepository:
            "https://github.com/prometheus/prometheus"
    },

    grafana: {
        name: "Grafana",
        shortName: "Grafana",
        category: "observability",
        description:
            "Visualization and observability platform for metrics, logs and other data sources.",
        githubSearch: "grafana",
        officialRepository:
            "https://github.com/grafana/grafana"
    },

    opentelemetry: {
        name: "OpenTelemetry",
        shortName: "OTel",
        category: "observability",
        description:
            "Open-source observability framework for collecting traces, metrics and logs.",
        githubSearch: "opentelemetry",
        officialRepository:
            "https://github.com/open-telemetry/opentelemetry-collector"
    },

    loki: {
        name: "Loki",
        shortName: "Loki",
        category: "observability",
        description:
            "Log aggregation system designed to work closely with Grafana.",
        githubSearch: "loki",
        officialRepository:
            "https://github.com/grafana/loki"
    },

    promtail: {
        name: "Promtail",
        shortName: "Promtail",
        category: "observability",
        description:
            "Log collection agent historically used to ship logs to Grafana Loki.",
        githubSearch: "promtail",
        officialRepository:
            "https://github.com/grafana/loki"
    },

    jaeger: {
        name: "Jaeger",
        shortName: "Jaeger",
        category: "observability",
        description:
            "Distributed tracing platform for monitoring and troubleshooting applications.",
        githubSearch: "jaeger",
        officialRepository:
            "https://github.com/jaegertracing/jaeger"
    },

    "elastic-stack": {
        name: "Elastic Stack",
        shortName: "Elastic",
        category: "observability",
        description:
            "Search and observability stack commonly used for logs, metrics, security and application monitoring.",
        githubSearch: "elastic-stack",
        officialRepository:
            "https://github.com/elastic"
    },

    "fluent-bit": {
        name: "Fluent Bit",
        shortName: "Fluent Bit",
        category: "observability",
        description:
            "Lightweight and high-performance telemetry agent for collecting and forwarding logs and other observability data.",
        githubSearch: "fluent-bit",
        officialRepository:
            "https://github.com/fluent/fluent-bit"
    },


    // ========================================================
    // MONITORING
    // ========================================================

    datadog: {
        name: "Datadog",
        shortName: "Datadog",
        category: "monitoring",
        description:
            "Cloud monitoring and observability platform for infrastructure, applications, logs and security.",
        githubSearch: "datadog",
        officialRepository: null
    },

    "new-relic": {
        name: "New Relic",
        shortName: "New Relic",
        category: "monitoring",
        description:
            "Observability platform for monitoring applications, infrastructure, logs and performance.",
        githubSearch: "new-relic",
        officialRepository: null
    },


    // ========================================================
    // NETWORKING
    // ========================================================

    nginx: {
        name: "NGINX",
        shortName: "NGINX",
        category: "networking",
        description:
            "Web server, reverse proxy and load-balancing platform commonly used in modern infrastructure.",
        githubSearch: "nginx",
        officialRepository:
            "https://github.com/nginx/nginx"
    },

    haproxy: {
        name: "HAProxy",
        shortName: "HAProxy",
        category: "networking",
        description:
            "High-performance TCP and HTTP load balancer and reverse proxy.",
        githubSearch: "haproxy",
        officialRepository:
            "https://github.com/haproxy/haproxy"
    },

    traefik: {
        name: "Traefik",
        shortName: "Traefik",
        category: "networking",
        description:
            "Cloud-native reverse proxy and ingress controller designed for dynamic environments.",
        githubSearch: "traefik",
        officialRepository:
            "https://github.com/traefik/traefik"
    },

    envoy: {
        name: "Envoy",
        shortName: "Envoy",
        category: "networking",
        description:
            "High-performance cloud-native proxy designed for service-to-service and edge networking.",
        githubSearch: "envoy",
        officialRepository:
            "https://github.com/envoyproxy/envoy"
    },

    coredns: {
        name: "CoreDNS",
        shortName: "CoreDNS",
        category: "networking",
        description:
            "DNS server commonly used as the service discovery DNS server in Kubernetes.",
        githubSearch: "coredns",
        officialRepository:
            "https://github.com/coredns/coredns"
    },


    // ========================================================
    // SERVICE MESH
    // ========================================================

    istio: {
        name: "Istio",
        shortName: "Istio",
        category: "service-mesh",
        description:
            "Service mesh platform providing traffic management, security and observability for microservices.",
        githubSearch: "istio",
        officialRepository:
            "https://github.com/istio/istio"
    },

    linkerd: {
        name: "Linkerd",
        shortName: "Linkerd",
        category: "service-mesh",
        description:
            "Lightweight service mesh providing security, reliability and observability for Kubernetes workloads.",
        githubSearch: "linkerd",
        officialRepository:
            "https://github.com/linkerd/linkerd2"
    },

    consul: {
        name: "HashiCorp Consul",
        shortName: "Consul",
        category: "service-mesh",
        description:
            "Service networking platform providing service discovery, configuration and service mesh capabilities.",
        githubSearch: "hashicorp-consul",
        officialRepository:
            "https://github.com/hashicorp/consul"
    },


    // ========================================================
    // DATABASES
    // ========================================================

    redis: {
        name: "Redis",
        shortName: "Redis",
        category: "databases",
        description:
            "In-memory data store commonly used for caching, sessions, queues and application data.",
        githubSearch: "redis",
        officialRepository:
            "https://github.com/redis/redis"
    },

    postgresql: {
        name: "PostgreSQL",
        shortName: "PostgreSQL",
        category: "databases",
        description:
            "Open-source relational database system designed for reliability, extensibility and SQL workloads.",
        githubSearch: "postgresql",
        officialRepository:
            "https://github.com/postgres/postgres"
    },

    mysql: {
        name: "MySQL",
        shortName: "MySQL",
        category: "databases",
        description:
            "Popular open-source relational database management system.",
        githubSearch: "mysql",
        officialRepository:
            "https://github.com/mysql/mysql-server"
    },

    mongodb: {
        name: "MongoDB",
        shortName: "MongoDB",
        category: "databases",
        description:
            "Document-oriented database commonly used for modern application workloads.",
        githubSearch: "mongodb",
        officialRepository:
            "https://github.com/mongodb/mongo"
    },

    "amazon-rds": {
        name: "Amazon RDS",
        shortName: "RDS",
        category: "databases",
        description:
            "Managed relational database service from AWS supporting several popular database engines.",
        githubSearch: "amazon-rds",
        officialRepository: null
    },


    // ========================================================
    // ARTIFACT MANAGEMENT
    // ========================================================

    "amazon-ecr": {
        name: "Amazon Elastic Container Registry",
        shortName: "ECR",
        category: "artifact-management",
        description:
            "Managed AWS container registry for storing, managing and deploying container images.",
        githubSearch: "amazon-ecr",
        officialRepository: null
    },

    "docker-hub": {
        name: "Docker Hub",
        shortName: "Docker Hub",
        category: "artifact-management",
        description:
            "Cloud-based registry for storing and distributing container images.",
        githubSearch: "docker-hub",
        officialRepository: null
    },

    harbor: {
        name: "Harbor",
        shortName: "Harbor",
        category: "artifact-management",
        description:
            "Open-source cloud-native registry for storing and securing container images and artifacts.",
        githubSearch: "harbor",
        officialRepository:
            "https://github.com/goharbor/harbor"
    },

    "jfrog-artifactory": {
        name: "JFrog Artifactory",
        shortName: "Artifactory",
        category: "artifact-management",
        description:
            "Universal artifact repository used to store and manage software packages and build artifacts.",
        githubSearch: "jfrog-artifactory",
        officialRepository: null
    },

    "nexus-repository": {
        name: "Nexus Repository",
        shortName: "Nexus",
        category: "artifact-management",
        description:
            "Repository manager for storing and distributing software packages and container images.",
        githubSearch: "nexus-repository",
        officialRepository: null
    },


    // ========================================================
    // SCRIPTING & PROGRAMMING
    // ========================================================

    bash: {
        name: "Bash",
        shortName: "Bash",
        category: "scripting-programming",
        description:
            "Unix shell commonly used for automation, administration and DevOps scripting.",
        githubSearch: "bash",
        officialRepository: null
    },

    powershell: {
        name: "PowerShell",
        shortName: "PowerShell",
        category: "scripting-programming",
        description:
            "Cross-platform command shell and scripting language commonly used for Windows and cloud automation.",
        githubSearch: "powershell",
        officialRepository:
            "https://github.com/PowerShell/PowerShell"
    },

    python: {
        name: "Python",
        shortName: "Python",
        category: "scripting-programming",
        description:
            "Programming language widely used for automation, cloud tooling and DevOps applications.",
        githubSearch: "python",
        officialRepository:
            "https://github.com/python/cpython"
    },

    go: {
        name: "Go",
        shortName: "Go",
        category: "scripting-programming",
        description:
            "Programming language widely used for cloud infrastructure, Kubernetes tooling and DevOps software.",
        githubSearch: "golang",
        officialRepository:
            "https://github.com/golang/go"
    },

    ruby: {
        name: "Ruby",
        shortName: "Ruby",
        category: "scripting-programming",
        description:
            "Programming language used for automation, web applications and infrastructure tooling.",
        githubSearch: "ruby",
        officialRepository:
            "https://github.com/ruby/ruby"
    },

    javascript: {
        name: "JavaScript",
        shortName: "JavaScript",
        category: "scripting-programming",
        description:
            "Programming language commonly used for web applications, automation and developer tooling.",
        githubSearch: "javascript",
        officialRepository: null
    },

    typescript: {
        name: "TypeScript",
        shortName: "TypeScript",
        category: "scripting-programming",
        description:
            "Typed superset of JavaScript commonly used for web applications and developer tooling.",
        githubSearch: "typescript",
        officialRepository:
            "https://github.com/microsoft/TypeScript"
    },

    java: {
        name: "Java",
        shortName: "Java",
        category: "scripting-programming",
        description:
            "General-purpose programming language widely used for enterprise applications and backend systems.",
        githubSearch: "java",
        officialRepository:
            "https://github.com/openjdk/jdk"
    },

    csharp: {
        name: "C#",
        shortName: "C#",
        category: "scripting-programming",
        description:
            "Programming language commonly used for enterprise applications, cloud services and .NET development.",
        githubSearch: "csharp",
        officialRepository:
            "https://github.com/dotnet/csharplang"
    },

    rust: {
        name: "Rust",
        shortName: "Rust",
        category: "scripting-programming",
        description:
            "Systems programming language focused on performance, reliability and memory safety.",
        githubSearch: "rust",
        officialRepository:
            "https://github.com/rust-lang/rust"
    },


    // ========================================================
    // AUTOMATION
    // ========================================================

    make: {
        name: "Make",
        shortName: "Make",
        category: "automation",
        description:
            "Build automation tool commonly used to automate compilation, testing and repetitive command-line tasks.",
        githubSearch: "make",
        officialRepository: null
    },

    jq: {
        name: "jq",
        shortName: "jq",
        category: "automation",
        description:
            "Command-line JSON processor useful for automation and shell scripting.",
        githubSearch: "jq",
        officialRepository:
            "https://github.com/jqlang/jq"
    },

    yq: {
        name: "yq",
        shortName: "yq",
        category: "automation",
        description:
            "Command-line processor for YAML, JSON and related structured data formats.",
        githubSearch: "yq",
        officialRepository:
            "https://github.com/mikefarah/yq"
    },

    curl: {
        name: "cURL",
        shortName: "curl",
        category: "automation",
        description:
            "Command-line tool and library for transferring data using network protocols.",
        githubSearch: "curl",
        officialRepository:
            "https://github.com/curl/curl"
    },

    wget: {
        name: "Wget",
        shortName: "Wget",
        category: "automation",
        description:
            "Command-line utility for downloading files and resources over network protocols.",
        githubSearch: "wget",
        officialRepository:
            "https://github.com/mirror/wget"
    },

    "aws-cli": {
        name: "AWS CLI",
        shortName: "AWS CLI",
        category: "automation",
        description:
            "Command-line interface for managing AWS services and automating cloud operations.",
        githubSearch: "aws-cli",
        officialRepository:
            "https://github.com/aws/aws-cli"
    },

    "azure-cli": {
        name: "Azure CLI",
        shortName: "Azure CLI",
        category: "automation",
        description:
            "Command-line interface for managing Azure resources and services.",
        githubSearch: "azure-cli",
        officialRepository:
            "https://github.com/Azure/azure-cli"
    },

    "gcloud-cli": {
        name: "Google Cloud CLI",
        shortName: "gcloud",
        category: "automation",
        description:
            "Command-line interface for managing Google Cloud resources and services.",
        githubSearch: "google-cloud-cli",
        officialRepository: null
    },


    // ========================================================
    // PROJECT MANAGEMENT
    // ========================================================

    jira: {
        name: "Jira",
        shortName: "Jira",
        category: "project-management",
        description:
            "Issue tracking and project management platform commonly used by software development teams.",
        githubSearch: "jira",
        officialRepository: null
    },

    confluence: {
        name: "Confluence",
        shortName: "Confluence",
        category: "project-management",
        description:
            "Collaboration and documentation platform commonly used by engineering and software teams.",
        githubSearch: "confluence",
        officialRepository: null
    },

    mkdocs: {
        name: "MkDocs",
        shortName: "MkDocs",
        category: "project-management",
        description:
            "Static site generator designed for creating project documentation from Markdown files.",
        githubSearch: "mkdocs",
        officialRepository:
            "https://github.com/mkdocs/mkdocs"
    },


    // ========================================================
    // CLOUD NATIVE
    // ========================================================

    cncf: {
        name: "Cloud Native Computing Foundation",
        shortName: "CNCF",
        category: "cloud-native",
        description:
            "Foundation that hosts and supports many open-source cloud-native projects and technologies.",
        githubSearch: "cncf",
        officialRepository:
            "https://github.com/cncf"
    },

    openfaas: {
        name: "OpenFaaS",
        shortName: "OpenFaaS",
        category: "cloud-native",
        description:
            "Open-source serverless platform for running functions and microservices.",
        githubSearch: "openfaas",
        officialRepository:
            "https://github.com/openfaas/faas"
    },

    knative: {
        name: "Knative",
        shortName: "Knative",
        category: "cloud-native",
        description:
            "Kubernetes-based platform components for building and running serverless and event-driven workloads.",
        githubSearch: "knative",
        officialRepository:
            "https://github.com/knative/serving"
    },

    rabbitmq: {
        name: "RabbitMQ",
        shortName: "RabbitMQ",
        category: "cloud-native",
        description:
            "Open-source message broker commonly used for asynchronous communication between services.",
        githubSearch: "rabbitmq",
        officialRepository:
            "https://github.com/rabbitmq/rabbitmq-server"
    },

    "apache-kafka": {
        name: "Apache Kafka",
        shortName: "Kafka",
        category: "cloud-native",
        description:
            "Distributed event streaming platform used for high-throughput data pipelines and event-driven applications.",
        githubSearch: "apache-kafka",
        officialRepository:
            "https://github.com/apache/kafka"
    },

    nats: {
        name: "NATS",
        shortName: "NATS",
        category: "cloud-native",
        description:
            "Lightweight messaging and eventing system designed for distributed applications and cloud-native systems.",
        githubSearch: "nats",
        officialRepository:
            "https://github.com/nats-io/nats-server"
    },

    minio: {
        name: "MinIO",
        shortName: "MinIO",
        category: "cloud-native",
        description:
            "High-performance object storage system compatible with the S3 API.",
        githubSearch: "minio",
        officialRepository:
            "https://github.com/minio/minio"
    },

    opencost: {
        name: "OpenCost",
        shortName: "OpenCost",
        category: "cloud-native",
        description:
            "Open-source cloud cost monitoring and allocation tool designed for Kubernetes environments.",
        githubSearch: "opencost",
        officialRepository:
            "https://github.com/opencost/opencost"
    },

    backstage: {
        name: "Backstage",
        shortName: "Backstage",
        category: "cloud-native",
        description:
            "Open-source developer portal platform for organizing software, services, documentation and engineering tooling.",
        githubSearch: "backstage",
        officialRepository:
            "https://github.com/backstage/backstage"
    }

};


// ============================================================
// END OF DEVOPS DATA
// ============================================================
//
// ID relationship:
//
// devops-categories.json
//        ↓
// category.technologies[]
//        ↓
// devopsTechnologies[technologyId]
//
// Example:
//
// "docker"
//      ↓
// devopsTechnologies["docker"]
//
// "amazon-eks"
//      ↓
// devopsTechnologies["amazon-eks"]
//
// "aws-cloudformation"
//      ↓
// devopsTechnologies["aws-cloudformation"]
//
// "elastic-stack"
//      ↓
// devopsTechnologies["elastic-stack"]
//
// ============================================================