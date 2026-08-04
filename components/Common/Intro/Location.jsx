import { DETAILS } from '../../../constants/constants';

const Location = ({ contacts }) => {
  const residence = contacts?.residence || DETAILS.Residence;
  const city = contacts?.city || DETAILS.City;

  return (
    <div className="flex flex-col space-y-1 pt-6">
      <div className="flex items-center justify-between">
        <span className="text-Snow text-xs font-bold">Residence</span>
        <span className="text-xs text-gray-400">{residence}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-Snow text-xs font-bold">City</span>
        <span className="text-xs text-gray-400">{city}</span>
      </div>
    </div>
  );
};

export default Location;
