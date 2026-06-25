import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Bell, Save, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store';

const profileSchema = z.object({
  age: z.string().optional(),
  state: z.string().optional(),
  occupation: z.string().optional(),
  monthly_income: z.string().optional(),
  family_size: z.coerce.number().min(1).default(1),
  has_land: z.boolean().default(false),
  land_size_acres: z.coerce.number().min(0).default(0),
});

const Profile = ({ onBack }) => {
  const { t } = useTranslation();
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  const hasLand = watch('has_land');

  const onSubmit = (data) => {
    updateProfile(data);
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="flex items-center text-sm font-medium mb-6 hover:text-gray-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </motion.button>

      <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg">
        <div className="flex items-center mb-6 border-b-2 border-gray-200 pb-4">
          <div className="bg-blue-100 p-3 rounded-full mr-4 border-2 border-black">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold">Your Profile</h2>
            <p className="text-sm text-gray-600">Save your details for faster eligibility checks.</p>
          </div>
        </div>

        {/* Proactive Alerts Pitch */}
        <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-md mb-8 flex items-start">
          <Bell className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-yellow-800 text-sm">Proactive Scheme Alerts</h3>
            <p className="text-xs text-yellow-700 mt-1">
              When a new scheme is announced in the budget tomorrow, SarkariSaathi will proactively notify you if you are eligible based on these details!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold block">Age</label>
              <input
                {...register('age')}
                type="number"
                placeholder="e.g. 25"
                className="w-full p-3 border-2 border-black rounded focus:ring-0 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">State</label>
              <select
                {...register('state')}
                className="w-full p-3 border-2 border-black rounded focus:ring-0 focus:outline-none focus:border-blue-500 transition-colors bg-white"
              >
                <option value="">Select State/UT</option>
                <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                <option value="Delhi">Delhi</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Puducherry">Puducherry</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">Occupation</label>
              <input
                {...register('occupation')}
                placeholder="e.g. Farmer, Student, Vendor"
                className="w-full p-3 border-2 border-black rounded focus:ring-0 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">Monthly Income (₹)</label>
              <input
                {...register('monthly_income')}
                type="number"
                placeholder="e.g. 15000"
                className="w-full p-3 border-2 border-black rounded focus:ring-0 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold block">Family Size</label>
              <input
                {...register('family_size')}
                type="number"
                min="1"
                className="w-full p-3 border-2 border-black rounded focus:ring-0 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 border-t-2 border-gray-100">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="has_land"
                {...register('has_land')}
                className="w-5 h-5 border-2 border-black rounded mr-3 accent-black"
              />
              <label htmlFor="has_land" className="font-bold text-sm cursor-pointer">
                Do you own agricultural land?
              </label>
            </div>

            {hasLand && (
              <div className="space-y-2 pl-8">
                <label className="text-sm font-bold block">Land Size (in acres)</label>
                <input
                  {...register('land_size_acres')}
                  type="number"
                  step="0.1"
                  min="0"
                  className="w-full p-3 border-2 border-black rounded focus:ring-0 focus:outline-none focus:border-blue-500 transition-colors md:w-1/2"
                />
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white p-4 font-bold text-lg rounded border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-all flex items-center justify-center"
          >
            {isSubmitSuccessful ? 'Saved!' : 'Save Profile'}
            <Save className="w-5 h-5 ml-2" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
