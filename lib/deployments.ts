const deployments: { [key: string]: { label: string; url: string } } = {
  dev: {
    label: "Development",
    url: "newsrevealer.blend360dev.io",
  },
  alpha: {
    label: "Alpha",
    url: "alpha.newsrevealer.blend360.io",
  },
  beta: {
    label: "Beta",
    url: "beta.newsrevealer.blend360.io",
  },
  stable: {
    label: "Stable",
    url: "newsrevealer.blend360.io",
  },
};

export default deployments;
