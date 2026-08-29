import React, { useState } from 'react';
import { FoodItem, Package } from '../../types';
import { api } from '../../services/api';
import { Coffee, Plus, Check, Sparkles, Tag, Layers, Flame, DollarSign, X } from 'lucide-react';

interface FoodPackageManagerProps {
  foodMenu: FoodItem[];
  packages: Package[];
  onFoodAdded: (food: FoodItem) => void;
}

export const FoodPackageManager: React.FC<FoodPackageManagerProps> = ({
  foodMenu,
  packages,
  onFoodAdded
}) => {
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Snacks' | 'Hot Food' | 'Dessert' | 'Drinks'>('Snacks');
  const [price, setPrice] = useState(8);
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('5-8 mins');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newItem = await api.addFoodItem({
        name,
        category,
        price: Number(price),
        description,
        prepTime,
        available: true,
        imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=400&q=80'
      });
      onFoodAdded(newItem);
      setIsAddFoodOpen(false);
      setName('');
      setDescription('');
    } catch (err) {
      console.error(err);
      alert('Failed to add food item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Experience Packages Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-white font-['Outfit']">
              Open-Sky Experience Bundles
            </h3>
            <p className="text-xs text-slate-400">
              Curated add-on packages with blankets, snacks, and VIP comforts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-white">{pkg.name}</h4>
                  {pkg.popular && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">{pkg.description}</p>
                <div className="mt-3 space-y-1">
                  {pkg.includes.map((inc, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-xs text-slate-300">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Price:</span>
                <span className="text-base font-extrabold text-amber-400">
                  {pkg.price === 0 ? 'Standard ($0)' : `$${pkg.price.toFixed(2)}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food & Beverage Menu Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-white font-['Outfit']">
              Food & Drinks Menu (At-Seat Delivery)
            </h3>
            <p className="text-xs text-slate-400">
              Manage snacks, artisan flatbreads, warm cider, and campfire treats.
            </p>
          </div>

          <button
            onClick={() => setIsAddFoodOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Menu Item</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {foodMenu.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h4 className="font-bold text-xs text-white leading-tight">{item.name}</h4>
                  <span className="text-[10px] text-slate-400 block">{item.category}</span>
                  <span className="text-xs font-extrabold text-amber-400 block mt-1">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{item.prepTime}</span>
                <span className="text-emerald-400 font-medium">In Stock</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Food Item Modal */}
      {isAddFoodOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-white">
            <button
              onClick={() => setIsAddFoodOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold font-['Outfit'] mb-4">Add Food/Drink Item</h3>
            <form onSubmit={handleAddFood} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cinnamon Churro Bites"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="Snacks">Snacks</option>
                    <option value="Hot Food">Hot Food</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Warm cinnamon sugar churros with dark chocolate dip"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddFoodOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
