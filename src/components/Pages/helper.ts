import { ReportingAPI } from '../../../types';

/* License IDs
1 - prime
2 - active
3 - latent
4 - disable
5 - waitlist
6 - pause
*/

export function getMemberTooltip(member: any) {
    if (member.candidate_license === 4 && member.cariclub_role === 5)
        return { title: 'Unmatched & Rescinded', color: 'red', shape: 'square' };
    if (member.cariclub_role === 3) {
        if ([2, 3].includes(member.candidate_license as number))
            return { title: 'Matched & Licensed', color: 'purple', shape: 'circle' };
        else if ([1].includes(member.candidate_license as number))
            return { title: 'Matched & Exempted', color: 'purple', shape: 'squre' };
    } else if (member.cariclub_role === 9) {
        if ([2, 4].includes(member.candidate_license as number))
            return { title: 'Applied & Licensed', color: 'blue', shape: 'circle' };
        else if ([1].includes(member.candidate_license as number))
            return { title: 'Applied & Exempted', color: 'blue', shape: 'square' };
    } else if (member.cariclub_role === 5) {
        if ([2, 3].includes(member.candidate_license as number))
            return { title: 'Unmatched & Licensed', color: 'gray', shape: 'circle' };
        else if ([1].includes(member.candidate_license as number))
            return { title: 'Unmatched & Exempted', color: 'gray', shape: 'square' };
        else return { title: 'Unmatched', color: 'gray', shape: 'square' };
    }

    if (member.candidate_license === 2) {
        return { title: 'Active & Licensed', color: 'green', shape: 'circle' };
    } else if (member.candidate_license === 3) {
        return { title: 'Loitering & Licensed', color: 'yellow', shape: 'circle' };
    } else if ([6, 5].includes(member.candidate_license as number)) {
        return { title: 'Loitering & Unlicensed', color: 'yellow', shape: 'square' };
    } else if (member.candidate_license === 1) return { title: 'Unmatched or Exempt', color: 'gray', shape: 'square' };

    return { title: 'Unknown', color: 'gray', shape: 'square' };
}
