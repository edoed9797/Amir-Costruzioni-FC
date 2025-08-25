import React from 'react';
import Image from '../../../components/AppImage';

const TeamBanner = ({ team }) => {
  return (
    <div className="relative h-48 md:h-56 overflow-hidden rounded-lg mb-6">
      <Image
        src={team?.photo}
        alt={`${team?.name} team photo`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">{team?.name}</h1>
        <p className="text-sm md:text-base opacity-90">{team?.league} • Season {team?.season}</p>
      </div>
    </div>
  );
};

export default TeamBanner;