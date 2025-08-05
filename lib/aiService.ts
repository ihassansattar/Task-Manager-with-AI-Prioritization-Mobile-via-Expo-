import { Groq } from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY,
});

interface TaskPriorityResult {
  priority: "low" | "medium" | "high";
  score: number; // 0-100
  reasoning: string;
  suggestions?: string[];
}

interface AITaskAnalysis {
  success: boolean;
  result?: TaskPriorityResult;
  error?: string;
}

class AIService {
  private model = "meta-llama/llama-4-scout-17b-16e-instruct";

  /**
   * Analyze a task and determine its priority using AI
   */
  async analyzeTaskPriority(
    title: string,
    description?: string,
    context?: {
      existingTasks?: Array<{
        title: string;
        priority: string;
        completed: boolean;
      }>;
      userPreferences?: any;
    }
  ): Promise<AITaskAnalysis> {
    try {
      console.log("Analyzing task priority with AI:", { title, description });

      const prompt = this.buildPriorityPrompt(title, description, context);

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an AI assistant specialized in task prioritization for a productivity app. 
            Your job is to analyze tasks and assign appropriate priorities based on urgency, importance, and context.
            Always respond with valid JSON only, no additional text.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: this.model,
        temperature: 0.3, // Lower temperature for more consistent results
        max_completion_tokens: 500,
        top_p: 0.9,
      });

      const response = chatCompletion.choices[0]?.message?.content;

      if (!response) {
        throw new Error("No response from AI service");
      }

      console.log("AI Response:", response);

      // Parse the JSON response
      const result = JSON.parse(response) as TaskPriorityResult;

      // Validate the response
      if (!this.isValidPriorityResult(result)) {
        throw new Error("Invalid AI response format");
      }

      console.log("AI Priority Analysis:", result);

      return {
        success: true,
        result,
      };
    } catch (error: any) {
      console.error("AI service error:", error);

      // Fallback to rule-based prioritization
      const fallbackResult = this.getFallbackPriority(title, description);

      return {
        success: false,
        error: error.message || "AI analysis failed",
        result: fallbackResult,
      };
    }
  }

  /**
   * Build the prompt for task prioritization
   */
  private buildPriorityPrompt(
    title: string,
    description?: string,
    context?: any
  ): string {
    let prompt = `
Analyze this task and determine its priority level:

**Task Title:** "${title}"
${description ? `**Description:** "${description}"` : ""}

Consider these factors:
1. **Urgency**: How time-sensitive is this task?
2. **Importance**: How critical is this task to overall goals?
3. **Effort**: How much work is likely required?
4. **Dependencies**: Does this task block other work?
5. **Context**: How does this fit with other tasks?

${
  context?.existingTasks?.length
    ? `
**Existing Tasks for Context:**
${context.existingTasks
  .slice(0, 5)
  .map(
    (task: any) =>
      `- ${task.title} (${task.priority} priority, ${
        task.completed ? "completed" : "pending"
      })`
  )
  .join("\n")}
`
    : ""
}

Respond with a JSON object in this exact format:
{
  "priority": "low" | "medium" | "high",
  "score": number between 0-100,
  "reasoning": "Brief explanation of why this priority was chosen",
  "suggestions": ["optional array of actionable suggestions to improve task completion"]
}

Priority Guidelines:
- **High (70-100)**: Urgent deadlines, critical for goals, blocks other work
- **Medium (30-69)**: Important but not urgent, moderate impact
- **Low (0-29)**: Nice to have, no deadline pressure, minimal impact

Return only the JSON object, no additional text.`;

    return prompt;
  }

  /**
   * Validate AI response format
   */
  private isValidPriorityResult(result: any): result is TaskPriorityResult {
    return (
      result &&
      typeof result === "object" &&
      ["low", "medium", "high"].includes(result.priority) &&
      typeof result.score === "number" &&
      result.score >= 0 &&
      result.score <= 100 &&
      typeof result.reasoning === "string" &&
      result.reasoning.length > 0
    );
  }

  /**
   * Fallback priority calculation when AI fails
   */
  private getFallbackPriority(
    title: string,
    description?: string
  ): TaskPriorityResult {
    const text = `${title} ${description || ""}`.toLowerCase();

    // Rule-based priority detection
    const urgentKeywords = [
      "urgent",
      "asap",
      "deadline",
      "due",
      "emergency",
      "critical",
      "important",
    ];
    const highPriorityKeywords = [
      "meeting",
      "presentation",
      "report",
      "review",
      "project",
      "client",
    ];
    const lowPriorityKeywords = [
      "later",
      "someday",
      "maybe",
      "nice to have",
      "optional",
      "when possible",
    ];

    let score = 50; // Default medium priority
    let priority: "low" | "medium" | "high" = "medium";
    let reasoning = "Determined using rule-based fallback analysis";

    // Check for urgent keywords
    if (urgentKeywords.some((keyword) => text.includes(keyword))) {
      score = 85;
      priority = "high";
      reasoning = "Contains urgent or deadline-related keywords";
    }
    // Check for high priority keywords
    else if (highPriorityKeywords.some((keyword) => text.includes(keyword))) {
      score = 65;
      priority = "medium";
      reasoning = "Contains work-related or project keywords";
    }
    // Check for low priority keywords
    else if (lowPriorityKeywords.some((keyword) => text.includes(keyword))) {
      score = 25;
      priority = "low";
      reasoning = "Contains low priority or optional keywords";
    }

    // Adjust based on title length (longer titles might be more complex)
    if (title.length > 50) {
      score += 10;
    }

    // Adjust based on description presence
    if (description && description.length > 100) {
      score += 5;
    }

    // Ensure score stays within bounds
    score = Math.max(0, Math.min(100, score));

    // Update priority based on final score
    if (score >= 70) priority = "high";
    else if (score >= 30) priority = "medium";
    else priority = "low";

    return {
      priority,
      score,
      reasoning: `${reasoning} (Fallback analysis)`,
      suggestions: [
        "Consider adding more details to help with better prioritization",
        "Set a specific deadline if this task is time-sensitive",
      ],
    };
  }

  /**
   * Get AI-powered task suggestions based on title
   */
  async getTaskSuggestions(title: string): Promise<{
    success: boolean;
    suggestions?: string[];
    error?: string;
  }> {
    try {
      const prompt = `
Given this task title: "${title}"

Provide 3-5 specific, actionable suggestions to help complete this task effectively.
Focus on concrete steps, tools, or approaches that would be helpful.

Respond with a JSON array of strings:
["suggestion 1", "suggestion 2", "suggestion 3"]

Keep suggestions concise and practical.`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a productivity assistant. Provide helpful, actionable suggestions for completing tasks. Respond only with valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: this.model,
        temperature: 0.7,
        max_completion_tokens: 300,
      });

      const response = chatCompletion.choices[0]?.message?.content;

      if (!response) {
        throw new Error("No response from AI service");
      }

      const suggestions = JSON.parse(response) as string[];

      if (!Array.isArray(suggestions)) {
        throw new Error("Invalid suggestions format");
      }

      return {
        success: true,
        suggestions: suggestions.slice(0, 5), // Limit to 5 suggestions
      };
    } catch (error: any) {
      console.error("AI suggestions error:", error);
      return {
        success: false,
        error: error.message || "Failed to get AI suggestions",
      };
    }
  }
}

export const aiService = new AIService();
export default aiService;
