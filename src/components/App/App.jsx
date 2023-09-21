import { useState, useEffect } from 'react';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallary } from 'components/ImageGallary/ImageGallary';
import { Modal } from 'components/Modal/Modal';
import { Button } from 'components/Button/Button';
import { ThreeDots } from 'react-loader-spinner';
import { fetchPhotos } from '../../services/api';
import css from './App.module.css';

export const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedHit, setSelectedHit] = useState(null);
  const [loadMore, setLoadMore] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetchPhotos(query, page)
      .then(data => {
        const newImages = page === 1 ? data.hits : [...images, ...data.hits];
        setImages(newImages);
        setLoading(false);
        setError(null);
        setLoadMore(page + 1 < Math.ceil(data.totalHits / 12));
      })
      .catch(error => {
        setError(error);
        setLoading(false);
        setImages([]);
      });
  }, [query, page]);

  const handleSetQuery = (query, page = 1) => {
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const toggleModal = selectedHit => {
    setShowModal(!showModal);
    setSelectedHit(selectedHit);
  };
  const loadMoreImages = () => {
    if (loading) {
      return;
    }
    setLoading(false);
    setPage(prevPage => prevPage + 1);
    setError(null);
  };

  return (
    <div className={css.container}>
      <Searchbar onSubmit={handleSetQuery} />
      <ImageGallary images={images} openModal={toggleModal} />

      {images.length > 0 && loadMore && <Button action={loadMoreImages} />}

      {loading && (
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="tomato"
          ariaLabel="three-dots-loading"
          wrapperStyle={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          wrapperClassName={css.loader}
          visible={loading}
        />
      )}

      {showModal && <Modal selectedHit={selectedHit} onClose={toggleModal} />}

      {error && <p>{error.message}</p>}
    </div>
  );
};
