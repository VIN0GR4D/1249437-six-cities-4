import { FC } from 'react';
import MainPage from './pages/main/MainPage';

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { LoginPage } from './pages/login/LoginPage';
import { FavoritesPage } from './pages/favourites/FavouritesPage';
import { OfferPage } from './pages/offer/OfferPage';
import NotFoundPage from './pages/notFound/NotFoundPage';
import Private from './components/Private';
import { FAVOURITES_URL, LOGIN_URL, MAIN_URL, OFFER_URL } from './const/links';
import { Offer } from './types/offer';
import { fetchOffersList } from './state/actions';
import { useAppDispatch } from './state';

export interface AppProps {
    offers: Offer[];
}

const App: FC<AppProps> = () => {
  const dispatch = useAppDispatch();
  dispatch(fetchOffersList());

  return (
    <BrowserRouter>
      <Routes>
        <Route path={MAIN_URL}>
          <Route index element={<MainPage/>} />
          <Route path={LOGIN_URL} element={<LoginPage/>} />
          <Route path={`${OFFER_URL}/:id`} element={<OfferPage />} />
          <Route path={FAVOURITES_URL} element={
            <Private toUrl={LOGIN_URL}>
              <FavoritesPage />
            </Private>
          }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
