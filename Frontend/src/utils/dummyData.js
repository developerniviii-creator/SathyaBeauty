export const mockServices = [
  { id: 2, category: 'Beauty Care', name: 'Gold Facial', description: 'Rejuvenating gold facial for glowing skin.', price: 1200, duration: '60 mins', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=600', status: 'Active' },
  { id: 3, category: 'Beauty Care', name: 'Bridal Makeup', description: 'Complete bridal makeup package including hair and draping.', price: 15000, duration: '180 mins', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=600', status: 'Active' },
  { id: 4, category: 'Beauty Care', name: 'Wax, Detan & Bleach', description: 'Full body wax, detan and bleach package.', price: 1500, duration: '90 mins', image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&q=80&w=600', status: 'Active' },
  { id: 5, category: 'Mehandi', name: 'Bridal Mehandi', description: 'Intricate bridal mehandi design for full hands and legs.', price: 3500, duration: '120 mins', image: 'https://images.unsplash.com/photo-1594951167448-6a5cb68d87ea?auto=format&fit=crop&q=80&w=600', status: 'Active' },
  { id: 6, category: 'Hair Extensions', name: '24" Premium Extensions', description: 'Premium quality 24 inch hair extensions.', price: 5000, duration: '120 mins', image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600', status: 'Active' },
];

export const mockPackages = [
  { id: 1, name: 'Bridal Glow Package', price: 25000, duration: '3 Days', description: 'Pre-bridal + Bridal makeup + Mehandi + Hair extension.', services: ['Gold Facial', 'Bridal Makeup', 'Mehandi', 'Hair Extension'] },
  { id: 2, name: 'Weekend Pamper', price: 3000, duration: '3 Hours', description: 'Relaxing spa, facial and pedicure.', services: ['Spa', 'Facial', 'Pedicure'] },
];

export const mockBookings = [
  { id: 'BKG-001', customer: 'Alice Smith', service: 'Gold Facial', type: 'Parlour', date: '2026-08-10', time: '10:00 AM', status: 'Pending', paymentStatus: 'Advance Paid', totalPrice: 1200, advancePaid: 240, pendingAmount: 960 },
  { id: 'BKG-002', customer: 'Alice Smith', service: 'Bridal Makeup', type: 'Home', date: '2026-08-12', time: '06:00 AM', status: 'Accepted', paymentStatus: 'Full Paid', totalPrice: 15000, advancePaid: 15000, pendingAmount: 0 },
  { id: 'BKG-003', customer: 'Alice Smith', service: 'Advanced Haircut', type: 'Parlour', date: '2026-08-05', time: '02:00 PM', status: 'Completed', paymentStatus: 'Full Paid', totalPrice: 500, advancePaid: 500, pendingAmount: 0 },
];

export const mockOffers = [
  { id: 1, name: 'Monsoon Magic', originalPrice: 2000, offerPrice: 1499, description: 'Haircut + Spa combo', validUntil: '2026-08-31' },
];

export const mockReviews = [
  { id: 1, customer: 'Jane Doe', rating: 5, comment: 'Absolutely loved the service! Very professional.', date: '2026-08-01' },
  { id: 2, customer: 'Maria Garcia', rating: 4, comment: 'Great facial, very relaxing environment.', date: '2026-08-02' },
];
