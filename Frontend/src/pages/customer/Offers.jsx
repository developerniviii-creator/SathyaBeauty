import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPercent, FaClock } from 'react-icons/fa';

const Offers = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/offers/');
        if (res.ok) {
          const data = await res.json();
          // Assuming active offers are returned, or filter them here if needed
          setOffers(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="container mx-auto px-6 py-12 font-sans relative">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="flex flex-col items-center justify-center mb-12 relative z-10">
        <div className="flex items-center">
          <FaPercent className="text-4xl text-pink-500 mr-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">Special Combo Offers</h1>
        </div>
        <p className="text-gray-500 mt-4 text-lg font-medium text-center max-w-2xl">
          Treat yourself to our premium beauty packages at exclusive discounted prices. 
          Limited time only!
        </p>
      </div>
      
      {offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-pink-200 rounded-3xl bg-pink-50/50 max-w-3xl mx-auto relative z-10">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-pink-400 shadow-sm">
            <FaPercent size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No active offers at the moment</h3>
          <p className="text-gray-500 max-w-sm mt-2 font-medium">Check back later for exclusive beauty combo deals!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {offers.map((offer) => (
            <div key={offer.id} className="relative bg-white rounded-3xl p-1 shadow-xl shadow-pink-100/50 hover:shadow-2xl hover:shadow-pink-200/60 overflow-hidden group transition-all duration-300 transform hover:-translate-y-1">
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              
              <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold px-5 py-2 rounded-bl-2xl z-20 shadow-sm">
                Limited Time
              </div>
              
              <div className="bg-white rounded-[23px] h-full flex flex-col justify-between relative z-10 overflow-hidden">
                {/* Offer Image Header */}
                {offer.image && (
                  <div className="w-full h-48 sm:h-64 relative">
                    <img src={offer.image} alt={offer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-6">
                      <h3 className="text-3xl font-extrabold text-white shadow-sm mb-1">{offer.name}</h3>
                    </div>
                  </div>
                )}

                <div className={`p-8 pt-6 ${offer.image ? '' : 'mt-4'} flex flex-col flex-1`}>
                  {!offer.image && (
                    <h3 className="text-3xl font-extrabold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">{offer.name}</h3>
                  )}
                  
                  {offer.duration && (
                    <div className="text-sm text-gray-500 flex items-center mb-4 font-medium bg-gray-50 inline-flex px-3 py-1.5 rounded-lg border border-gray-100 w-max">
                      <FaClock className="mr-2 text-purple-500" /> {offer.duration}
                    </div>
                  )}

                  {/* Services List */}
                  {offer.services_included && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {offer.services_included.split(', ').map((srv, idx) => (
                        <span key={idx} className="bg-pink-50 text-pink-600 text-xs font-bold px-3 py-1.5 rounded-full border border-pink-100">
                          {srv}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end space-x-4 mb-2 mt-auto">
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                      ₹{offer.offer_price}
                    </span>
                    <div className="flex flex-col mb-1.5">
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-0.5">Value</span>
                      <span className="text-xl text-gray-400 line-through font-bold">₹{offer.original_price}</span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <span className="inline-block bg-green-50 border border-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-lg">
                      Save ₹{Number(offer.original_price) - Number(offer.offer_price)}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 pt-0 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 mt-2 gap-4">
                  <div className="flex items-center text-sm font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-xl mt-4 sm:mt-0">
                    <FaClock className="mr-2 text-pink-500" />
                    Valid until {offer.valid_until}
                  </div>
                  <Link 
                    to="/book" 
                    state={{ 
                      service: `Combo Offer: ${offer.name}`, 
                      price: Number(offer.offer_price) 
                    }}
                    className="w-full sm:w-auto text-center bg-gray-900 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-4 sm:mt-0"
                  >
                    Claim Offer
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Offers;
