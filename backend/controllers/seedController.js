import Lead from '../models/Lead.js';
import Discussion from '../models/Discussion.js';

const generateRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const generateSeedData = async (req, res) => {
  try {
    const statuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
    
    const leadTemplates = [
      { name: 'Alice Cooper', company: 'TechNova', phone: '+1 555-0101' },
      { name: 'Bob Singer', company: 'Global Ind.', phone: '+1 555-0102' },
      { name: 'Charlie Day', company: 'Paddy\'s Pub', phone: '+1 555-0103' },
      { name: 'Diana Prince', company: 'Themyscira', phone: '+1 555-0104' },
      { name: 'Evan Wright', company: 'Rolling Stone', phone: '+1 555-0105' },
      { name: 'Fiona Gallagher', company: 'Patsy\'s Pies', phone: '+1 555-0106' },
      { name: 'George Costanza', company: 'Vandelay Ind.', phone: '+1 555-0107' },
      { name: 'Helen Parr', company: 'Metroville', phone: '+1 555-0108' }
    ];

    // Pick a random number between 5 and 8
    const numLeads = Math.floor(Math.random() * 4) + 5;
    
    // Shuffle and slice
    const shuffled = [...leadTemplates].sort(() => 0.5 - Math.random());
    const selectedLeads = shuffled.slice(0, numLeads);

    const createdLeads = [];

    for (const leadData of selectedLeads) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Random nextFollowUp: Some overdue (past), some today, some future
      const now = new Date();
      let nextFollowUp = null;
      
      if (status !== 'Won' && status !== 'Lost') {
        const type = Math.random();
        if (type < 0.3) {
          // Overdue
          nextFollowUp = new Date(now.getTime() - 86400000 * (Math.floor(Math.random() * 5) + 1));
        } else if (type < 0.6) {
          // Today
          nextFollowUp = now;
        } else {
          // Future
          nextFollowUp = new Date(now.getTime() + 86400000 * (Math.floor(Math.random() * 5) + 1));
        }
      }

      const lead = await Lead.create({
        ...leadData,
        status,
        nextFollowUp
      });

      // Add 1 or 2 random discussions
      const numDiscussions = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < numDiscussions; i++) {
        await Discussion.create({
          leadId: lead._id,
          content: `Random auto-generated note ${i + 1} during seeding. Status is currently ${status}.`,
          followUpDate: nextFollowUp,
        });
      }

      createdLeads.push(lead);
    }

    res.status(201).json({ message: 'Seed data generated successfully', count: createdLeads.length });
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({ message: 'Error generating seed data' });
  }
};
