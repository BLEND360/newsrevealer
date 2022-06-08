const deployments: { [key: string]: { label: string; url: string } } = {
  dev: {
    label: "Development",
    url: "dev.newsrevealer.blend360dev.io",
  },
  alpha: {
    label: "Alpha",
    url: "alpha.newsrevealer.blend360dev.io",
  },
  beta: {
    label: "Beta",
    url: "beta.newsrevealer.blend360dev.io",
  },
  stable: {
    label: "Stable",
    url: "newsrevealer.blend360dev.io",
  },
};

export default deployments;
