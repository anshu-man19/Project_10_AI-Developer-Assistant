export function buildPrompt(mode, userInput) {
  switch (mode) {
    case "explain":
      return `Explain this code in a simple way with examples:\n${userInput}`;

    case "debug":
      return `Find bugs in this code and correct it. Also explain the issue:\n${userInput}`;

    case "optimize":
      return `Optimize this code for best performance and readability:\n${userInput}`;

    case "complexity":
      return `Give time and space complexity of this code. Also explain briefly:\n${userInput}`;

    default:
      return userInput;
  }
}
