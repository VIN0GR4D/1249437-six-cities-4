import { FC, useState } from 'react';
import { Offer } from '../../types/offer.ts';
import Card from './OfferCard';

export interface OffersListProps {
  offers: Offer[];
}

const OffersList: FC<OffersListProps> = ({ offers }) => {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <Card
          key={offer.id}
          offer={offer}
          onMouseEnter={() => setActiveOfferId(offer.id)}
          active={offer.id === activeOfferId}
        />
      ))}
    </div>
  );
};

export default OffersList;
