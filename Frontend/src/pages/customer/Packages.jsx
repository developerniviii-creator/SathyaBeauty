import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/packages/');
        if (res.ok) {
          const data = await res.json();
          setPackages(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading premium packages...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Premium Packages</h1>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Discover our carefully curated beauty packages designed to give you the ultimate pampering experience at an incredible value.</p>
      
      {packages.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No packages available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 flex flex-col hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {pkg.image && (
                <div className="h-48 w-full">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="bg-primary/10 p-8 text-center border-b border-primary/20">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                <div className="text-4xl font-extrabold text-primary">₹{pkg.price}</div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                {pkg.description && (
                  <p className="text-gray-600 mb-6 italic border-l-4 border-primary pl-4">{pkg.description}</p>
                )}
                
                <h4 className="font-bold text-gray-700 mb-3">Included Services:</h4>
                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.services && pkg.services.map((service) => (
                    <li key={service.id} className="flex items-center text-gray-700">
                      <FaCheck className="text-green-500 mr-3 shrink-0" />
                      <span>{service.name}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/book" state={{ service: pkg.name, price: pkg.price }} className="block text-center w-full bg-gray-900 hover:bg-primary text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-auto">
                  Select Package
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Packages;
