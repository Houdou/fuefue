export class Utils {
	static Lerp(value1, value2, percentage): number {
	    if(percentage < 0) return value1;
	    if(percentage > 1) return value2;
	    return value1 + (value2 - value1) * percentage;
	}

	static ADSR(t, attackDuration, decayDuration, sustainDuration, sustainLevel, releaseDuration): number {
		let envelop = 1;
		if(t <= attackDuration) {
	        return this.Lerp(0, 1, t / attackDuration);
	    } else {
	        t -= attackDuration;
	        if(t <= decayDuration) {
	            return this.Lerp(1, sustainLevel, t / decayDuration);
	        } else {
	            t -= decayDuration;
	            if(t <= sustainDuration) {
	                envelop = sustainLevel;
	            } else {
	                t -= sustainDuration;
	                return this.Lerp(sustainLevel, 0, t / releaseDuration);
	            }
	        }
	    }
	    return envelop;
	}
}