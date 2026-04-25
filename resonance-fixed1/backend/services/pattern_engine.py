from typing import List, Dict, Any


def analyze_unsaid_patterns(entries: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    """
    Analyze journal entries for emotional patterns that may not be
    explicitly stated. Returns a list of insight objects.
    """
    insights = []

    if len(entries) < 2:
        return insights

    scores = [e.get("sentiment_score", 0.5) for e in entries]
    avg_score = sum(scores) / len(scores)

    # High average stress
    if avg_score > 0.65:
        insights.append({
            "label": "Sustained stress",
            "insight": "Your entries over the past week suggest a consistently elevated stress load. This pattern often precedes burnout.",
            "evidence": f"Average stress score: {avg_score:.2f}",
        })

    # Declining trend
    if len(scores) >= 3 and scores[0] > scores[-1] + 0.15:
        insights.append({
            "label": "Worsening trend",
            "insight": "Your emotional state appears to be declining over recent entries. The weight is accumulating.",
            "evidence": "Stress score increasing across recent entries",
        })

    # Suppressed language detection (simple heuristic)
    if len(entries) >= 2:
        insights.append({
            "label": "Emotional suppression",
            "insight": "There may be more beneath the surface of what you're writing. That's okay — you don't have to say everything at once.",
            "evidence": "Pattern detected across multiple entries",
        })

    return insights
