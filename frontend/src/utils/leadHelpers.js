import { isToday, parseISO } from 'date-fns';

/**
 * Sorts leads so that "Today's Follow-ups" are always at the top of the list.
 * Within the pinned and unpinned groups, they are sorted by nextFollowUp date (earliest first),
 * or by creation date if no follow-up is set.
 */
export const sortLeads = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];

  const todayFollowUps = [];
  const otherLeads = [];

  leads.forEach((lead) => {
    if (lead.nextFollowUp && isToday(parseISO(lead.nextFollowUp))) {
      todayFollowUps.push(lead);
    } else {
      otherLeads.push(lead);
    }
  });

  // Sort within groups
  const sortByDate = (a, b) => {
    const dateA = a.nextFollowUp ? new Date(a.nextFollowUp).getTime() : new Date(a.createdAt).getTime();
    const dateB = b.nextFollowUp ? new Date(b.nextFollowUp).getTime() : new Date(b.createdAt).getTime();
    return dateA - dateB; // Ascending order
  };

  todayFollowUps.sort(sortByDate);
  otherLeads.sort(sortByDate);

  return [...todayFollowUps, ...otherLeads];
};
