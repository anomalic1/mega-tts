export interface PresetScript {
  id: string
  label: string
  text: string
}

export const PRESET_SCRIPTS: readonly PresetScript[] = [
  {
    id: 'casual',
    label: 'Casual Conversation',
    text:
      "Hey, good to see you again! I was just thinking about that trip we talked about — turns out the weather's supposed to be perfect this weekend. Nothing fancy, just good coffee and better company. What do you say?",
  },
  {
    id: 'narrative',
    label: 'Narrative Audio',
    text:
      'The harbor was quiet in the blue hour before dawn. Gulls drifted between the masts like thoughts that hadn\'t yet found their words. Far out past the breakwater, the first fishing boat traced a slow silver line across the water, and the town — still asleep — kept its secrets for one more hour.',
  },
  {
    id: 'presentation',
    label: 'Professional Presentation',
    text:
      "Good morning, and thank you for joining us. Over the next few minutes, I'll walk you through three key findings from this quarter's research. First, adoption grew faster than projected. Second, retention held steady across every segment. And third — the one I find most interesting — our users are asking for depth over breadth. Let's begin with the numbers.",
  },
] as const
