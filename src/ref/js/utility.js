function lerp(value1, value2, percentage) {
    if(percentage < 0) return value1;
    if(percentage > 1) return value2;
    return value1 + (value2 - value1) * percentage;
}

function adsr(t, attackDuration, decayDuration, sustainDuration, sustainLevel, releaseDuration) {
	let envelop = 1;
	if(t <= attackDuration) {
        envelop = lerp(0, 1, t / attackDuration);
    } else {
        t -= attackDuration;
        if(t <= decayDuration) {
            envelop = lerp(1, sustainLevel, t / decayDuration)
        } else {
            t -= decayDuration;
            if(t <= sustainDuration) {
                envelop = sustainLevel;
            } else {
                t -= sustainDuration;
                envelop = lerp(sustainLevel, 0, t / releaseDuration);
            }
        }
    }
    return envelop;
}