from typing import List, Dict, Any


def calculate_burnout_index(checkins: List[Dict[str, Any]], sentiments: List[float]) -> Dict[str, Any]:
    """
    Calculate a burnout score (0-100) from daily check-ins and journal sentiment.
    Returns score, zone label, and a narrative string.
    """
    # Demo score when no real data exists
    if not checkins and not sentiments:
        return {
            "score": 42,
            "zone": "Warning",
            "narrative": "Start journaling to get a more accurate picture of your burnout level."
        }

    # Sentiment contribution (0-100 scale, higher = more burned out)
    sentiment_score = 0.5
    if sentiments:
        sentiment_score = sum(sentiments) / len(sentiments)

    # Checkin contribution
    checkin_score = 0.5
    if checkins:
        # Average the stress/exhaustion fields if present
        vals = []
        for c in checkins:
            if "stress_level" in c:
                vals.append(c["stress_level"] / 10)
            elif "exhaustion" in c:
                vals.append(c["exhaustion"] / 10)
        if vals:
            checkin_score = sum(vals) / len(vals)

    # Combined weighted score
    raw = (sentiment_score * 0.6 + checkin_score * 0.4) * 100
    score = round(min(100, max(0, raw)))

    # Zone label
    if score >= 75:
        zone = "Critical Burnout"
        narrative = "Your readings are in a critical range. Please take time for yourself and consider reaching out for support."
    elif score >= 50:
        zone = "Warning"
        narrative = "You're showing signs of significant emotional fatigue. Small acts of self-care matter right now."
    elif score >= 25:
        zone = "Moderate"
        narrative = "You're managing, but the weight is there. Keep checking in with yourself."
    else:
        zone = "Stable"
        narrative = "You're in a relatively stable place emotionally. Keep up whatever you're doing for yourself."

    return {"score": score, "zone": zone, "narrative": narrative}
